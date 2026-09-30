import { apiFetch } from "./api";

export type TipoNotificacion = 'PUSH' | 'EMAIL' | 'SMS';

export interface Notificacion {
  id: string;
  usuarioId: string;
  alertaId: string | null;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  leida: boolean;
  enviadaEn: string;
}

export const notificacionesService = {
  // GET /notificaciones (Mis notificaciones, más reciente primero)
  getNotificaciones: async () => {
    return await apiFetch<Notificacion[]>('/notificaciones');
  },

  // PUT /notificaciones/:id/leida (Marcar una notificación como leída)
  marcarComoLeida: async (id: string) => {
    return await apiFetch<Notificacion>(`/notificaciones/${id}/leida`, {
      method: 'PUT',
    });
  },
};
