const CACHE = 'palgi-cc-v13';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png', './ale-m.mp3', './ale-f.mp3', './nice.mp3', './whistle.m4a', './kitsis.m4a'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: 'reload'}))))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
// network-first, bypassing the browser HTTP cache (so a new version shows on the next open), cache fallback offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const isPage = e.request.mode === 'navigate' || /\.(html|webmanifest)$|\/$/.test(new URL(e.request.url).pathname);
  const req = isPage ? new Request(e.request.url, {cache: 'no-store'}) : e.request;
  e.respondWith(fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
    .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('./index.html'))));
});
