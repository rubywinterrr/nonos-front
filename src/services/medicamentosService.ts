import { apiFetch } from './api';

export interface Medicamento {
  id: string;
  usuarioId: string;
  nombre: string;
  dosis: string;
  horariosDelDia: string[];
  diasSemana: number[];
  stockActual: number | null;
  stockMinimo: number | null;
  activo: boolean;
  createdAt: string;
  lowStock: boolean;
}

export interface NuevoMedicamento {
  nombre: string;
  dosis: string;
  horariosDelDia: string[];
  diasSemana?: number[];
  stockActual?: number;
  stockMinimo?: number;
  usuarioId: string;
}

export interface CambiosMedicamento {
  nombre?: string;
  dosis?: string;
  horariosDelDia?: string[];
  diasSemana?: number[];
  stockActual?: number;
  stockMinimo?: number;
}

export interface CambioMedicacion {
  id: string;
  medicamentoId: string;
  usuarioId: string;
  cambio: string;
  fechaCambio: string;
}

export interface RespuestaActualizacion {
  medicamentoActualizado: Medicamento;
  cambio: CambioMedicacion;
}

export const medicamentosService = {
  // GET /medicamentos (Obtener lista de remedios)
  getMedicamentos: async (usuarioId: string) => {
    return await apiFetch<Medicamento[]>(`/medicamentos?usuarioId=${encodeURIComponent(usuarioId)}`);
  },

  // POST /medicamentos (Agregar un nuevo remedio)
  crearMedicamento: async (data: NuevoMedicamento) => {
    return await apiFetch<Medicamento>('/medicamentos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
},

// GET /medicamentos/:id (conseguir un remedio especifico)
getMedicamentoById: async (id: string) => {
  return await apiFetch<Medicamento>(`/medicamentos/${id}`);
},

// POST /medicamentos/update/:id (actualizar un remedio y registrar quién lo cambió y cuándo)
actualizarMedicamentoConHistorial: async (id: string, usuarioId: string, data: CambiosMedicamento) => {
  return await apiFetch<RespuestaActualizacion>(`/medicamentos/update/${id}`, {
    method: 'POST',
    body: JSON.stringify({ usuarioId, ...data }),
  });
},

// GET /medicamentos/cambios/:id (historial de cambios de un remedio, del más nuevo al más viejo)
getCambiosMedicamento: async (id: string) => {
  return await apiFetch<CambioMedicacion[]>(`/medicamentos/cambios/${id}`);
},

  // DELETE /medicamentos/:id (da de baja un medicamento, activo:false)
  eliminarMedicamento: async (id: string) => {
    return await apiFetch<void>(`/medicamentos/${id}`, {
      method: 'DELETE',
    });
  },
};