import { apiFetch } from "./api";

export interface EventoHistorial {
  id: string;
  usuarioId: string;
  authorId: string;
  descripcion: string;
  fecha: string;
  fechaFin: string | null;
  createdAt: string;
}

export interface NuevoEventoHistorial {
  usuarioId: string;
  descripcion: string;
  fecha: string;
  fechaFin?: string;
}

export interface CambiosEventoHistorial {
  descripcion?: string;
  fecha?: string;
  fechaFin?: string | null;
}

export const eventosHistorialService = {
  // GET /eventos-historial?usuarioId=... (Historial de un adulto mayor, más reciente primero)
  getHistorial: async (usuarioId: string) => {
    return await apiFetch<EventoHistorial[]>(`/eventos-historial?usuarioId=${encodeURIComponent(usuarioId)}`);
  },

  // POST /eventos-historial (authorId lo pone el backend, no se manda)
  crearEvento: async (data: NuevoEventoHistorial) => {
    return await apiFetch<EventoHistorial>('/eventos-historial', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /eventos-historial/:id
  getEventoById: async (id: string) => {
    return await apiFetch<EventoHistorial>(`/eventos-historial/${id}`);
  },

  // PUT /eventos-historial/:id (solo el autor original puede editar)
  actualizarEvento: async (id: string, data: CambiosEventoHistorial) => {
    return await apiFetch<EventoHistorial>(`/eventos-historial/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /eventos-historial/:id (solo el autor original puede borrar)
  eliminarEvento: async (id: string) => {
    return await apiFetch<void>(`/eventos-historial/${id}`, {
      method: 'DELETE',
    });
  },
};