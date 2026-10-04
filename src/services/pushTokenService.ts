import { apiFetch } from './api';

export interface PushToken {
    id: string;
    usuarioId: string;
    plataforma: string;
    endpoint: string;
    p256dh: string;
    auth: string;
    createdAt: string;
}

export interface SuscripcionPush {
    plataforma: string;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export const pushTokenService = {
    // POST /push-tokens (Crea o actualiza una suscripción, según el endpoint)
    crearSuscripcion: async (data: SuscripcionPush) => {
        return await apiFetch<PushToken>('/push-tokens', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // DELETE /push-tokens/:endpoint (el endpoint va URL-encodeado en la ruta)
    eliminarSuscripcion: async (endpoint: string) => {
        return await apiFetch<{ endpoint: string }>(`/push-tokens/${encodeURIComponent(endpoint)}`, {
            method: 'DELETE',
        });
    },

    // GET /push-tokens/vapid/public-key (público, sin login)
    getVapidPublicKey: async () => {
        return await apiFetch<{ publicKey: string }>('/push-tokens/vapid/public-key');
    },
};