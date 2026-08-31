import { apiFetch } from './api';

export type TipoVinculo = 'FAMILIAR' | 'CUIDADOR' | 'MEDICO';
export type DireccionInvitacion = 'EMISOR_ES_ADULTO_MAYOR' | 'EMISOR_ES_FAMILIAR';

export const invitacionesService = {
  // POST /invitaciones { emailDestino, tipoVinculo, direccion }
  crearInvitacion: async (data: {
    emailDestino: string;
    tipoVinculo: TipoVinculo;
    direccion: DireccionInvitacion;
  }) => {
    return await apiFetch('/invitaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /invitaciones/recibidas
  getRecibidas: async () => {
    return await apiFetch('/invitaciones/recibidas');
  },

  // GET /invitaciones/enviadas
  getEnviadas: async () => {
    return await apiFetch('/invitaciones/enviadas');
  },

  // POST /invitaciones/:idInvitacion/aceptar
  aceptarInvitacion: async (idInvitacion: string) => {
    return await apiFetch(`/invitaciones/${idInvitacion}/aceptar`, {
      method: 'POST',
    });
  },

  // POST /invitaciones/:idInvitacion/rechazar
  rechazarInvitacion: async (idInvitacion: string) => {
    return await apiFetch(`/invitaciones/${idInvitacion}/rechazar`, {
      method: 'POST',
    });
  },
};