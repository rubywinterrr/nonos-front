import { usuarioService, type AdultoMayorVinculado } from "../services/usuariosService";
import type { Usuario } from "../services/authService";

const CLAVE = "nonos_adulto_seleccionado";
const seleccionEnSesion = new Map<string, string>();

export function guardarAdultoSeleccionado(usuarioId: string, adultoId: string) {
  try {
    localStorage.setItem(`${CLAVE}:${usuarioId}`, adultoId);
    seleccionEnSesion.delete(usuarioId);
  } catch {
    // La selección se conserva durante la sesión aunque el navegador no permita guardarla.
    seleccionEnSesion.set(usuarioId, adultoId);
  }
}

export function leerAdultoSeleccionado(usuarioId: string | undefined) {
  if (!usuarioId) return null;
  try {
    return seleccionEnSesion.get(usuarioId) ?? localStorage.getItem(`${CLAVE}:${usuarioId}`) ?? localStorage.getItem(CLAVE);
  } catch {
    return seleccionEnSesion.get(usuarioId) ?? null;
  }
}

export function resolverAdultoVinculado(adultos: AdultoMayorVinculado[], adultoId: string | null) {
  return adultos.find((adulto) => adulto.id === adultoId) ?? adultos[0] ?? null;
}

// devuelve el adulto vinculado que el familiar/cuidador está mirando:
// el que eligió, o el primero si no eligió ninguno. null si no tiene adultos vinculados
export async function buscarAdultoSeleccionado(usuarioId: string) {
  const adultos = await usuarioService.getAdultosMayoresVinculados(usuarioId);
  return resolverAdultoVinculado(adultos, leerAdultoSeleccionado(usuarioId));
}

// id del adulto cuyos datos hay que mostrar:
// si entró el adulto, es él mismo; si entró un familiar o cuidador, el adulto que está mirando
export async function idDelAdultoQueSeMira(usuario: Usuario) {
  if (usuario.rol === "ADULTO_MAYOR") return usuario.id;
  const adulto: AdultoMayorVinculado | null = await buscarAdultoSeleccionado(usuario.id);
  if (!adulto) return null;
  return adulto.id;
}
