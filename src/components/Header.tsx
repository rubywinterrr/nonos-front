import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Encabezado global de la aplicación.
// Muestra el menú, el nombre de la app y acceso a la cuenta en todas las pantallas principales.
export default function Header() {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(() => window.scrollY > 0);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  function Cuenta() {
    navigate("/cuenta");
  }

  return (
    <>
      <header
        className={`flex justify-between items-center w-full min-h-[6vh] bg-main-blue fixed top-0 p-3 py-4 left-1/2 border-b-2 border-gray-200 z-50 -translate-x-1/2 ${hasScrolled ? "shadow-md" : "shadow-none"
          }`}
      >
        {/* logo oficial (componente "Logo/Header (isotipo + NONOS)" del Figma) */}
        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-[#0A2666] lg:text-3xl">
          <img src="/public/logo/isotipo-cuadrado.png" alt="" className="size-9 lg:size-11" />
          NONOS
        </h1>
        <FaRegUserCircle
          onClick={Cuenta}
          className="text-4xl hover:text-white cursor-pointer"
        />
      </header>
    </>
  );
}