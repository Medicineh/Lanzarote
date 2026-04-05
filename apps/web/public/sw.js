self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('lanzarote-v1').then((cache) => cache.addAll(['/'])));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Alerta', body: 'Nueva notificación' };
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body }));
});
