self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? event.data.text() : '' };
  }

  const data = payload.data || {};
  const esAlerta = Boolean(data.alertaId);

  event.waitUntil(
    self.registration.showNotification(payload.title || 'NONOS', {
      body: payload.body || 'Tenés una nueva notificación',
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      data,
      tag: esAlerta ? data.alertaId : undefined,
      renotify: esAlerta,
      requireInteraction: esAlerta,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { url, alertaId } = event.notification.data || {};
  const destino = new URL(url || '/', self.location.origin);
  if (alertaId) destino.searchParams.set('id', alertaId);
  if (destino.origin !== self.location.origin) return;

  event.waitUntil(
    (async () => {
      const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const ventana of ventanas) {
        if (new URL(ventana.url).origin === self.location.origin) {
          await ventana.focus();
          if ('navigate' in ventana) await ventana.navigate(destino.href);
          return;
        }
      }
      await self.clients.openWindow(destino.href);
    })()
  );
});