// Сервис-воркер страницы /alfa/: помнит HTML последнего удачного открытия.
// Сеть в приоритете; если workers.dev не ответил за 2,5 с, страница открывается из памяти браузера, а свежая версия подтянется в фоне.
// Файлы страницы приходят с jsDelivr по номеру коммита и лежат в обычном кеше браузера, их не трогаем.
// Отключить: заменить этот файл на версию с self.registration.unregister() в activate.
const CACHE = 'alfa-html-1', KEY = '/alfa/';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.mode !== 'navigate' || u.origin !== location.origin || u.pathname !== KEY) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE), saved = await cache.match(KEY);
    const net = fetch(KEY, { cache: 'no-store' }).then(r => { if (r.ok) e.waitUntil(cache.put(KEY, r.clone())); return r; });
    if (!saved) return net;
    const late = new Promise(res => setTimeout(() => res(saved), 2500));
    return Promise.race([net.catch(() => saved), late]);
  })());
});
