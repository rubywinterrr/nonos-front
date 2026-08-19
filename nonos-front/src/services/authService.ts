import { apiFetch } from './api';

export const authService = {
  // Login con Google
  loginWithGoogle: async (googleToken: string) => {
    return await apiFetch('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token: googleToken }),
    });
  },

  // Obtener perfil del usuario activo
  getProfile: async () => {
    return await apiFetch('/auth/me');
  },

  // Cerrar sesión
  logout: async () => {
    return await apiFetch('/auth/logout', {
      method: 'POST',
    });
  },
};