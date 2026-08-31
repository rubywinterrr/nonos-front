import { apiFetch } from './api';

export const dispositivosService = {
  // GET /dispositivos?usuarioId=...
  getDispositivos: async (usuarioId: string) => {
    return await apiFetch(`/dispositivos?usuarioId=${encodeURIComponent(usuarioId)}`);
  },

  // GET /dispositivos/oauth/google-health -> { authUrl }
  // El componente que llame esto debe hacer window.location.href = authUrl
  getGoogleHealthAuthUrl: async (usuarioId?: string) => {
    const query = usuarioId ? `?usuarioId=${encodeURIComponent(usuarioId)}` : '';
    return await apiFetch<{ authUrl: string }>(`/dispositivos/oauth/google-health${query}`);
  },

  // POST /dispositivos/:id/sync
  sincronizarDispositivo: async (id: string) => {
    return await apiFetch(`/dispositivos/${id}/sync`, {
      method: 'POST',
    });
  },

  // DELETE /dispositivos/:id
  eliminarDispositivo: async (id: string) => {
    return await apiFetch(`/dispositivos/${id}`, {
      method: 'DELETE',
    });
  },
};