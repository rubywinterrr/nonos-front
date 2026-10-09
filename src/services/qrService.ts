import { apiFetch } from './api';
import type { CodigoQR } from './usuariosService';

export const qrService = {
  // POST /qr/create { usuarioId } (solo el dueño; 409 si ya hay uno vigente)
  crearQR: async (usuarioId: string) => {
    return await apiFetch<{ qr: CodigoQR }>('/qr/create', {
      method: 'POST',
      body: JSON.stringify({ usuarioId }),
    });
  },
};