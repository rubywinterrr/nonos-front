import { apiFetch } from './api';

export type TipoVinculo = 'FAMILIAR' | 'CUIDADOR'
export type TipoCuidador = 'FISICO' | 'DIGITAL'
export type DireccionInvitacion = 'EMISOR_ES_ADULTO_MAYOR' | 'EMISOR_ES_FAMILIAR';
export type EstadoInvitacion = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'EXPIRADA';

export interface UsuarioPublico {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string | null;
}

export interface Invitacion {
  id: string;
  emisorId: string;
  emailDestino: string;
  tipoVinculo: TipoVinculo;
  tipoCuidador: TipoCuidador | null;
  direccion: DireccionInvitacion;
  estado: EstadoInvitacion;
  expiraEn: string;
  createdAt: string;
  emisor?: UsuarioPublico;
}

export interface NuevaInvitacion {
  emailDestino: string;
  tipoVinculo: TipoVinculo;
  direccion: DireccionInvitacion;
  // es obligatorio si tipoVinculo es CUIDADOR, prohibido si es FAMILIAR
  tipoCuidador?: TipoCuidador;
}

export const invitacionesService = {
  // POST /invitaciones (invita a alguien a vincularse, vence a los 7 días)
  crearInvitacion: async (data: NuevaInvitacion) => {
    return await apiFetch<Invitacion>('/invitaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /invitaciones/recibidas (invitaciones pendientes dirigidas a mi mail)
  getRecibidas: async () => {
    return await apiFetch<Invitacion[]>('/invitaciones/recibidas');
  },

  // GET /invitaciones/enviadas (todas las que envié, en cualquier estado)
  getEnviadas: async () => {
    return await apiFetch<Invitacion[]>('/invitaciones/enviadas');
  },

  // POST /invitaciones/:idInvitacion/aceptar (crea el vínculo y devuelve la invitación aceptada)
  aceptarInvitacion: async (idInvitacion: string) => {
    return await apiFetch<Invitacion>(`/invitaciones/${idInvitacion}/aceptar`, {
      method: 'POST',
    });
  },

  // POST /invitaciones/:id/rechazar
  rechazarInvitacion: async (idInvitacion: string) => {
    return await apiFetch<Invitacion>(`/invitaciones/${idInvitacion}/rechazar`, {
      method: 'POST',
    });
  },
};