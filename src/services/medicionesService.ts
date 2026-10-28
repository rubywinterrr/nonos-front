import { apiFetch } from './api';

export type TipoMedicion = 'FRECUENCIA_CARDIACA' | 'SPO2' | 'SUENO' | 'HRV' | 'PASOS';

// unidades: FRECUENCIA_CARDIACA en lpm, SPO2 en %, SUENO en min, HRV en ms, PASOS en pasos
export interface Medicion {
  id: string;
  usuarioId: string;
  dispositivoId: string;
  tipo: TipoMedicion;
  valor: number;
  unidad: string;
  // en SUENO trae { etapas: [{ tipo, minutos }] }
  metadata: { etapas?: { tipo: string; minutos: number }[] } | null;
  timestamp: string;
}

// una fila por tipo, con lo de las últimas 24 hs
export interface ResumenMedicion {
  tipo: TipoMedicion;
  ultimoValor: number;
  ultimaMedicion: string;
  promedio: number;
  minimo: number;
  maximo: number;
  cantidad: number;
}

// lo "habitual" de la persona (por defecto, últimos 30 días); promedio y desviacion son null si no hay datos
export interface RutinaMedicion {
  tipo: TipoMedicion;
  promedio: number | null;
  desviacion: number | null;
  cantidadMuestras: number;
  ventana: { desde: string; hasta: string };
}

export const medicionesService = {
  // GET /mediciones?usuarioId=...&tipo=...&desde=... (de la más nueva a la más vieja)
  // desde es opcional, pero conviene pasarlo siempre: sin él trae todo el historial
  getMediciones: async (usuarioId: string, tipo: TipoMedicion, desde?: string) => {
    let url = `/mediciones?usuarioId=${encodeURIComponent(usuarioId)}&tipo=${tipo}`;
    if (desde) url += `&desde=${encodeURIComponent(desde)}`;
    return await apiFetch<Medicion[]>(url);
  },

  // GET /mediciones/resumen?usuarioId=... (último valor, promedio, mínimo y máximo de las últimas 24 hs)
  getResumen: async (usuarioId: string) => {
    return await apiFetch<ResumenMedicion[]>(`/mediciones/resumen?usuarioId=${encodeURIComponent(usuarioId)}`);
  },

  // GET /mediciones/rutina?usuarioId=...&tipo=... (lo habitual de la persona en los últimos 30 días)
  getRutina: async (usuarioId: string, tipo: TipoMedicion) => {
    return await apiFetch<RutinaMedicion>(`/mediciones/rutina?usuarioId=${encodeURIComponent(usuarioId)}&tipo=${tipo}`);
  },
};