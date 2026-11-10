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
function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replaceAll("-", "+").replaceAll("_", "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
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
  if (!("Notification" in window)) throw new Error("Este navegador no permite notificaciones.");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("No se dio permiso para las notificaciones.");

  await subscribeUser();
}

// usa el service worker si ya estaba registrado; si no, lo registra
async function subscribeUser() {
  if (!("serviceWorker" in navigator)) throw new Error("Este navegador no permite notificaciones.");

  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  if (registration) {
    await generateSubscribeEndPoint(registration);
  } else {
    const newRegistration = await navigator.serviceWorker.register("/sw.js");
    // espera a que el service worker quede activo, si no subscribe falla la primera vez
    await navigator.serviceWorker.ready;
    await generateSubscribeEndPoint(newRegistration);
  }
}

// suscribe este celular con la clave pública del back y le pasa la suscripción al back
async function generateSubscribeEndPoint(newRegistration: ServiceWorkerRegistration) {
  const { publicKey } = await pushTokenService.getVapidPublicKey();
  const applicationServerKey = urlB64ToUint8Array(publicKey);
  const options = {
    applicationServerKey,
    userVisibleOnly: true, // solo avisos visibles (Chrome no permite avisos silenciosos)
  };
  const subscription = await newRegistration.pushManager.subscribe(options);

  // el back guarda endpoint + claves para poder mandarle avisos a este celular
  const datos = subscription.toJSON();
  await pushTokenService.crearSuscripcion({
    plataforma: "web",
    endpoint: subscription.endpoint,
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