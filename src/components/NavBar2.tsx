import { GoHome } from "react-icons/go";
import { MdOutlinePeopleAlt, MdOutlineMedicalServices } from "react-icons/md";
import { VscGear } from "react-icons/vsc";
import { useLocation, NavLink } from "react-router-dom";

// Barra de navegación inferior reutilizable.
// Marca la pantalla activa y permite moverse entre Inicio, Salud, Contactos y SOS.
export default function NavBar2() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  // Determina qué opción del footer está activa según la ruta actual.
  const isHome =
    currentPath === "/adulto/home" ||
    currentPath === "/adulto" ||
    currentPath === "/cuidador" ||
    currentPath === "/familia";
  const isMed = currentPath.startsWith("/adulto/medicamentos");
  const isContactos = currentPath.startsWith("/adulto/contactos");
  const isConfig = currentPath.startsWith("/adulto/configuracion");

  return (
    <>
      <nav className="bg-white/65 backdrop-blur-xs rounded-full border-b border-b-black/20 shadow-lg lg:h-[11vh] h-[9vh] min-w-90/100 fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-row justify-evenly items-center inset-shadow-sm inset-shadow-white">
        <NavLink
          className={`p-1 h-85/100 rounded-full flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isHome ? "bg-[#002B2F]/25 aspect-video" : " aspect-square"
          }`}
          to={"/adulto/Home"}
        >
          <div className="flex items-center justify-center aspect-square min-h-40/100 md:min-h-55/100 lg:text-3xl text-3xl lg:pt-1 ">
            {" "}
            <GoHome />
          </div>
          <p className="font-bold">Inicio</p>
        </NavLink>

        <NavLink
          className={`p-1 h-85/100 rounded-full flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isMed ? " bg-[#002B2F]/25 aspect-video" : " aspect-square"
          }`}
          to={"/adulto/medicamentos"}
        >
          <div className="flex items-center justify-center aspect-square min-h-40/100 md:min-h-55/100 lg:text-3xl text-3xl lg:pt-1 ">
            <MdOutlineMedicalServices />
          </div>
          <p className="font-bold">Medicamentos</p>
        </NavLink>

        <NavLink
          className={`p-1 h-85/100 rounded-full flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isContactos ? " bg-[#002B2F]/25 aspect-video" : "aspect-square"
          }`}
          to={"/adulto/Contactos"}
        >
          <div className="flex items-center justify-center aspect-square min-h-40/100 md:min-h-55/100 lg:text-3xl text-3xl lg:pt-1 ">
            <MdOutlinePeopleAlt />{" "}
          </div>
          <p className="font-bold">Contactos</p>
        </NavLink>

        <NavLink
          className={`p-1 h-85/100 rounded-full flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isConfig ? " bg-[#002B2F]/25 aspect-video" : "  aspect-square"
          }`}
          to={"/adulto/configuracion"}
        >
          <div className="flex items-center justify-center aspect-square min-h-40/100 md:min-h-55/100 lg:text-3xl text-3xl lg:pt-1 ">
            <VscGear />
          </div>
          <p className="font-bold">Ajustes</p>
        </NavLink>
      </nav>
    </>
  );
}
