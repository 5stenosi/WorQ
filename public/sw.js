const CACHE_NAME = 'worq-cache-v1';

// Assets immediately cached during the service worker installation
const STATIC_ASSETS = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/offline.html',
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Immediately activate the service worker (without waiting for pages to close)
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', event => {
  // Removes old caches (name != CACHE_NAME) that are no longer needed
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim(); // Immediately takes control of open pages (without reloading them)
});

// Intercepts fetch requests (network requests)
self.addEventListener('fetch', event => {
  const { request } = event;

  const isApiRequest = request.url.includes('/api/');
  const isPostRequest = request.method !== 'GET';
  const isDynamicPage = ['/', '/login'].some(path =>
    request.url.endsWith(path)
  );
  const isHtmlRequest = request.headers.get('accept')?.includes('text/html');

  // Skip caching for API requests, POST requests, and dynamic pages (they go directly to the network)
  if (isApiRequest || isPostRequest || isDynamicPage) {
    return;
  }

  // For HTML pages: use network-first (offline fallback)
  if (isHtmlRequest) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Update the cache in the background
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        })
        // If the network is unavailable, return the cache or an offline page
        .catch(() => 
          caches.match(request).then(
            cached => cached || caches.match('/offline.html')
          )
        )
    );
    return;
  }

  // For static assets (CSS, JS, images): cache-first
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});