import { apiFetch } from './api';

export const tomasService = {
  // GET /tomas (Obtener el historial o tomas programadas)
  getTomas: async () => {
    return await apiFetch('/tomas');
  },

  // POST /tomas (Registrar que se tomó un remedio)
  registrarToma: async (data: Record<string, unknown>) => {
    return await apiFetch('/tomas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};