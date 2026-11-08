import { apiFetch } from './api';

export interface Condicion {
  id: string;
  usuarioId: string;
  nombre: string;
  descripcion: string | null;
  fechaDiagnostico: string | null;
  // "Bajo control", "En tratamiento"... (null si no se cargó)
  estado: string | null;
  esAlergia: boolean;
  activo: boolean;
  createdAt: string;
}

export const condicionesService = {
  // GET /condiciones?usuarioId=... (query obligatorio)
  getCondiciones: async (usuarioId: string) => {
    return await apiFetch<Condicion[]>(`/condiciones?usuarioId=${encodeURIComponent(usuarioId)}`);
  },

  // POST /condiciones { nombre, descripcion?, usuarioId, estado? (máx. 50), esAlergia? }
  crearCondicion: async (data: { nombre: string; descripcion?: string; usuarioId: string; estado?: string; esAlergia?: boolean }) => {
    return await apiFetch('/condiciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /condiciones/:id
  getCondicionById: async (id: string) => {
    return await apiFetch(`/condiciones/${id}`);
  },

  // PUT /condiciones/:id { nombre?, descripcion?, estado?, esAlergia? }
  actualizarCondicion: async (id: string, data: { nombre?: string; descripcion?: string; estado?: string; esAlergia?: boolean }) => {
    return await apiFetch(`/condiciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /condiciones/:id
  eliminarCondicion: async (id: string) => {
    return await apiFetch(`/condiciones/${id}`, {
      method: 'DELETE',
    });
  },
};