const CACHE_NAME = 'ultimo-baile-pwa-v4';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './logo-el_ultimo_baile.png',
    './manifest.json'
];

// Instalar Service Worker y guardar recursos estáticos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activar y limpiar cachés antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Estrategia de Fetch
self.addEventListener('fetch', event => {
    // Para llamadas a la API de TMDB o imágenes, usar 'Network First'
    if (event.request.url.includes('api.themoviedb.org') || event.request.url.includes('image.tmdb.org')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
    } else {
        // Para nuestros archivos estáticos, usar 'Cache First' con fallback a red
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    return cachedResponse || fetch(event.request);
                })
        );
    }
});
