// calcula la edad en años a partir de la fecha de nacimiento que manda el back
export default function calcularEdad(fechaNacimiento: string) {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();

  // el back guarda la fecha a las 00:00 UTC; con getUTC... no se corre al día anterior en Argentina
  let edad = hoy.getFullYear() - nacimiento.getUTCFullYear();

  const mesHoy = hoy.getMonth();
  const mesNacimiento = nacimiento.getUTCMonth();
  if (mesHoy < mesNacimiento) {
    edad = edad - 1; // todavía no llegó el mes del cumpleaños
  } else if (mesHoy === mesNacimiento && hoy.getDate() < nacimiento.getUTCDate()) {
    edad = edad - 1; // es el mes, pero todavía no llegó el día
  }

  return edad;
}