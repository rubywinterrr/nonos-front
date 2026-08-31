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
          className={`h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isHome
              ? "border-2 border-[#002B2F] bg-[#E8F1F2]"
              : "border border-gray-300 bg-white hover:bg-gray-50"
          }`}
          onClick={isLoginScreen ? undefined : IrHome}
        >
          <div
            className={`aspect-square h-50/100 border ${
              isHome ? "border-[#002B2F] bg-white" : "border-gray-400"
            }`}
          ></div>
          <p
            className={`font-bold ${isHome ? "text-[#002B2F]" : "text-gray-800"}`}
          >
            Inicio
          </p>
        </div>

        <div
          className={`h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isSalud
              ? "border-2 border-[#002B2F] bg-[#E8F1F2]"
              : "border border-gray-300 bg-white hover:bg-gray-50"
          }`}
          onClick={isLoginScreen ? undefined : IrSalud}
        >
          <div
            className={`aspect-square h-50/100 border ${
              isSalud ? "border-[#002B2F] bg-white" : "border-gray-400"
            }`}
          ></div>
          <p
            className={`font-bold ${isSalud ? "text-[#002B2F]" : "text-gray-800"}`}
          >
            Salud
          </p>
        </div>

        <div
          className={`h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer transition-all duration-150 ${
            isContactos
              ? "border-2 border-[#002B2F] bg-[#E8F1F2]"
              : "border border-gray-300 bg-white hover:bg-gray-50"
          }`}
          onClick={isLoginScreen ? undefined : IrContactos}
        >
          <div
            className={`aspect-square h-50/100 border ${
              isContactos ? "border-[#002B2F] bg-white" : "border-gray-400"
            }`}
          ></div>
          <p
            className={`font-bold ${isContactos ? "text-[#002B2F]" : "text-gray-800"}`}
          >
            Contactos
          </p>
        </div>

        <div
          className={`h-93/100 rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer transition-all duration-150 bg-[#FFDAD6] ${
            isSos
              ? "border-2 border-[#D0021B] ring-2 ring-[#D0021B]/30"
              : "border border-[#D0021B]/40 hover:bg-[#ffcdd2]"
          }`}
          onClick={isLoginScreen ? undefined : IrSOS}
        >
          <div
            className={`aspect-square h-50/100 border border-[#D0021B] ${
              isSos ? "bg-white" : ""
            }`}
          ></div>
          <p className="font-bold text-[#D0021B]">SOS</p>
        </div>
      </footer>
    </>
  );
}
