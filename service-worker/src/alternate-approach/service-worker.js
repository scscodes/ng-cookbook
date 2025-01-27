const CACHE_NAME = 'my-app-cache-v2';
const BACKEND_URL = 'https://your-flask-backend/api'; // Replace with your Flask API URL

// Cache assets and API responses
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js', // Include other assets for offline use
];

// Install event: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event: Cache API responses and fallback to offline
self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(BACKEND_URL)) {
    // Handle backend requests
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    // Handle static assets
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});

// Connectivity monitoring
function checkBackendConnectivity() {
  return fetch(`${BACKEND_URL}/health-check`, { method: 'HEAD' })
    .then(() => {
      postMessageToClients({ type: 'connectivity', status: 'online' });
    })
    .catch(() => {
      postMessageToClients({ type: 'connectivity', status: 'offline' });
    });
}

// Periodically check backend connectivity
setInterval(checkBackendConnectivity, 10000); // Every 10 seconds

// Post messages to app
function postMessageToClients(message) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage(message));
  });
}
