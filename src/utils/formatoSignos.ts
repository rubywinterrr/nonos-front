// funciones chicas que usan las pantallas de signos vitales

export const HORA_MS = 60 * 60 * 1000;
export const DIA_MS = 24 * HORA_MS;

// las 3 pestañas de período y cuántos días abarca cada una
export const periodos = [
  { valor: "hoy", texto: "Hoy", dias: 1 },
  { valor: "semana", texto: "Semana", dias: 7 },
  { valor: "mes", texto: "Mes", dias: 30 },
];

// cuántos días abarca un período ("hoy" → 1)
export function diasDelPeriodo(periodo: string) {
  const encontrado = periodos.find((p) => p.valor === periodo);
  if (encontrado) return encontrado.dias;
  return 1;
}

// pasa minutos a "7h 45m"
export function horasYMinutos(minutos: number) {
  return `${Math.floor(minutos / 60)}h ${Math.round(minutos % 60)}m`;
}

// hora de una fecha: "14:09"
export function hora(fecha: string | number) {
  return new Date(fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

// día corto: "jue 29 oct"
export function diaCorto(fecha: string | number) {
  return new Date(fecha).toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
}

// día y hora: "jue 29 oct · 19:30 hs"
export function diaYHora(fecha: string | number) {
  return `${diaCorto(fecha)} · ${hora(fecha)} hs`;
}

// clave de un día ("2026-10-30") en hora local, para agrupar mediciones por día
export function claveDelDia(fecha: string | number) {
  const d = new Date(fecha);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// lista de los últimos N días (del más viejo a hoy), con su clave y una etiqueta corta ("Jue", "Hoy")
export function ultimosDias(cantidad: number, ahora: number) {
  const dias = [];
  for (let i = cantidad - 1; i >= 0; i--) {
    const fecha = ahora - i * DIA_MS;
    let etiqueta = new Date(fecha).toLocaleDateString("es-AR", { weekday: "short" });
    if (cantidad > 7) etiqueta = String(new Date(fecha).getDate());
    if (i === 0) etiqueta = "Hoy";
    dias.push({ clave: claveDelDia(fecha), etiqueta, fecha });
  }
  return dias;
}
