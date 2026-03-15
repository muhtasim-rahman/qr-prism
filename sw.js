// =========================================================
// SW.JS — QR Prism v2.8
// Service Worker: cache-first strategy, offline support
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

const CACHE_VERSION   = 'qrp-v2.8.0';
const CACHE_STATIC    = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC   = `${CACHE_VERSION}-dynamic`;
const MAX_DYNAMIC     = 30;

// ── Files to cache immediately on install ────────────────────
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',

  // Design files
  './designs/patterns.js',
  './designs/eye-frames.js',
  './designs/eye-inners.js',
  './designs/frames.js',
  './designs/preset-templates.js',

  // App JS
  './js/firebase.js',
  './js/logos.js',
  './js/state.js',
  './js/qr-engine.js',
  './js/ui.js',
  './js/download.js',
  './js/templates.js',
  './js/projects.js',
  './js/settings.js',
  './js/scanner.js',
  './js/batch.js',
  './js/report.js',
  './js/app.js',

  // Brand assets
  './assets/logo&name-light.svg',
  './assets/logo&name-dark.svg',
  './assets/logo-light.svg',
  './assets/logo-dark.svg',
  './assets/logo-flat-dark.svg',
  './assets/banner.svg',

  // Icons
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',

  // Docs
  './docs.html',
];

// ── CDN resources to cache on first use ──────────────────────
const CDN_CACHE_DOMAINS = [
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ══════════════════════════════════════════════════════════
// INSTALL  — pre-cache static assets
// ══════════════════════════════════════════════════════════
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      // Cache what we can, skip failures (some assets may not exist yet)
      return Promise.allSettled(
        PRECACHE_URLS.map(url =>
          cache.add(url).catch(err => {
            console.warn(`[SW] Failed to cache: ${url}`, err.message);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ══════════════════════════════════════════════════════════
// ACTIVATE  — clean up old caches
// ══════════════════════════════════════════════════════════
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_STATIC && key !== CACHE_DYNAMIC)
          .map(key => {
            console.log(`[SW] Deleting old cache: ${key}`);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ══════════════════════════════════════════════════════════
// FETCH  — cache strategy per request type
// ══════════════════════════════════════════════════════════
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET, Chrome extensions, Firebase API calls
  if (req.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.hostname.includes('firebaseio.com')) return;
  if (url.hostname.includes('firebase.googleapis.com')) return;
  if (url.hostname.includes('identitytoolkit.googleapis.com')) return;
  if (url.hostname.includes('imgbb.com')) return;
  if (url.hostname.includes('api.imgbb.com')) return;

  // Google Fonts CSS — network-first (so new fonts load), fallback cache
  if (url.hostname === 'fonts.googleapis.com') {
    event.respondWith(_networkFirst(req, CACHE_DYNAMIC));
    return;
  }

  // Google Fonts files (woff2) — cache-first
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(_cacheFirst(req, CACHE_DYNAMIC));
    return;
  }

  // CDN libraries — cache-first (they're versioned, safe to cache long-term)
  if (CDN_CACHE_DOMAINS.some(d => url.hostname.includes(d))) {
    event.respondWith(_cacheFirst(req, CACHE_DYNAMIC));
    return;
  }

  // App HTML, CSS, JS — cache-first with network fallback + background update
  if (url.origin === self.location.origin) {
    event.respondWith(_staleWhileRevalidate(req));
    return;
  }

  // Everything else — network only
});

// ══════════════════════════════════════════════════════════
// STRATEGIES
// ══════════════════════════════════════════════════════════

/** Cache-first: serve from cache, fall back to network and store */
async function _cacheFirst(req, cacheName) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const response = await fetch(req);
    if (response.ok) await _putInCache(cacheName, req, response.clone());
    return response;
  } catch {
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

/** Network-first: try network, fall back to cache */
async function _networkFirst(req, cacheName) {
  try {
    const response = await fetch(req);
    if (response.ok) await _putInCache(cacheName, req, response.clone());
    return response;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Stale-while-revalidate: serve from cache immediately,
 * fetch fresh copy in background and update cache.
 * Falls back to network if not cached.
 */
async function _staleWhileRevalidate(req) {
  const cachedResponse = await caches.match(req);

  const fetchAndUpdate = fetch(req).then(async response => {
    if (response.ok) {
      await _putInCache(CACHE_STATIC, req, response.clone());
    }
    return response;
  }).catch(() => null);

  return cachedResponse || await fetchAndUpdate
    || new Response('Offline — please check your connection.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
       });
}

/** Store in cache, trim dynamic cache to MAX_DYNAMIC entries */
async function _putInCache(cacheName, req, response) {
  const cache = await caches.open(cacheName);
  await cache.put(req, response);

  // Trim dynamic cache
  if (cacheName === CACHE_DYNAMIC) {
    const keys = await cache.keys();
    if (keys.length > MAX_DYNAMIC) {
      await cache.delete(keys[0]);
    }
  }
}

// ══════════════════════════════════════════════════════════
// MESSAGE HANDLER  (from app: skip waiting, clear cache)
// ══════════════════════════════════════════════════════════
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
  }
});
