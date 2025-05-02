const CACHE_NAME = 'LiOS-Colors-v1.1.4';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/main.js',
  '/assets/main.css',
  '/assets/favicon.png',
  'https://lios-open.web.app/LiOS_Open.css',
  'https://lios-colors.web.app/dist/custom_color_definitions.css',
  '/assets/style.css',
  "https://lios-open.web.app/Frosted_Glass.css",
  'https://lios-open.web.app/navigation.css',
    // Add other files you want available offline
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});