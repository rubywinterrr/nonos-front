import { apiFetch } from './api';

export type TipoMedicion = 'FRECUENCIA_CARDIACA' | 'SPO2' | 'SUENO' | 'HRV' | 'PASOS';

const buildQuery = (params: Record<string, string | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });
  return query.toString();
};

export const medicionesService = {
  // GET /mediciones?usuarioId=...&tipo?&desde?&hasta?
  getMediciones: async (
    usuarioId: string,
    filtros?: { tipo?: TipoMedicion; desde?: string; hasta?: string }
  ) => {
    const query = buildQuery({ usuarioId, ...filtros });
    return await apiFetch(`/mediciones?${query}`);
  },

  // GET /mediciones/resumen?usuarioId=...
  getResumen: async (usuarioId: string) => {
    return await apiFetch(`/mediciones/resumen?usuarioId=${encodeURIComponent(usuarioId)}`);
  },

  // GET /mediciones/rutina?usuarioId=...&tipo=... (tipo obligatorio)
  getRutina: async (
    usuarioId: string,
    tipo: TipoMedicion,
    filtros?: { desde?: string; hasta?: string }
  ) => {
    const query = buildQuery({ usuarioId, tipo, ...filtros });
    return await apiFetch(`/mediciones/rutina?${query}`);
  },
};