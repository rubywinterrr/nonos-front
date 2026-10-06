import { GoHome } from "react-icons/go";
import { MdOutlinePeopleAlt, MdOutlineMedicalServices } from "react-icons/md";
import { PiWarningDiamondBold } from "react-icons/pi";
import { useLocation, NavLink } from "react-router-dom";

// Barra de navegación inferior reutilizable.
// Marca la pantalla activa y permite moverse entre Inicio, Salud, Contactos y SOS.
export default function NavBar2() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  // Determina qué opción del footer está activa según la ruta actual.
  const isHome =
    currentPath === "/home" ||
    currentPath === "/adulto" ||
    currentPath === "/cuidador" ||
    currentPath === "/familia";
  const isSalud = currentPath.startsWith("/salud");
  const isContactos = currentPath.startsWith("/contactos");
  const isSos = currentPath.startsWith("/sos");

  return (
    <>
      <nav className="bg-white/65 border-t-2 backdrop-blur-xs rounded-full border-t-white border-b border-b-black/20 shadow-lg lg:h-[11vh] h-[10vh] w-95/100 fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-row justify-evenly items-center">
        <NavLink
          className={`p-1 h-90/100 rounded-full flex justify-center items-center flex-col gap-1 cursor-pointer transition-all duration-150 ${
            isHome ? " bg-[#002B2F]/25 aspect-video" : " aspect-square"
          }`}
          to={"/Home"}
        >
          <div className="aspect-square min-h-40/100 md:h-55/100 lg:text-3xl text-3xl lg:pt-1 ">
            {" "}
            <GoHome />
          </div>
          <p className="font-bold">Inicio</p>
        </NavLink>

        <NavLink
          className={`p-1 h-90/100 rounded-full flex justify-center items-center flex-col gap-1 cursor-pointer transition-all duration-150 ${
            isSalud ? " bg-[#002B2F]/25 aspect-video" : " aspect-square"
          }`}
          to={"/Salud"}
        >
          <div className="aspect-square min-h-40/100 md:h-55/100 lg:text-3xl text-3xl lg:pt-1 ">
            <MdOutlineMedicalServices />
          </div>
          <p className="font-bold">Salud</p>
        </NavLink>

        <NavLink
          className={`p-1 h-90/100 rounded-full flex justify-center items-center flex-col gap-1 cursor-pointer transition-all duration-150 ${
            isContactos ? " bg-[#002B2F]/25 aspect-video" : "aspect-square"
          }`}
          to={"/Contactos"}
        >
          <div className="aspect-square min-h-40/100 md:h-55/100 lg:text-3xl text-3xl lg:pt-1 ">
            <MdOutlinePeopleAlt />{" "}
          </div>
          <p className="font-bold">Contactos</p>
        </NavLink>

        <NavLink
          className={`p-1 h-90/100 rounded-full flex justify-center items-center flex-col gap-1 cursor-pointer transition-all duration-150 ${
            isSos ? " bg-[#002B2F]/25 aspect-video" : "  aspect-square"
          }`}
          to={"/SOS"}
        >
          <div className="aspect-square min-h-40/100 md:h-55/100 lg:text-3xl text-3xl lg:pt-1 ">
            <PiWarningDiamondBold />
          </div>
          <p className="font-bold">SOS</p>
        </NavLink>
      </nav>
    </>
  );
}
