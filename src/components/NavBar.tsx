import { GoHomeFill } from "react-icons/go";
import { BsCapsule } from "react-icons/bs";
import { LuPhone } from "react-icons/lu";
import { VscGear } from "react-icons/vsc";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Barra de navegación inferior reutilizable.
// Marca la pantalla activa y conserva los destinos de navegación existentes.
export default function NavBar() {
  const { usuario } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const basePath =
    usuario?.rol === "FAMILIAR"
      ? "/familia"
      : usuario?.rol === "CUIDADOR"
      ? "/cuidador"
      : "/adulto";
  const homePath = `${basePath}/home`;
  const medicinasPath =
    usuario?.rol === "FAMILIAR"
      ? "/familia/medicacion"
      : `${basePath}/medicamentos`;
  const contactosPath = `${basePath}/contactos`;
  const ajustesPath =
    usuario?.rol === "FAMILIAR"
      ? "/familia/configuracion"
      : `${basePath}/configuracion`;

  // Determina qué opción del footer está activa según la ruta actual.
  const isHome = currentPath === homePath || currentPath === basePath;
  const isMed =
    currentPath.startsWith(medicinasPath) ||
    (usuario?.rol === "ADULTO_MAYOR" &&
      currentPath.startsWith("/adulto/salud"));
  const isContactos = currentPath.startsWith(contactosPath);
  const isConfig =
    currentPath.startsWith(ajustesPath) || currentPath === "/cuenta";

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-5 left-1/2 z-50 flex h-17 w-95/100 max-w-lg -translate-x-1/2 items-center rounded-full border border-white/60 bg-white/60 px-2 py-1.5 shadow-lg shadow-black/15 backdrop-blur-md"
    >
      <div className="relative isolate flex h-full w-full">
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 w-1/4 rounded-full bg-[#0B5FFF]/80 transition-transform! duration-300! ease-in-out! motion-reduce:transition-none! ${
            isMed
              ? "translate-x-full"
              : isContactos
              ? "translate-x-200/100"
              : isConfig
              ? "translate-x-300/100"
              : "translate-x-0"
          } ${
            isHome || isMed || isContactos || isConfig
              ? "opacity-100"
              : "opacity-0"
          }`}
        />
        <Link
          to={homePath}
          aria-current={isHome ? "page" : undefined}
          className={`relative flex h-full min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full px-1 text-xs leading-4 tracking-tight transition-colors! duration-150! motion-reduce:transition-none! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            isHome
              ? "font-bold text-white/95 hover:bg-blue-700/20 active:bg-blue-800/30"
              : "font-semibold text-[#202020]/95 hover:bg-[#0B5FFF]/15 active:bg-[#0B5FFF]/25"
          }`}
        >
          <span className="flex h-7 w-12 items-center justify-center">
            <GoHomeFill aria-hidden="true" className="size-7" />
          </span>
          <span>Inicio</span>
        </Link>

        <Link
          to={medicinasPath}
          aria-current={isMed ? "page" : undefined}
          className={`relative flex h-full min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full px-1 text-xs leading-4 tracking-tight transition-colors! duration-150! motion-reduce:transition-none! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            isMed
              ? "font-bold text-white/95 hover:bg-blue-700/20 active:bg-blue-800/30"
              : "font-semibold text-[#202020]/95 hover:bg-[#0B5FFF]/15 active:bg-[#0B5FFF]/25"
          }`}
        >
          <span className="flex h-7 w-12 items-center justify-center">
            <BsCapsule aria-hidden="true" className="size-5 " />
          </span>
          <span>Medicinas</span>
        </Link>

        <Link
          to={contactosPath}
          aria-current={isContactos ? "page" : undefined}
          className={`relative flex h-full min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full px-1 text-xs leading-4 tracking-tight transition-colors! duration-150! motion-reduce:transition-none! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            isContactos
              ? "font-bold text-white/95 hover:bg-blue-700/20 active:bg-blue-800/30"
              : "font-semibold text-[#202020]/95 hover:bg-[#0B5FFF]/15 active:bg-[#0B5FFF]/25"
          }`}
        >
          <span className="flex h-7 w-12 items-center justify-center">
            <LuPhone aria-hidden="true" className="size-5 stroke-2" />
          </span>
          <span>Contactos</span>
        </Link>

        <Link
          to={ajustesPath}
          aria-current={isConfig ? "page" : undefined}
          className={`relative flex h-full min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full px-1 text-xs leading-4 tracking-tight transition-colors! duration-150! motion-reduce:transition-none! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            isConfig
              ? "font-bold text-white/95 hover:bg-blue-700/20 active:bg-blue-800/30"
              : "font-semibold text-[#202020]/95 hover:bg-[#0B5FFF]/15 active:bg-[#0B5FFF]/25"
          }`}
        >
          <span className="flex h-7 w-12 items-center justify-center">
            <VscGear aria-hidden="true" className="size-5" />
          </span>
          <span>Ajustes</span>
        </Link>
      </div>
    </nav>
  );
}
