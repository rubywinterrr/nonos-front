import { apiFetch } from './api';
import { desactivarPush } from '../utils/notificacionesPush';

// así guarda el back el grupo sanguíneo; para mostrarlo usar textoGrupoSanguineo (utils)
export type GrupoSanguineo =
  | 'A_POSITIVO' | 'A_NEGATIVO'
  | 'B_POSITIVO' | 'B_NEGATIVO'
  | 'AB_POSITIVO' | 'AB_NEGATIVO'
  | 'O_POSITIVO' | 'O_NEGATIVO';

export interface Usuario {
  id: string;
  email: string;
  nombreCompleto: string;
  rol: 'ADULTO_MAYOR' | 'FAMILIAR' | 'CUIDADOR'
  fechaNacimiento: string | null;
  telefono: string | null;
  fotoUrl: string | null;
  dni: number | null;
  domicilio: string | null;
  grupoSanguineo: GrupoSanguineo | null;
  obraSocial: string | null;
  carnetObraSocial: string | null;
  planObraSocial: string | null;
  sanatorioHabitual: string | null;
  nombreMedicoCabecera: string | null;
  telefonoMedicoCabecera: string | null;
  // solo lectura: la cambia el back cuando se cambia la contraseña
  fechaUltimoCambioPassword: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombreCompleto: string;
  rol: 'ADULTO_MAYOR' | 'FAMILIAR' | 'CUIDADOR'
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
    return await apiFetch<{ user: Usuario }>('/auth/me');
  },

  register: async (data: RegisterData) => {
    return await apiFetch<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Cerrar sesión
  logout: async () => {
    const refreshToken = localStorage.getItem('nonos_refresh_token');

    // da de baja los avisos push de este celular, así no le llegan a la próxima persona que entre
    try {
      await desactivarPush();
    } catch {
      // si falla, igual se cierra la sesión
    }

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
      window.location.href = '/ingresar';
    }
  },

  // PUT /auth/password (204 si salió bien, 401 si la actual es incorrecta; el back cierra todas las sesiones)
  cambiarPassword: async (passwordActual: string, passwordNueva: string) => {
    // este pedido renueva el token si venció: así un 401 de abajo solo puede ser la contraseña actual
    await apiFetch('/auth/me');
    await apiFetch<void>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ passwordActual, passwordNueva }),
    }, 'La contraseña actual no es correcta');

    localStorage.removeItem('nonos_token');
    localStorage.removeItem('nonos_refresh_token');
    window.location.href = '/ingresar?password=cambiada';
  },

  // POST /auth/logout-all (cierra la sesión en TODOS los dispositivos; responde 204 sin contenido)
  logoutAll: async () => {
    try {
      await desactivarPush();
    } catch {
      // si falla, igual se cierran las sesiones
    }
    try {
      await apiFetch<void>('/auth/logout-all', {
        method: 'POST',
      });
    } catch {
      // Si falla la red, forzamos salida local de todos modos
    } finally {
      localStorage.removeItem('nonos_token');
      localStorage.removeItem('nonos_refresh_token');
      window.location.href = '/ingresar';
    }
  },

};