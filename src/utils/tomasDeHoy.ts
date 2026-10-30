import type { Medicamento } from "../services/medicamentosService";

// una toma = un medicamento en uno de sus horarios
export interface TomaDelDia {
  medicamento: Medicamento;
  horario: string; // "HH:MM"
}

// pasa "21:30" a minutos desde las 00:00 (1290), para poder comparar horarios
export function minutosDelDia(horario: string) {
  const horas = Number(horario.slice(0, 2));
  const minutos = Number(horario.slice(3, 5));
  return horas * 60 + minutos;
}

// minutos desde las 00:00 de ahora mismo
function minutosDeAhora() {
  const ahora = new Date();
  return ahora.getHours() * 60 + ahora.getMinutes();
}

// arma la lista de tomas de hoy, ordenada por horario
// diasSemana va de 0 (domingo) a 6 (sábado); si está vacío, el remedio va todos los días
export function tomasDeHoy(medicamentos: Medicamento[]) {
  const hoy = new Date().getDay();
  const tomas: TomaDelDia[] = [];

  for (const medicamento of medicamentos) {
    const vaHoy = medicamento.diasSemana.length === 0 || medicamento.diasSemana.includes(hoy);
    if (!vaHoy) continue;

    for (const horario of medicamento.horariosDelDia) {
      tomas.push({ medicamento, horario });
    }
  }

  // de la más temprana a la más tarde
  tomas.sort((a, b) => minutosDelDia(a.horario) - minutosDelDia(b.horario));
  return tomas;
}

// la primera toma que todavía no llegó; null si ya pasaron todas las de hoy
export function proximaToma(tomas: TomaDelDia[]) {
  const ahora = minutosDeAhora();
  for (const toma of tomas) {
    if (minutosDelDia(toma.horario) >= ahora) return toma;
  }
  return null;
}

// true si el horario de hoy ya pasó
export function yaPaso(horario: string) {
  return minutosDelDia(horario) < minutosDeAhora();
}

// momento del día para mostrar: antes de las 12 mañana, antes de las 19 tarde, si no noche
export function momentoDelDia(horario: string) {
  const horas = Number(horario.slice(0, 2));
  if (horas < 12) return "Mañana";
  if (horas < 19) return "Tarde";
  return "Noche";
}
