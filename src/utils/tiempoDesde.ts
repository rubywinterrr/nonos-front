// cuánto pasó desde una fecha del back, en texto: "hace 3 min", "hace 2 h", "hace 1 día"
export default function tiempoDesde(fecha: string) {
  const minutos = Math.floor((Date.now() - new Date(fecha).getTime()) / 60000);
  if (minutos < 1) return "recién";
  if (minutos < 60) return `hace ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;

  const dias = Math.floor(horas / 24);
  if (dias === 1) return "hace 1 día";
  return `hace ${dias} días`;
}
