import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Deja pasar a las rutas de adentro solo si hay sesión.
// Mientras se restaura la sesión muestra "Cargando…"; si no hay usuario manda al login.
export default function RutaProtegida() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return <p className="p-5 text-lg">Cargando…</p>;
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/ingresar" replace />;
}
