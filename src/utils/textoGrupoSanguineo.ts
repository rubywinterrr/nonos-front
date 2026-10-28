import type { GrupoSanguineo } from "../services/authService";

// pasa el grupo sanguíneo del back ("A_POSITIVO") a cómo se lee ("A+"); null -> "Sin dato"
export default function textoGrupoSanguineo(grupo: GrupoSanguineo | null) {
  if (!grupo) return "Sin dato";

  const [letra, factor] = grupo.split("_");
  if (factor === "POSITIVO") return `${letra}+`;
  return `${letra}−`;
}