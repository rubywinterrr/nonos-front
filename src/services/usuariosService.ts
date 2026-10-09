import { apiFetch } from './api';
import type { UsuarioPublico } from './invitacionesService';

export interface Vinculo {
  id: string;
  adultoMayorId: string;
  familiarId: string;
  tipoVinculo: string;
  esContactoEmergencia: boolean;
  createdAt: string;
  familiar: UsuarioPublico;
}

export interface CodigoQR {
  id: string;
  codigo: string;
  isActivo: boolean;
  expiraEn: string;
  creadoEn: string;
}

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

  // GET /usuarios/:id/vinculos (familiares vinculados al adulto mayor)
  getVinculos: async (id: string) => {
    return await apiFetch<Vinculo[]>(`/usuarios/${id}/vinculos`);
  },

  // GET /usuarios/:id/qr (código QR activo del usuario mismo, 404 si nunca generó uno)
  getQR: async (id: string) => {
    return await apiFetch<CodigoQR>(`/usuarios/${id}/qr`);
  },

  // POST /usuarios/:id/qr/regenerar (nuevo código, 30 min más; 404 si no tiene QR)
  regenerarQR: async (id: string) => {  
    return await apiFetch<CodigoQR>(`/usuarios/${id}/qr/regenerar`, {
      method: 'POST'
    });
  },

  // DELETE /usuarios/:id/qr (desactiva el QR)
  revocarQR: async (id: string) => {
    return await apiFetch<CodigoQR>(`/usuarios/${id}/qr`, {
      method: 'DELETE' 
      });
  },
};