import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import rutaSegunRol from "../utils/rutaSegunRol";

interface Props {
  rol: "ADULTO_MAYOR" | "FAMILIAR" | "CUIDADOR";
}

// deja pasar a las rutas de adentro solo si el usuario tiene ese rol
// si tiene otro, lo manda a su propio inicio. va adentro de RutaProtegida, así que ya hay usuario
export default function RutaPorRol({ rol }: Props) {
  const { usuario } = useAuth();

  if (usuario && usuario.rol !== rol) {
    return <Navigate to={rutaSegunRol(usuario.rol)} replace />;
  }

  return <Outlet />;
}