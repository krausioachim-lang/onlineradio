const CACHE_NAME = 'radio-center-v1';
const ASSETS = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Instalarea Service Worker-ului și cache-uirea resurselor de bază
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activarea și ștergerea cache-ului vechi
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Strategia de fetch: Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Nu cache-uim stream-urile audio (ar bloca memoria)
  if (event.request.url.includes('stream') || event.request.url.includes('.mp3') || event.request.url.includes('.aac')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});