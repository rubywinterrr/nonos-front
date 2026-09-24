import IconHome from "../assets/icon-home.png";
import IconHomeW from "../assets/icon-home-white.png";
import IconContactos from "../assets/icon-contactos.png";
import IconContactosW from "../assets/icon-contactos-white.png";
import IconSalud from "../assets/icon-salud.png";
import IconSaludW from "../assets/icon-salud-white.png";
import IconSOS from "../assets/icon-sos.png";
import IconSOSW from "../assets/icon-sos-white.png";
import { useLocation, NavLink } from "react-router-dom";

// Barra de navegación inferior reutilizable.
// Marca la pantalla activa y permite moverse entre Inicio, Salud, Contactos y SOS.
export default function Footer() {
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
      <nav className="bg-white border-t-2 border-[#002B2F] h-[11vh] w-screen fixed bottom-0 flex flex-row justify-evenly items-center">
        <NavLink
          className={`p-1 h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isHome ? "bg-[#002B2F] text-white" : "bg-white hover:bg-[#002B2F]/25"
          }`}
          to={"/Home"}
        >
          <div
            className="aspect-square h-35/100 md:h-55/100 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${isHome ? IconHomeW : IconHome})`,
              backgroundSize: "70%",
            }}
          />
          <p className="font-bold">Inicio</p>
        </NavLink>

        <NavLink
          className={`p-1 h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isSalud ? "bg-[#002B2F] text-white" : "bg-white hover:bg-[#002B2F]/25"
          }`}
          to={"/Salud"}
        >
          <div
            className="aspect-square h-35/100 md:h-55/100 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${isSalud ? IconSaludW : IconSalud})`,
              backgroundSize: "70%",
            }}
          />
          <p className="font-bold">Salud</p>
        </NavLink>

        <NavLink
          className={` p-1 h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isContactos ? "bg-[#002B2F] text-white" : "bg-white hover:bg-[#002B2F]/25"
          }`}
          to={"/Contactos"}
        >
          <div
            className="aspect-square h-35/100 md:h-55/100 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${
                isContactos ? IconContactosW : IconContactos
              })`,
              backgroundSize: "70%",
            }}
          />
          <p className="font-bold">Contactos</p>
        </NavLink>

        <NavLink
          className={`p-1 h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isSos ? "bg-[#002B2F] text-white " : "bg-white hover:bg-[#002B2F]/25"
          }`}
          to={"/SOS"}
        >
          <div
            className="aspect-square h-35/100 md:h-55/100 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${isSos ? IconSOSW : IconSOS})`,
              backgroundSize: "70%",
            }}
          />
          <p className="font-bold">SOS</p>
        </NavLink>
      </nav>
    </>
  );
}
