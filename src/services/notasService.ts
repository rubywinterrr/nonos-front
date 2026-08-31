import { apiFetch } from './api';

export const notasService = {
  // GET /notas?usuarioId=... (query obligatorio)
  getNotas: async (usuarioId: string) => {
    return await apiFetch(`/notas?usuarioId=${encodeURIComponent(usuarioId)}`);
  },

  // POST /notas { titulo, contenido, usuarioId } — cuidadorId lo pone el backend
  crearNota: async (data: { titulo: string; contenido: string; usuarioId: string }) => {
    return await apiFetch('/notas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /notas/:id
  getNotaById: async (id: string) => {
    return await apiFetch(`/notas/${id}`);
  },

  // PUT /notas/:id { titulo?, contenido? }
  actualizarNota: async (id: string, data: { titulo?: string; contenido?: string }) => {
    return await apiFetch(`/notas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /notas/:id
  eliminarNota: async (id: string) => {
    return await apiFetch(`/notas/${id}`, {
      method: 'DELETE',
    });
  },
};