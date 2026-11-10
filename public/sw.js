// Service worker de NONOS: recibe las notificaciones push del back y las muestra,
// aunque la app esté cerrada. Lo registra src/utils/notificacionesPush.ts

// llega un push: el back manda { title, body, data: { alertaId, url } }
self.addEventListener("push", async (e) => {
  const { title, body, data } = JSON.parse(e.data.text());

  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      data,
      icon: "/logo/isotipo-192.png",
    })
  );
});

// tocan la notificación: si la app ya está abierta la enfoca en la pantalla del aviso,
// y si no, la abre ahí
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});
