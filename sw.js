// Minimal Service Worker to enable PWA Installation and custom home screen icons
const CACHE_NAME = 'shortener-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './redirect.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {
        // Fallback in case some assets are missing during build/testing
      });
    })
  );
});

// Activate Event
self.addEventListener('activate', (e) => {
  // Clear old caches
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch Event (Offline fallback)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
