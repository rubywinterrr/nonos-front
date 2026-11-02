import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { LuBell } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  notificaciones?: number;
  onNotificacionesClick?: () => void;
}

// Encabezado global de la aplicación.
// Muestra el menú, el nombre de la app y acceso a la cuenta en todas las pantallas principales.
export default function Header({ notificaciones, onNotificacionesClick }: HeaderProps) {
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
          <img src="/logo/isotipo-cuadrado.png" alt="" className="size-9 lg:size-11" />
          NONOS
        </h1>
        <div className="flex items-center gap-3">
          {onNotificacionesClick && (
            <button
              type="button"
              onClick={onNotificacionesClick}
              aria-label={notificaciones ? `Ver ${notificaciones} avisos pendientes` : "Ver avisos"}
              className="relative flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-white/35 active:bg-white/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
            >
              <LuBell aria-hidden="true" className="size-7" />
              {!!notificaciones && (
                <span aria-hidden="true" className="absolute -right-1 -top-1 flex min-w-6 items-center justify-center rounded-full border-2 border-[#B9D2FF] bg-[#A92323] px-1 text-xs font-bold leading-5 text-white">
                  {notificaciones > 99 ? "99+" : notificaciones}
                </span>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={Cuenta}
            aria-label="Mi cuenta"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-white/35 active:bg-white/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
          >
            <FaRegUserCircle aria-hidden="true" className="text-4xl" />
          </button>
        </div>
      </header>
    </>
  );
}
