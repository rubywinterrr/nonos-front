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

export const medicamentosService = {
  // GET /medicamentos (Obtener lista de remedios)
  getMedicamentos: async (usuarioId: string) => {
    return await apiFetch<Medicamento[]>(`/medicamentos?usuarioId=${encodeURIComponent(usuarioId)}`);
  },

  // POST /medicamentos (Agregar un nuevo remedio)
  crearMedicamento: async (data: Record<string, unknown>) => {
    return await apiFetch('/medicamentos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // DELETE /medicamentos/:id (Eliminar un remedio)
  eliminarMedicamento: async (id: string | number) => {
    return await apiFetch(`/medicamentos/${id}`, {
      method: 'DELETE',
    });
  },
};