import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdOutlineHealthAndSafety } from "react-icons/md";

// Encabezado global de la aplicación.
// Muestra el menú, el nombre de la app y acceso a la cuenta en todas las pantallas principales.
export default function Header() {
  const navigate = useNavigate();
  function Cuenta() {
    navigate("/Cuenta");
    console.log("Cuenta");
  }

  function NomPag() {
    const rutaActual = window.location.pathname;
    switch (rutaActual) {
      case "/Home":
        return "Inicio";
      default:
        return "NONOS";
    }
  }

  return (
    <>
      <header className="flex justify-between items-center w-full">
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <MdOutlineHealthAndSafety className="text-4xl lg:text-5xl" />
          {NomPag()}
        </h1>
        <FaRegUserCircle onClick={Cuenta} className="text-4xl hover:text-white cursor-pointer" />
      </header>
    </>
  );
}
