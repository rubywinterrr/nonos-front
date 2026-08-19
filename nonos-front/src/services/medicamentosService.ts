import { apiFetch } from './api';

export const medicamentosService = {
  // GET /medicamentos (Obtener lista de remedios)
  getMedicamentos: async () => {
    return await apiFetch('/medicamentos');
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