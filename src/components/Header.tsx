import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdOutlineHealthAndSafety } from "react-icons/md";

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
        className={`flex justify-between items-center w-full min-h-[6vh] bg-main-blue fixed top-0 p-3 py-4 left-1/2 border-b-2 border-gray-200 z-50 -translate-x-1/2 ${
          hasScrolled ? "shadow-md" : "shadow-none"
        }`}
      >
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <MdOutlineHealthAndSafety className="text-4xl lg:text-5xl" />
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
