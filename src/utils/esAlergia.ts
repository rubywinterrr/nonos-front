import type { Condicion } from "../services/condicionesService";

// es una alergia si el back la marcó así (esAlergia).
// por las moscas para los datos viejos también cuenta si el nombre dice "alergia" o "alérgico"
export default function esAlergia(condicion: Condicion) {
  if (condicion.esAlergia) return true;
  const nombre = condicion.nombre.toLowerCase();
  return nombre.includes("alergi") || nombre.includes("alérgi");
}
