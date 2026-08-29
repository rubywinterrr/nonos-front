import { useNavigate, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginScreen = location.pathname === "/";
  const currentPath = location.pathname.toLowerCase();

  const isHome =
    currentPath === "/home" ||
    currentPath === "/adulto" ||
    currentPath === "/cuidador" ||
    currentPath === "/familia";
  const isSalud = currentPath.startsWith("/salud");
  const isContactos = currentPath.startsWith("/contactos");
  const isSos = currentPath.startsWith("/sos");

  function IrHome() {
    navigate("/Home");
    console.log("Home");
  }

  function IrSalud() {
    navigate("/Salud");
    console.log("Salud");
  }

  function IrContactos() {
    navigate("/Contactos");
    console.log("Contactos");
  }

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
