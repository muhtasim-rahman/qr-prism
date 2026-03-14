// =========================================================
// SW.JS — QR Prism v2.7 Service Worker
// Cache-first strategy for local assets
// Author: Muhtasim Rahman (Turzo)
// =========================================================

const CACHE_NAME = 'qr-prism-v2.7';
const CACHE_VERSION = '2.7.0';

const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/state.js',
  './js/app.js',
  './js/ui.js',
  './js/qr-engine.js',
  './js/download.js',
  './js/templates.js',
  './js/projects.js',
  './js/settings.js',
  './js/scanner.js',
  './js/batch.js',
  './js/report.js',
  './js/logos.js',
  './designs/patterns.js',
  './designs/eye-frames.js',
  './designs/eye-inners.js',
  './designs/frames.js',
  './designs/preset-templates.js',
  './manifest.json',
  './README.md',
];

// Install: cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for local, network-first for CDN
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and chrome-extension
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // CDN assets: network-first with cache fallback
  const isCDN = url.hostname.includes('cdn.jsdelivr.net') ||
                url.hostname.includes('cdnjs.cloudflare.com') ||
                url.hostname.includes('fonts.googleapis.com') ||
                url.hostname.includes('fonts.gstatic.com');

  if (isCDN) {
    event.respondWith(
      fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Local assets: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
