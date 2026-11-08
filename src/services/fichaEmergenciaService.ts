import { BASE_URL } from './api';
import type { GrupoSanguineo } from './authService';
import type { Condicion } from './condicionesService';
import type { Medicamento } from './medicamentosService';

// lo que devuelve el back cuando el código de la pulsera es correcto.
// condiciones y medicacionActual vienen solo las activas
export interface FichaEmergencia {
  nombreCompleto: string;
  edad: number | null;
  dni: number | null;
  fechaNacimiento: string | null;
  grupoSanguineo: GrupoSanguineo | null;
  obraSocial: string | null;
  carnetObraSocial: string | null;
  domicilio: string | null;
  fotoUrl: string | null;
  // id de la pulsera desde la que se escaneó
  idDispositivo: string | null;
  // PENDIENTE BACK: /qr/:id/acceder todavía no manda estos tres; la ficha los muestra solo si vienen
  sanatorioHabitual?: string | null;
  nombreMedicoCabecera?: string | null;
  telefonoMedicoCabecera?: string | null;
  condiciones: Condicion[];
  medicacionActual: Medicamento[];
  // la red marcada como emergencia y también los contactos agendados marcados como emergencia
  contactosDeEmergencia: { nombreCompleto: string | null; telefono: string | null }[];
  medidasAnticipadas: string | null;
  fechaUltimaActualizacion: string;
}

// resultado de intentar entrar: el código de estado del back y, si salió bien, la ficha
export interface RespuestaFicha {
  estado: number;
  ficha: FichaEmergencia | null;
  mensaje: string;
}

export const fichaEmergenciaService = {
  // POST /qr/:id/acceder { codigo } (público, sin login).
  // No usa apiFetch porque apiFetch toma el 401 como "sesión vencida" y manda al login;
  // acá un 401 solo quiere decir que el código es incorrecto.
  // Estados: 200 ok, 401 código incorrecto, 404 QR inexistente o apagado, 409 código ya utilizado
  // (dentro de los 5 minutos de un acceso), 410 vencido, 429 demasiados intentos
  accederFicha: async (qrId: string, codigo: string): Promise<RespuestaFicha> => {
    const response = await fetch(`${BASE_URL}/qr/${qrId}/acceder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo }),
      cache: 'no-store',
    });

    if (response.ok) {
      const ficha = await response.json();
      return { estado: response.status, ficha: ficha, mensaje: '' };
    }

    const error = await response.json().catch(() => ({}));
    return { estado: response.status, ficha: null, mensaje: error.message || '' };
  },
};
