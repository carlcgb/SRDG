// Service Worker for La Soirée du Rire - Optimized for Performance
const CACHE_NAME = 'lasoireedurire-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

const urlsToCache = [
  '/',
  '/assets/styles/css/main.css',
  '/assets/styles/css/tilted.css',
  '/assets/images/logos/cgb.jpg',
  '/assets/images/icons/favicon.ico',
  '/manifest.json'
];

// Install event - cache critical resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Fetch event - optimized caching strategy
self.addEventListener('fetch', function(event) {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests except for fonts and images
  if (url.origin !== location.origin) {
    // Cache fonts and images from external sources
    if (url.pathname.includes('fonts.googleapis.com') || 
        url.pathname.includes('fonts.gstatic.com') ||
        request.destination === 'image') {
      event.respondWith(
        caches.open(DYNAMIC_CACHE).then(cache => {
          return cache.match(request).then(response => {
            if (response) {
              return response;
            }
            return fetch(request).then(fetchResponse => {
              cache.put(request, fetchResponse.clone());
              return fetchResponse;
            });
          });
        })
      );
    }
    return;
  }

  // Strategy for different types of resources
  if (request.destination === 'document') {
    // For HTML documents, try cache first, then network
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response;
        }
        return fetch(request).then(fetchResponse => {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } else if (request.destination === 'style' || 
             request.destination === 'script' || 
             request.destination === 'image') {
    // For static assets, cache first with network fallback
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response;
        }
        return fetch(request).then(fetchResponse => {
          const cacheToUse = request.destination === 'image' ? DYNAMIC_CACHE : STATIC_CACHE;
          return caches.open(cacheToUse).then(cache => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } else {
    // For other resources, network first with cache fallback
    event.respondWith(
      fetch(request).then(fetchResponse => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(request, fetchResponse.clone());
          return fetchResponse;
        });
      }).catch(() => {
        return caches.match(request);
      })
    );
  }
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
