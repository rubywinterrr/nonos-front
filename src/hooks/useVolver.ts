import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import rutaSegunRol from "../utils/rutaSegunRol";

export function useVolver() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  return () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(usuario ? rutaSegunRol(usuario.rol) : "/ingresar", { replace: true });
    }
  };
}
