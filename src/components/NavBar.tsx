import { GoHome } from "react-icons/go";
import { MdOutlinePeopleAlt, MdOutlineMedicalServices } from "react-icons/md";
import { PiWarningDiamondBold } from "react-icons/pi";
import { useLocation, NavLink } from "react-router-dom";

// Barra de navegación inferior reutilizable.
// Marca la pantalla activa y permite moverse entre Inicio, Salud, Contactos y SOS.
export default function NavBar() {
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
      <nav className="bg-white border-t-2 border-[#002B2F] lg:h-[11vh] h-[12vh] w-screen fixed bottom-0 flex flex-row justify-evenly items-center">
        <NavLink
          className={`p-1 h-90/100 rounded-lg lg:rounded-bl-lg rounded-bl-[50%] lg:mb-0 mb-1 aspect-square flex justify-center items-center flex-col gap-1 cursor-pointer transition-all duration-150 ${
            isHome
              ? "bg-[#002B2F] text-white"
              : "bg-white hover:bg-[#002B2F]/25"
          }`}
          to={"/adulto/home"}
        >
          <div className="aspect-square h-35/100 md:h-55/100 lg:text-3xl text-2xl lg:pt-1">
            {" "}
            <GoHome />
          </div>
          <p className="font-bold">Inicio</p>
        </NavLink>

        <NavLink
          className={`p-1 h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col gap-1 cursor-pointer transition-all duration-150 ${
            isSalud
              ? "bg-[#002B2F] text-white"
              : "bg-white hover:bg-[#002B2F]/25"
          }`}
          to={"/adulto/Salud"}
        >
          <div className="aspect-square h-35/100 md:h-55/100 lg:text-3xl text-2xl lg:pt-1">
            <MdOutlineMedicalServices />
          </div>
          <p className="font-bold">Salud</p>
        </NavLink>

        <NavLink
          className={` p-1 h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col gap-1 cursor-pointer transition-all duration-150 ${
            isContactos
              ? "bg-[#002B2F] text-white"
              : "bg-white hover:bg-[#002B2F]/25"
          }`}
          to={"/adulto/Contactos"}
        >
          <div className="aspect-square h-35/100 md:h-55/100 lg:text-3xl text-2xl lg:pt-1">
            <MdOutlinePeopleAlt />{" "}
          </div>
          <p className="font-bold">Contactos</p>
        </NavLink>

        <NavLink
          className={`p-1 h-90/100 rounded-lg lg:rounded-br-lg rounded-br-[50%] lg:mb-0 mb-1 aspect-square flex justify-center items-center flex-col gap-1 cursor-pointer transition-all duration-150 ${
            isSos
              ? "bg-[#002B2F] text-white "
              : "bg-white hover:bg-[#002B2F]/25"
          }`}
          to={"/adulto/SOS"}
        >
          <div className="aspect-square h-35/100 md:h-55/100 lg:text-3xl text-2xl lg:pt-1">
            <PiWarningDiamondBold />
          </div>
          <p className="font-bold">SOS</p>
        </NavLink>
      </nav>
    </>
  );
}
