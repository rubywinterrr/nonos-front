import { apiFetch } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const data = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (data?.token) {
      localStorage.setItem('nonos_token', data.token);
    }
    if (data?.refreshToken) {
      localStorage.setItem('nonos_refresh_token', data.refreshToken);
    }

    return data;
  },

  loginWithGoogle: async (idToken: string, rol?: string) => {
    const data = await apiFetch<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken, rol }),
    });

    if (data?.token) {
      localStorage.setItem('nonos_token', data.token);
    }
    if (data?.refreshToken) {
      localStorage.setItem('nonos_refresh_token', data.refreshToken);
    }

    return data;
    
  },

  // Obtener perfil del usuario activo
  getProfile: async () => {
    return await apiFetch('/auth/me');
  },

  // Cerrar sesión
  logout: async () => {
    const refreshToken = localStorage.getItem('nonos_refresh_token');

    try {
      if (refreshToken) {
        await apiFetch('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }), // <- Envía el refreshToken al backend
        });
      }
    } catch {
      // Si falla la red, forzamos salida local de todos modos
    } finally {
      localStorage.removeItem('nonos_token');
      localStorage.removeItem('nonos_refresh_token'); // <- Limpia el refreshToken
      window.location.href = '/login';
    }
  },
};