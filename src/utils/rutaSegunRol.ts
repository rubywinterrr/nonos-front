// devuelve la ruta del panel que le corresponde a cada rol
// si el rol no es ninguno de los conocidos, manda al login
export default function rutaSegunRol(rol: string) {
  if (rol === "ADULTO_MAYOR") {
    return "/adulto/home";
  }
  if (rol === "FAMILIAR") {
    return "/familia/home";
  }
  if (rol === "CUIDADOR") {
    return "/cuidador";
  }
  return "/ingresar";
}
