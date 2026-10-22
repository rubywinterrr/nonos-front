import { apiFetch } from './api';
import type { UsuarioPublico } from './invitacionesService';

export type TipoAlerta = 'SOS_DIRECTO' | 'FC_ELEVADA' | 'FC_BAJA' | 'MEDICACION_STOCK_BAJO' | 'SP02_BAJO' | 'CAMBIO_DE_RUTINA' | 'LOGRO_POSITIVO';
export type EstadoAlerta = 'PENDIENTE' | 'CANCELADA' | 'RESUELTA';
export type CategoriaAlerta = 'CRITICO' | 'INFORMATIVO';

export interface Alerta {
    id: string;
    usuarioId: string;
    tipo: TipoAlerta;
    estado: EstadoAlerta;
    categoria: CategoriaAlerta;
    descripcion: string;
    datosContexto: Record<string, unknown> | null;
    ventanaExpiraEn: string | null;
    confirmadaEn: string | null;
    escaladaEn: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Feedback {
    id: string;
    alertaId: string;
    autorId: string;
    fueEmergenciaReal: boolean;
    comentario: string | null;
    createdAt: string;
    autor: UsuarioPublico;
}

export const alertasService = {
    // GET /alertas?usuarioId=... (Alertas de un usuario, más reciente primero)
    getAlertas: async (usuarioId: string) => {
        return await apiFetch<Alerta[]>(`/alertas?usuarioId=${encodeURIComponent(usuarioId)}`);
    },

    // GET /alertas/:id
    getAlertaById: async (id: string) => {
        return await apiFetch<Alerta>(`/alertas/${id}`);
    },

    // POST /alertas/emergencia (Botón de SOS manual; 400 si ya hay un SOS pendiente de los últimos 10 min)
    dispararEmergencia: async (usuarioId: string) => {
        return await apiFetch<Alerta>('/alertas/emergencia', {
            method: 'POST',
            body: JSON.stringify({ usuarioId }),
        });
    },

    // PUT /alertas/:id/confirmar (El adulto mayor confirma si está bien o no)
    confirmarAlerta: async (id: string, isOk: boolean) => {
        return await apiFetch<Alerta | { message: string }>(`/alertas/${id}/confirmar`, {
            method: 'PUT',
            body: JSON.stringify({ isOk }),
        });
    },

    // POST /alertas/feedback (fue emergencia real o falsa alarma?)
    crearFeedback: async (alertaId: string, comentario: string, fueEmergenciaReal: boolean) => {
        return await apiFetch<Feedback>('/alertas/feedback', {
            method: 'POST',
            body: JSON.stringify({ alertaId, comentario, fueEmergenciaReal }),
        });
    },

    // GET /alertas/feedback/:id (todos los feedback de una alerta puntual, con el autor incluido)
    getFeedback: async (alertaId: string) => {
        return await apiFetch<Feedback[]>(`/alertas/feedback/${alertaId}`);
    },
};