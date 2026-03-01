const CACHE = 'timetable-v4';
const ASSETS = [
    './',
    'index.html',
    'style.css',
    'app.js',
    'manifest.json',
    'favicon.png',
    'icon-192.png',
    'icon-512.png',
    'adhan.mp3',
    'adhan-fajr.mp3',
    'task-done.mp3',
    'notification.mp3',
    'alarm.mp3'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => {
            console.log('Caching assets...');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // ── Prayer API Strategy: Network first, then Cache, then fallback ──
    if (url.hostname.includes('aladhan.com')) {
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE).then(cache => cache.put(e.request, clone));
                    return res;
                })
                .catch(() => caches.match(e.request).then(cached => {
                    if (cached) return cached;
                    return new Response('{}', { headers: { 'Content-Type': 'application/json' } });
                }))
        );
        return;
    }

    // ── Static Assets Strategy: Cache first, then Network ──
    e.respondWith(
        caches.match(e.request).then(cached => {
            return cached || fetch(e.request).then(res => {
                const clone = res.clone();
                caches.open(CACHE).then(cache => cache.put(e.request, clone));
                return res;
            });
        })
    );
});
