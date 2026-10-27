export function obtenerDiaActual(fecha = new Date()) {
  const dia = fecha.toLocaleDateString("es-ES", { weekday: "long" });
  return dia.charAt(0).toUpperCase() + dia.slice(1);
}

export default function obtenerFechaActual(fecha = new Date()) {
  const fechaFormateada = fecha.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const hora = fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${fechaFormateada.charAt(0).toUpperCase()}${fechaFormateada.slice(1)} · ${hora} hs`;
}
