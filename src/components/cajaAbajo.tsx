import IconHome from "../assets/icon-home.png";
import IconHomeW from "../assets/icon-home-white.png";
import IconContactos from "../assets/icon-contactos.png";
import IconContactosW from "../assets/icon-contactos-white.png";
import IconSalud from "../assets/icon-salud.png";
import IconSaludW from "../assets/icon-salud-white.png";
import IconSOS from "../assets/icon-sos.png";
import IconSOSW from "../assets/icon-sos-white.png";
import { useNavigate, useLocation } from "react-router-dom";

// Barra de navegación inferior reutilizable.
// Marca la pantalla activa y permite moverse entre Inicio, Salud, Contactos y SOS.
export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Si la ruta actual es login, se deshabilita la navegación del footer.
  const isLoginScreen = location.pathname === "/";
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

  // Redirige a la vista de inicio del sistema.
  function IrHome() {
    navigate("/Home");
    console.log("Home");
  }

  // Redirige a la sección de salud.
  function IrSalud() {
    navigate("/Salud");
    console.log("Salud");
  }

  // Redirige a la vista de contactos.
  function IrContactos() {
    navigate("/Contactos");
    console.log("Contactos");
  }

  // Redirige a la pantalla de emergencia SOS.
  function IrSOS() {
    navigate("/SOS");
    console.log("Pantalla SOS");
  }

  return (
    <>
      <footer className="bg-white border-t-2 border-[#002B2F] h-[13vh] w-screen fixed bottom-0 flex flex-row justify-evenly items-center">
        <div
          className={`p-1 h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isHome ? "bg-[#002B2F] text-white" : "bg-white hover:bg-[#002B2F]/25"
          }`}
          onClick={isLoginScreen ? undefined : IrHome}
        >
          <div
            className="aspect-square h-35/100 md:h-55/100 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${isHome ? IconHomeW : IconHome})`,
              backgroundSize: "70%",
            }}
          />
          <p className="font-bold">Inicio</p>
        </div>

        <div
          className={`p-1 h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isSalud ? "bg-[#002B2F] text-white" : "bg-white hover:bg-[#002B2F]/25"
          }`}
          onClick={isLoginScreen ? undefined : IrSalud}
        >
          <div
            className="aspect-square h-35/100 md:h-55/100 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${isSalud ? IconSaludW : IconSalud})`,
              backgroundSize: "70%",
            }}
          />
          <p className="font-bold">Salud</p>
        </div>

        <div
          className={` p-1 h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isContactos ? "bg-[#002B2F] text-white" : "bg-white hover:bg-[#002B2F]/25"
          }`}
          onClick={isLoginScreen ? undefined : IrContactos}
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
        </div>

        <div
          className={`p-1 h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isSos ? "bg-[#002B2F] text-white " : "bg-white hover:bg-[#002B2F]/25"
          }`}
          onClick={isLoginScreen ? undefined : IrSOS}
        >
          <div
            className="aspect-square h-35/100 md:h-55/100 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${isSos ? IconSOSW : IconSOS})`,
              backgroundSize: "70%",
            }}
          />
          <p className="font-bold">SOS</p>
        </div>
      </footer>
    </>
  );
}
