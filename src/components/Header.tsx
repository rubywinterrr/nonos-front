import FotoCuenta from "../assets/FotoCuenta.png";
import FotoCuentaBlanca from "../assets/FotoCuenta-White.png"
import { useNavigate } from "react-router-dom";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { useState } from "react";

// Encabezado global de la aplicación.
// Muestra el menú, el nombre de la app y acceso a la cuenta en todas las pantallas principales.
export default function Header() {
  const navigate = useNavigate();
  const [fotoBlanca, setFotoBlanca] = useState(false);

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
        <img
          className="h-12 aspect-square rounded-full cursor-pointer object-cover"
          src={fotoBlanca ? FotoCuentaBlanca : FotoCuenta}
          alt="Cuenta"
          onClick={Cuenta}
          onMouseEnter={() => setFotoBlanca(true)}
          onMouseLeave={() => setFotoBlanca(false)}
        />
      </header>
    </>
  );
}
