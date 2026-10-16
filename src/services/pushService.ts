import { pushTokenService } from './pushTokenService';

export type EstadoPush = 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed';

const FLAG_APAGADO = 'nonos_push_apagado';

const soportado = () =>
    'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

const claveAUint8Array = (base64Url: string) => {
    const relleno = '='.repeat((4 - (base64Url.length % 4)) % 4);
    const base64 = (base64Url + relleno).replace(/-/g, '+').replace(/_/g, '/');
    const crudo = window.atob(base64);
    return Uint8Array.from(crudo, (c) => c.charCodeAt(0));
};

const obtenerRegistro = async () => {
    await navigator.serviceWorker.register('/sw.js');
    return navigator.serviceWorker.ready;
};

const suscribir = async (registro: ServiceWorkerRegistration) => {
    const existente = await registro.pushManager.getSubscription();
    if (existente) return existente;

    const { publicKey } = await pushTokenService.getVapidPublicKey();
    return registro.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: claveAUint8Array(publicKey) as BufferSource,
    });
};

const enviarAlBack = async (suscripcion: PushSubscription) => {
    const { endpoint, keys } = suscripcion.toJSON();
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
        throw new Error('Suscripción inválida');
    }
    await pushTokenService.crearSuscripcion({
        plataforma: 'web',
        endpoint,
        keys: { p256dh: keys.p256dh, auth: keys.auth },
    });
};

export const pushService = {
    getEstado: async (): Promise<EstadoPush> => {
        if (!soportado()) return 'unsupported';
        if (Notification.permission === 'denied') return 'denied';
        const registro = await navigator.serviceWorker.getRegistration();
        const suscripcion = await registro?.pushManager.getSubscription();
        return suscripcion && Notification.permission === 'granted' ? 'subscribed' : 'unsubscribed';
    },
    activar: async () => {
        if (!soportado()) throw new Error('Push no soportado');
        const permiso = await Notification.requestPermission();
        if (permiso !== 'granted') throw new Error('Permiso de notificaciones denegado');

        const registro = await obtenerRegistro();
        const suscripcion = await suscribir(registro);
        await enviarAlBack(suscripcion);
        localStorage.removeItem(FLAG_APAGADO);
    },
    desactivar: async () => {
        localStorage.setItem(FLAG_APAGADO, '1');
        await pushService.liberar();
    },
    liberar: async () => {
        if (!soportado()) return;
        const registro = await navigator.serviceWorker.getRegistration();
        const suscripcion = await registro?.pushManager.getSubscription();
        if (!suscripcion) return;
        try {
            await pushTokenService.eliminarSuscripcion(suscripcion.endpoint);
        } finally {
            await suscripcion.unsubscribe();
        }
    },
    sincronizar: async () => {
        if (!soportado() || Notification.permission !== 'granted') return;
        if (localStorage.getItem(FLAG_APAGADO)) return;
        const registro = await obtenerRegistro();
        const suscripcion = await suscribir(registro);
        await enviarAlBack(suscripcion);
    },
};