import { apiFetch } from './api';

export const usuarioService = {
  // GET /auth/me (perfil del usuario autenticado)
  getPerfil: async () => {
    return await apiFetch('/auth/me');
  },

  // PUT /usuarios/:id (requiere el id del usuario logueado)
  actualizarPerfil: async (id: string, data: Record<string, unknown>) => {
    return await apiFetch(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};