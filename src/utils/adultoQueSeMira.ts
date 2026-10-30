import { usuarioService, type AdultoMayorVinculado } from "../services/usuariosService";
import type { Usuario } from "../services/authService";

// el familiar o cuidador elige en "Adultos a cargo" a qué adulto mira; se guarda en el navegador
const CLAVE = "nonos_adulto_seleccionado";

// guarda el id del adulto elegido
export function guardarAdultoSeleccionado(id: string) {
  try {
    localStorage.setItem(CLAVE, id);
  } catch {
    // si el navegador no deja guardar, se sigue mostrando el primero
  }
}

// lee el id del adulto elegido (null si nunca eligió)
export function leerAdultoSeleccionado() {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

// devuelve el adulto vinculado que el familiar/cuidador está mirando:
// el que eligió, o el primero si no eligió ninguno. null si no tiene adultos vinculados
export async function buscarAdultoSeleccionado(usuarioId: string) {
  const adultos = await usuarioService.getAdultosMayoresVinculados(usuarioId);
  if (adultos.length === 0) return null;

  const elegido = leerAdultoSeleccionado();
  const encontrado = adultos.find((adulto) => adulto.id === elegido);
  if (encontrado) return encontrado;
  return adultos[0];
}

// id del adulto cuyos datos hay que mostrar:
// si entró el adulto, es él mismo; si entró un familiar o cuidador, el adulto que está mirando
export async function idDelAdultoQueSeMira(usuario: Usuario) {
  if (usuario.rol === "ADULTO_MAYOR") return usuario.id;
  const adulto: AdultoMayorVinculado | null = await buscarAdultoSeleccionado(usuario.id);
  if (!adulto) return null;
  return adulto.id;
}
