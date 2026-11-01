// Service worker de NONOS: recibe las notificaciones push del back y las muestra,
// aunque la app esté cerrada. Lo registra src/utils/notificacionesPush.ts

// llega un push: el back manda { title, body, data: { alertaId, url } }
self.addEventListener("push", (evento) => {
  let datos = { title: "NONOS", body: "Tenés un aviso nuevo.", data: {} };
  try {
    if (evento.data) datos = evento.data.json();
  } catch {
    // si no viene en JSON, se muestra el texto tal cual
    if (evento.data) datos.body = evento.data.text();
  }

  evento.waitUntil(
    self.registration.showNotification(datos.title || "NONOS", {
      body: datos.body,
      data: datos.data || {},
    }),
  );
});

// tocan la notificación: se abre (o se enfoca) la app en la dirección que mandó el back
self.addEventListener("notificationclick", (evento) => {
  evento.notification.close();
  const url = (evento.notification.data && evento.notification.data.url) || "/";

  evento.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ventanas) => {
      for (const ventana of ventanas) {
        if ("focus" in ventana) {
          ventana.navigate(url);
          return ventana.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
