import { apiFetch } from './api';

// nota compartida sobre un adulto mayor; cuidadorId es quien la escribió (lo pone el back)
export interface Nota {
  id: string;
  usuarioId: string;
  cuidadorId: string;
  titulo: string;
  contenido: string;
  createdAt: string;
}

export const notasService = {
  // GET /notas?usuarioId=... (query obligatorio)
  getNotas: async (usuarioId: string) => {
    return await apiFetch<Nota[]>(`/notas?usuarioId=${encodeURIComponent(usuarioId)}`);
  },

  // POST /notas { titulo, contenido, usuarioId } — cuidadorId lo pone el backend
  crearNota: async (data: { titulo: string; contenido: string; usuarioId: string }) => {
    return await apiFetch<Nota>('/notas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /notas/:id
  getNotaById: async (id: string) => {
    return await apiFetch<Nota>(`/notas/${id}`);
  },

  // PUT /notas/:id { titulo?, contenido? } (solo quien la escribió)
  actualizarNota: async (id: string, data: { titulo?: string; contenido?: string }) => {
    return await apiFetch<Nota>(`/notas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /notas/:id (solo quien la escribió)
  eliminarNota: async (id: string) => {
    return await apiFetch<void>(`/notas/${id}`, {
      method: 'DELETE',
    });
  },
};