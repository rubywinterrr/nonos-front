import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

// Diccionario de rutas exactas
const TITULOS_RUTAS: Record<string, string> = {
  "/contactos": "Contactos",
  "/sos": "Mi información médica",
  "/codigo": "Código de emergencia",
};

export default function VueltaAtras() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const obtenerTitulo = () => {
    const ruta = pathname.toLowerCase();

    // 1. Manejo de rutas que empiezan con prefijos (como /ayuda/...)
    if (ruta.startsWith("/ayuda")) {
      return "Ayuda y soporte";
    }

    // 2. Coincidencia exacta usando el diccionario
    return TITULOS_RUTAS[ruta] || "Título por defecto";
  };

  return (
    <div className="flex items-center gap-3 pb-4">
      <FaArrowLeft
        className="rounded-xl bg-gray-100 w-15 h-15 lg:w-18 lg:h-18 p-4 cursor-pointer hover:bg-gray-300"
        onClick={() => navigate(-1)} // En React Router se recomienda navigate(-1)
      />
      <div>
        <h2 className="text-lg lg:text-xl font-semibold text-gray-500">
          FICHA DE CONSULTA
        </h2>
        <h1 className="font-semibold text-2xl lg:text-3xl">
          {obtenerTitulo()}
        </h1>
      </div>
    </div>
  );
}
