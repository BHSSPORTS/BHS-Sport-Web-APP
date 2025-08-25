const CACHE_NAME = 'bhs-sports-hub-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/passcode.html',
  '/analytics.html',
  '/input.html',
  '/results.html',
  '/team-sheets.html',
  '/team-stats.html',
  '/teacher-stats.html',
  '/Users.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/splash-screens/splash-320x568.png',
  '/splash-screens/splash-375x667.png',
  '/splash-screens/splash-390x844.png',
  '/splash-screens/splash-414x896.png',
  '/splash-screens/splash-428x926.png',
  '/splash-screens/splash-568x320.png',
  '/splash-screens/splash-667x375.png',
  '/splash-screens/splash-844x390.png',
  '/splash-screens/splash-896x414.png',
  '/splash-screens/splash-926x428.png',
  '/splash-screens/splash-768x1024.png',
  '/splash-screens/splash-834x1112.png',
  '/splash-screens/splash-834x1194.png',
  '/splash-screens/splash-1024x768.png',
  '/splash-screens/splash-1024x1366.png',
  '/splash-screens/splash-1112x834.png',
  '/splash-screens/splash-1194x834.png',
  '/splash-screens/splash-1366x1024.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Force update for existing installations
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
