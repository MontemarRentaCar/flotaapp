// Service worker mínimo — solo existe para que Chrome/Edge/Android
// consideren la app "instalable". No cachea nada de forma agresiva,
// así los clientes siempre ven la última versión al abrir con conexión.
const CACHE_NAME = 'flotaapp-shell-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Estrategia "network first": intenta red, si falla usa lo último cacheado.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
