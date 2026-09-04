import FotoCuenta from "../assets/FotoCuenta.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Encabezado global de la aplicación.
// Muestra el menú, el nombre de la app y acceso a la cuenta en todas las pantallas principales.
export default function Header() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Bloquea el scroll del body cuando el menú está abierto y lo restaura al cerrarse
  useEffect(() => {
    if (menuAbierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Limpieza si el componente se desmonta mientras el menú está abierto
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuAbierto]);

  function Cuenta() {
    navigate("/Cuenta");
    console.log("Cuenta");
  }

  function MenuDesplegable() {
    setMenuAbierto(!menuAbierto);
    console.log("menu");
  }

  function IrConfig(){
    navigate("/Configuracion");
    console.log("Configuracion");
  }

  return (
    <>
      <header className="border-b-2 h-[10vh] md:h-[12vh] w-screen flex items-center justify-between">
        <div
          id="izq"
          className="h-90/100  w-20/100 flex items-center justify-center"
        >
          <div
            className="aspect-square h-40/100 md:h-45/100 cursor-pointer scale-110 flex flex-col justify-between"
            onClick={MenuDesplegable}
          >
            <div className="w-full h-1/5 bg-black"></div>
            <div className="w-full h-1/5 bg-black"></div>
            <div className="w-full h-1/5 bg-black"></div>
          </div>
        </div>
        <div className="h-90/100  w-60/100 flex items-center justify-center">
          <h1 className="font-bold text-5xl md:text-7xl md:font-extrabold">
            NONOS
          </h1>
        </div>
        <div
          id="der"
          className="h-90/100  w-20/100 flex items-center justify-center"
        >
          <img
            className="aspect-square h-18 scale-110 cursor-pointer text-sm p-5"
            src={FotoCuenta}
            alt="Foto de perfil"
            onClick={Cuenta}
          ></img>
        </div>

        {/* Menú desplegable y fondo bloqueante (Backdrop) */}
        {menuAbierto && (
          <>
            {/* Fondo oscuro/bloqueante que cubre toda la pantalla */}
            <div
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[1px]"
              onClick={MenuDesplegable}
              aria-hidden="true"
            />

            {/* Menú lateral */}
            <nav className="fixed top-0 left-0 w-full lg:w-[40vw] h-screen bg-white shadow-xl flex flex-row items-baseline justify-center border-t-2 border-gray-200 z-50 lg:rounded-br-2xl rounded-0 lg:rounded-bl-none">
              <ul className="flex flex-col h-screen w-90/100 border-r border-gray-300">
                <li
                  className="p-6 border-b border-gray-100 text-xl font-bold text-slate-800 cursor-pointer md:hover:bg-gray-100 transition-colors"
                  onClick={Cuenta}
                >
                  Mi Perfil
                </li>
                <li className="p-6 border-b border-gray-100 text-xl font-bold text-slate-800 cursor-pointer md:hover:bg-gray-100 transition-colors">
                  Calendario
                </li>
                <li className="p-6 border-b border-gray-100 text-xl font-bold text-slate-800 cursor-pointer md:hover:bg-gray-100 transition-colors" onClick={IrConfig}>
                  Configuración
                </li>
                <li className="p-6 w-90/100 border-t-2 border-gray-300 absolute bottom-0 text-xl font-bold text-red-600 cursor-pointer md:hover:bg-red-50 transition-colors">
                  Cerrar Sesión
                </li>
              </ul>
              <button
                className="aspect-square h-10 cursor-pointer"
                onClick={MenuDesplegable}
              >
                X
              </button>
            </nav>
          </>
        )}
      </header>
    </>
  );
}
