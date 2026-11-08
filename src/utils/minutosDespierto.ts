import type { Medicion } from "../services/medicionesService";

// minutos que estuvo despierto en una medición de sueño, sumando las etapas "AWAKE" de metadata.
// Devuelve null si no hay medición o si la pulsera no mandó etapas (así no se inventa "sin interrupciones")
export default function minutosDespierto(medicion: Medicion | null) {
  if (!medicion || !medicion.metadata || !medicion.metadata.etapas) return null;
  const etapas = medicion.metadata.etapas;
  if (etapas.length === 0) return null;
  let total = 0;
  for (const etapa of etapas) {
    const tipo = etapa.tipo.toUpperCase();
    if (tipo.includes("AWAKE") || tipo.includes("WAKE")) total = total + etapa.minutos;
  }
  return total;
}
