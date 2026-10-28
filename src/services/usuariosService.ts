import type { TipoAlerta } from './alertasService';
import { apiFetch } from './api';
import type { GrupoSanguineo, Usuario } from './authService';
import type { UsuarioPublico, TipoCuidador, TipoVinculo} from './invitacionesService';

export interface Vinculo {
  id: string;
  adultoMayorId: string;
  familiarId: string;
  tipoVinculo: TipoVinculo;
  tipoCuidador: TipoCuidador | null;
  esContactoEmergencia: boolean;
  createdAt: string;
  familiar: UsuarioPublico;
  prioridadContacto: number | null;
  tipoNotificaciones: TipoAlerta[];
}

export interface CodigoQR {
  id: string;
  codigo: string;
  isActivo: boolean;
  expiraEn: string;
  creadoEn: string;
}

export interface UsuarioById {
  id: string;
  email: string;
  nombreCompleto: string;
  rol: 'ADULTO_MAYOR' | 'FAMILIAR' | 'CUIDADOR';
  fechaNacimiento: string | null;
  telefono: string | null;
  medidasAnticipadas: string | null;
  indicacionesCuidado: string | null;
  dni: number | null;
  domicilio: string | null;
  grupoSanguineo: GrupoSanguineo | null;
  obraSocial: string | null;
  carnetObraSocial: string | null;
}

export interface AdultoMayorVinculado {
  id: string;
  email: string;
  nombreCompleto: string;
  rol: 'ADULTO_MAYOR';
  fechaNacimiento: string | null;
  telefono: string | null;
  fotoUrl: string | null;
  activo: boolean;
}

export interface CambiosVinculo {
  tipoVinculo: TipoVinculo;
  // obligatorio si tipoVinculo es CUIDADOR; si es FAMILIAR, el back lo borra
  tipoCuidador?: TipoCuidador;
}

export interface DatosContactoEmergencia {
  familiarId: string;
  esContactoEmergencia: boolean;
  // empieza en 1; si ya está ocupada, el back asigna la siguiente libre
  prioridadContacto?: number;
}

export interface CambiosPerfil {
  email?: string;
  nombreCompleto?: string;
  // formato "1950-03-10", tiene que ser en el pasado; null la borra
  fechaNacimiento?: string | null;
  // dígitos, espacios y guiones, de 6 a 20, con + opcional; null lo borra
  telefono?: string | null;
  dni?: number | null;
  domicilio?: string | null; // máx. 200 caracteres
  grupoSanguineo?: GrupoSanguineo | null;
  obraSocial?: string | null; // máx. 100 caracteres
  carnetObraSocial?: string | null; // máx. 50 caracteres
}

// interruptores de Configuración > Notificaciones (las del propio usuario sobre sí mismo)
export interface PreferenciasNotificacion {
  notifActividad: boolean;
  notifBienestar: boolean;
  // se guarda pero todavía no silencia nada (el back no manda recordatorios)
  notifRecordatorios: boolean;
}

// para editar: se mandan solo los interruptores que cambian
export interface CambiosPreferencias {
  notifActividad?: boolean;
  notifBienestar?: boolean;
  notifRecordatorios?: boolean;
}

export const usuarioService = {
  // GET /auth/me (perfil del usuario autenticado)
  getPerfil: async () => {
    return await apiFetch('/auth/me');
  },

  // PUT /usuarios/:id (requiere el id del usuario logueado)
  actualizarPerfil: async (id: string, data: CambiosPerfil) => {
    return await apiFetch<Usuario>(`/usuarios/${id}`, {
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

  // GET /usuarios/:id
  getUsuarioById: async (id: string) => {
    return await apiFetch<UsuarioById>(`/usuarios/${id}`);
  },

  // PUT /usuarios/:id/medidas-anticipadas (actualiza medidas anticipadas, solo el propio adulto)
  editarMedidasAnticipadas: async (id: string, medidasAnticipadas: string) => {
    return await apiFetch<UsuarioById>(`/usuarios/${id}/medidas-anticipadas`, {
      method: 'PUT',
      body: JSON.stringify({ medidasAnticipadas }),
    });
  },

  // GET /usuarios/:familiarId/adultos-mayores-vinculados (consigue adultos mayores vinculados a un familiar)
  getAdultosMayoresVinculados: async (familiarId: string) => {
    return await apiFetch<AdultoMayorVinculado[]>(`/usuarios/${familiarId}/adultos-mayores-vinculados`);
  },

  // GET /usuarios/:id/vinculos/:familiarId (consigue un vínculo entre un adulto mayor y un familiar)
  getVinculo: async (id: string, familiarId: string) => {
    return await apiFetch<Vinculo>(`/usuarios/${id}/vinculos/${familiarId}`);
  }, 
  
  // PUT /usuarios/:id/vinculos/:familiarId (actualiza un vínculo entre un adulto mayor y un familiar)
  actualizarVinculo: async (id: string, familiarId: string, data: CambiosVinculo) => {
    return await apiFetch<Vinculo>(`/usuarios/${id}/vinculos/${familiarId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /usuarios/:id/vinculos/:familiarId (desvincula a un familiar del adulto mayor)
  eliminarVinculo: async (id: string, familiarId: string) => {
    return await apiFetch<{ message: string }>(`/usuarios/${id}/vinculos/${familiarId}`, {
      method: 'DELETE',
    });
  },

  // PUT /usuarios/:id/contacto-emergencia (actualiza si un usuario es contacto de emergencia)
  marcarContactoEmergencia: async (id: string, data: DatosContactoEmergencia) => {
    return await apiFetch<Vinculo>(`/usuarios/${id}/contacto-emergencia`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // GET /usuarios/:id/notificaciones/:adultoMayorId (alertas que el familiar recibe de ese adulto)
  getNotificacionesRecibidas: async (id: string, adultoMayorId: string) => {
    return await apiFetch<{ tipoNotificaciones: TipoAlerta[] }>(`/usuarios/${id}/notificaciones/${adultoMayorId}`);
  },

  // PUT /usuarios/:id/notificaciones/:adultoMayorId (reemplaza la lista completa de alertas que recibe)
  editarNotificacionesRecibidas: async (id: string, adultoMayorId: string, data: { tipoNotificaciones: TipoAlerta[] }) => { 
    return await apiFetch<{ tipoNotificaciones: TipoAlerta[] }>(`/usuarios/${id}/notificaciones/${adultoMayorId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /usuarios/:id (da de baja la cuenta y cierra todas sus sesiones)
  eliminarCuenta: async (id: string) => {
    return await apiFetch<{ message: string }>(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  },

    // PUT /usuarios/:id/indicaciones-cuidado (texto libre del adulto para quien lo cuida, máx. 5000; solo el propio adulto)
  editarIndicacionesCuidado: async (id: string, indicacionesCuidado: string) => {
    return await apiFetch<UsuarioById>(`/usuarios/${id}/indicaciones-cuidado`, {
      method: 'PUT',
      body: JSON.stringify({ indicacionesCuidado }),
    });
  },

  // GET /usuarios/:id/preferencias-notificaciones (solo el propio usuario)
  getPreferenciasNotificacion: async (id: string) => {
    return await apiFetch<PreferenciasNotificacion>(`/usuarios/${id}/preferencias-notificaciones`);
  },

  // PUT /usuarios/:id/preferencias-notificaciones (manda solo los que cambian; devuelve los tres)
  editarPreferenciasNotificacion: async (id: string, data: CambiosPreferencias) => {
    return await apiFetch<PreferenciasNotificacion>(`/usuarios/${id}/preferencias-notificaciones`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
};