// ═══════════════════════════════════════════════
// QR Prism v2.5 — Service Worker
// Advanced offline caching strategy
// ═══════════════════════════════════════════════

const CACHE_VERSION = 'qr-prism-v2.5.0';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const CDN_CACHE     = `${CACHE_VERSION}-cdn`;

// Core app files to pre-cache
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/state.js',
  './js/qr-engine.js',
  './js/ui.js',
  './js/download.js',
  './js/templates.js',
  './js/projects.js',
  './js/settings.js',
  './js/scanner.js',
  './js/batch.js',
  './designs/patterns.js',
  './designs/eye-frames.js',
  './designs/eye-inners.js',
  './designs/frames.js',
  './designs/preset-templates.js',
  './manifest.json',
];

// CDN resources to cache on first use
const CDN_PATTERNS = [
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ── Install ──────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Pre-cache partial failure:', err))
  );
});

// ── Activate ─────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('qr-prism-') && k !== STATIC_CACHE && k !== CDN_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch Strategy ────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // CDN resources — Cache First, network fallback
  const isCDN = CDN_PATTERNS.some(p => url.hostname.includes(p));
  if (isCDN) {
    event.respondWith(cdnFirst(request));
    return;
  }

  // Same-origin app files — Network First, cache fallback
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request));
    return;
  }
});

// Network First (app files)
async function networkFirst(request) {
  try {
    const networkRes = await fetch(request);
    if (networkRes.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkRes.clone());
    }
    return networkRes;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Return offline page for navigation
    if (request.mode === 'navigate') {
      return caches.match('./index.html');
    }
    return new Response('Offline', { status: 503 });
  }
}

// Cache First (CDN resources)
async function cdnFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const networkRes = await fetch(request);
    if (networkRes.ok) {
      const cache = await caches.open(CDN_CACHE);
      cache.put(request, networkRes.clone());
    }
    return networkRes;
  } catch {
    return new Response('CDN resource unavailable offline', { status: 503 });
  }
}

// ── Message Handler ───────────────────────────────
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});
