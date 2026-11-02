import type { TipoCuidador, TipoVinculo } from "../services/invitacionesService";

export function etiquetaRol(rol: string | null | undefined) {
  if (rol === "ADULTO_MAYOR") return "Adulto mayor";
  if (rol === "FAMILIAR") return "Familiar";
  if (rol === "CUIDADOR") return "Cuidador";
  return "";
}

export function etiquetaRolVinculo(
  tipoVinculo: TipoVinculo,
  tipoCuidador: TipoCuidador | null,
) {
  if (tipoVinculo === "FAMILIAR") return "Familiar";
  if (tipoCuidador === "DIGITAL") return "Cuidador digital";
  return "Cuidador físico";
}
