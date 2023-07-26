// public/service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

workbox.setConfig({
  modulePathPrefix: 'https://storage.googleapis.com/workbox-cdn/releases/6.2.0/',
});

// Cache the main HTML page and the built static assets
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'html-cache',
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style' || request.destination === 'font',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-assets-cache',
  })
);

// Handle offline fallback
workbox.routing.setDefaultHandler(new workbox.strategies.NetworkFirst());

// Precache manifest
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static-cache').then((cache) => {
      return cache.addAll(['/index.html', '/manifest.json', '/favicon.ico', '/logo192.png', '/logo512.png']);
    })
  );
});

// Update the service worker on page load
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
