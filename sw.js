// Service Worker Canônico do Portal Catecismo Católico
// Estratégia: Network-First garantido com fallback resiliente para offline
const CACHE_NAME = 'catecismo-v2-' + Date.now();

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // Requisições para API e sincronização NUNCA devem passar pelo cache do Service Worker
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    // Para páginas HTML e arquivos JSON de dados: sempre tenta a rede primeiro
    if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.includes('/data/')) {
        e.respondWith(
            fetch(e.request, { cache: 'no-cache' })
                .catch(() => caches.match(e.request))
        );
        return;
    }

    // Para os demais recursos estáticos: rede com fallback para cache
    e.respondWith(
        fetch(e.request)
            .catch(() => caches.match(e.request))
    );
});
