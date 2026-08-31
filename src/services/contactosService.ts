import { apiFetch } from './api';

export const contactosService = {
  // GET /contactos?usuarioId=... (query obligatorio)
  getContactos: async (usuarioId: string) => {
    return await apiFetch(`/contactos?usuarioId=${encodeURIComponent(usuarioId)}`);
  },

  // POST /contactos { nombre, telefono, usuarioId }
  crearContacto: async (data: { nombre: string; telefono: string; usuarioId: string }) => {
    return await apiFetch('/contactos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /contactos/:id
  getContactoById: async (id: string) => {
    return await apiFetch(`/contactos/${id}`);
  },

  // PUT /contactos/:id { nombre, telefono }
  actualizarContacto: async (id: string, data: { nombre?: string; telefono?: string }) => {
    return await apiFetch(`/contactos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /contactos/:id
  eliminarContacto: async (id: string) => {
    return await apiFetch(`/contactos/${id}`, {
      method: 'DELETE',
    });
  },
};