import { apiFetch } from './api';
 
export type TipoDispositivo = 'FITBIT_AIR' | 'BOTON_FISICO';
 
// el back nunca manda los tokens de Google
export interface Dispositivo {
  id: string;
  usuarioId: string;
  tipo: TipoDispositivo;
  identificadorExterno: string;
  activo: boolean;
  fechaVinculacion: string;
  ultimaSincronizacion: string | null;
  // true si hay que volver a conectar la pulsera con Google (el permiso venció)
  requiereReautenticacion: boolean;
}
 
export interface ResultadoSincronizacion {
  insertadas: number;
  tiposConError: string[];
}
 
// estado de la carga del historial completo (vive en memoria del back: se pierde si se reinicia)
export interface EstadoSyncHistorico {
  estado: 'EN_CURSO' | 'TERMINADO' | 'ERROR';
  desde: string;
  hasta: string;
  progresoHasta: string;
  insertadas: number;
  tiposConError: string[];
  iniciadoEn: string;
  terminadoEn: string | null;
  error?: string;
}
 
export interface NuevoBotonFisico {
  usuarioId: string;
  identificadorExterno: string;
}
 
export const dispositivosService = {
  // GET /dispositivos?usuarioId=... (solo los activos)
  getDispositivos: async (usuarioId: string) => {
    return await apiFetch<Dispositivo[]>(`/dispositivos?usuarioId=${encodeURIComponent(usuarioId)}`);
  },
 
  // GET /dispositivos/oauth/google-health -> { authUrl }
  // El componente que llame esto debe hacer window.location.href = authUrl
  // Al terminar, el back vuelve a /cuenta?conectado=1 (o ?conectado=0 si se canceló o falló)
  getGoogleHealthAuthUrl: async (usuarioId?: string) => {
    const query = usuarioId ? `?usuarioId=${encodeURIComponent(usuarioId)}` : '';
    return await apiFetch<{ authUrl: string }>(`/dispositivos/oauth/google-health${query}`);
  },
 
  // POST /dispositivos/:id/sync (trae mediciones nuevas; 409 si hay que re-vincular con Google)
  sincronizarDispositivo: async (id: string) => {
    return await apiFetch<ResultadoSincronizacion>(`/dispositivos/${id}/sync`, {
      method: 'POST',
    });
  },
 
  // DELETE /dispositivos/:id (lo desvincula: activo pasa a false)
  eliminarDispositivo: async (id: string) => {
    return await apiFetch<Dispositivo>(`/dispositivos/${id}`, {
      method: 'DELETE',
    });
  },
 
  // POST /dispositivos/boton-fisico -> { id, secreto }
  // El secreto se muestra UNA sola vez: la pantalla tiene que mostrarlo en ese momento
  // 409 si ese botón ya está registrado
  registrarBotonFisico: async (data: NuevoBotonFisico) => {
    return await apiFetch<{ id: string; secreto: string }>('/dispositivos/boton-fisico', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
 
  // POST /dispositivos/:id/sync/historico (carga todo el historial del Fitbit en segundo plano)
  // desde es opcional (fecha ISO); sin él trae desde 2015. 409 si ya hay una carga en curso
  iniciarSyncHistorico: async (id: string, desde?: string) => {
    return await apiFetch<EstadoSyncHistorico>(`/dispositivos/${id}/sync/historico`, {
      method: 'POST',
      body: JSON.stringify(desde ? { desde } : {}),
    });
  },
 
  // GET /dispositivos/:id/sync/historico (estado de la última carga; 404 si nunca se hizo)
  getSyncHistorico: async (id: string) => {
    return await apiFetch<EstadoSyncHistorico>(`/dispositivos/${id}/sync/historico`);
  },
};
 