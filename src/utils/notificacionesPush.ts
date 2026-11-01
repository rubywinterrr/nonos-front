import { pushTokenService } from "../services/pushTokenService";

// true si este navegador puede recibir notificaciones push
// (en iPhone solo funciona con la app agregada a la pantalla de inicio)
export function soportaPush() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

// el permiso actual: "granted" (dado), "denied" (bloqueado) o "default" (todavía no se pidió)
export function permisoActual() {
  if (!soportaPush()) return "denied";
  return Notification.permission;
}

// la clave VAPID viene en base64 "para URL"; el navegador la pide como bytes
function claveABytes(clave: string) {
  const relleno = "=".repeat((4 - (clave.length % 4)) % 4);
  const base64 = (clave + relleno).replaceAll("-", "+").replaceAll("_", "/");
  const texto = atob(base64);
  const bytes = new Uint8Array(texto.length);
  for (let i = 0; i < texto.length; i++) {
    bytes[i] = texto.charCodeAt(i);
  }
  return bytes;
}

// true si este celular ya está suscripto
export async function estaSuscripto() {
  if (!soportaPush()) return false;
  const registro = await navigator.serviceWorker.getRegistration("/sw.js");
  if (!registro) return false;
  const suscripcion = await registro.pushManager.getSubscription();
  return suscripcion !== null;
}

// pide el permiso, suscribe este celular y le pasa la suscripción al back.
// Tiene que llamarse desde un toque en un botón (el navegador no deja pedir el permiso solo)
export async function activarPush() {
  if (!soportaPush()) throw new Error("Este navegador no permite notificaciones.");

  const permiso = await Notification.requestPermission();
  if (permiso !== "granted") throw new Error("No se dio permiso para las notificaciones.");

  const registro = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  // si ya había una suscripción se reutiliza; si no, se crea con la clave pública del back
  let suscripcion = await registro.pushManager.getSubscription();
  if (!suscripcion) {
    const { publicKey } = await pushTokenService.getVapidPublicKey();
    suscripcion = await registro.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: claveABytes(publicKey),
    });
  }

  // el back guarda endpoint + claves para poder mandarle avisos a este celular
  const datos = suscripcion.toJSON();
  await pushTokenService.crearSuscripcion({
    plataforma: "web",
    endpoint: suscripcion.endpoint,
    keys: { p256dh: datos.keys?.p256dh ?? "", auth: datos.keys?.auth ?? "" },
  });
}

// da de baja la suscripción de este celular (en el navegador y en el back)
export async function desactivarPush() {
  if (!soportaPush()) return;
  const registro = await navigator.serviceWorker.getRegistration("/sw.js");
  if (!registro) return;
  const suscripcion = await registro.pushManager.getSubscription();
  if (!suscripcion) return;
  await pushTokenService.eliminarSuscripcion(suscripcion.endpoint);
  await suscripcion.unsubscribe();
}
