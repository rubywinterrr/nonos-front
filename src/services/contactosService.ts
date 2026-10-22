import { apiFetch } from './api';

export interface Contacto {
  id: string;
  usuarioId: string;
  nombre: string;
  telefono: string;
  esEmergencia: boolean;
  createdAt: string;
}

export interface NuevoContacto {
  nombre: string;
  telefono: string;
  usuarioId: string;
}

export const contactosService = {
  // GET /contactos?usuarioId=... (query obligatorio)
  getContactos: async (usuarioId: string) => {
    return await apiFetch<Contacto[]>(`/contactos?usuarioId=${encodeURIComponent(usuarioId)}`);
  },

  // POST /contactos { nombre, telefono, usuarioId }
  crearContacto: async (data: { nombre: string; telefono: string; usuarioId: string }) => {
    return await apiFetch<Contacto>('/contactos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /contactos/:id
  getContactoById: async (id: string) => {
    return await apiFetch<Contacto>(`/contactos/${id}`);
  },

  // PUT /contactos/:id { nombre, telefono }
  actualizarContacto: async (id: string, data: { nombre?: string; telefono?: string }) => {
    return await apiFetch<Contacto>(`/contactos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /contactos/:id
  eliminarContacto: async (id: string) => {
    return await apiFetch<void>(`/contactos/${id}`, {
      method: 'DELETE',
    });
  },
};