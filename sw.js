// Service worker: guarda la app completa la primera vez y después funciona sin conexión.
// Al cambiar cualquier archivo, subí el número de versión para que los celulares actualicen.
const CACHE = 'supercalculadora-v1';
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './fonts/vt323.woff2',
  './fonts/press-start-2p.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).catch(() => caches.match('./index.html'));
    })
  );
});
