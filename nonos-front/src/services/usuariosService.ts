import { apiFetch } from './api';

export const usuarioService = {
  // GET /usuarios/perfil (Obtener datos del usuario)
  getPerfil: async () => {
    return await apiFetch('/usuarios/perfil');
  },

  // PUT o PATCH /usuarios/perfil (Actualizar datos del perfil)
  actualizarPerfil: async (data: Record<string, unknown>) => {
    return await apiFetch('/usuarios/perfil', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};