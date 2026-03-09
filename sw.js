// =========================================================
// sw.js — QR Prism Service Worker (v2.4)
// Cache-first for static assets, network-first for API
// =========================================================

const CACHE_NAME = 'qr-prism-v2.4.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/ui.js',
  './js/state.js',
  './js/qr-engine.js',
  './js/download.js',
  './js/scanner.js',
  './js/batch.js',
  './js/projects.js',
  './js/settings.js',
  './js/templates.js',
  './designs/patterns.js',
  './designs/eye-frames.js',
  './designs/eye-inners.js',
  './designs/frames.js',
  './designs/preset-templates.js',
  './manifest.json',
];

// ── Install ───────────────────────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(STATIC_ASSETS.map(url =>
        cache.add(url).catch(e => console.warn('[SW] Failed to cache:', url, e))
      ));
    })
  );
});

// ── Activate ──────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin (except CDN)
  if (request.method !== 'GET') return;

  // CDN resources: cache-first
  if (url.hostname.includes('cdnjs.cloudflare.com') || url.hostname.includes('fonts.google')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Same-origin: stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

// ── Strategies ────────────────────────────────────────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache  = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || await fetchPromise || new Response('Offline', { status: 503 });
}

// ── Background sync message ───────────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
