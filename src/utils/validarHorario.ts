// revisa que un horario tenga el formato que exige el back: "HH:MM" (ej. "08:00", no "8:00")
export default function validarHorario(horario: string) {
  // "08:00" tiene exactamente 5 caracteres, con los dos puntos en el medio
  if (horario.length !== 5) return false;
  if (horario[2] !== ":") return false;

  // los otros 4 caracteres tienen que ser números
  const numeros = "0123456789";
  if (!numeros.includes(horario[0]) || !numeros.includes(horario[1])) return false;
  if (!numeros.includes(horario[3]) || !numeros.includes(horario[4])) return false;

  const horas = Number(horario.slice(0, 2));
  const minutos = Number(horario.slice(3, 5));
  return horas <= 23 && minutos <= 59;
}