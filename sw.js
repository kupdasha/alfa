// Сервис-воркер отключен: снимает себя с устройства и отдает управление сети
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => { await caches.delete('alfa-html-1'); await self.registration.unregister(); })()));
