import { useNavigate, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginScreen = location.pathname === "/";

  function IrHome() {
    navigate("/home");
    console.log("Home")
  }
  return (
    <>
      <footer className="bg-white border-t-2 border-[#002B2F] h-[13vh] w-screen fixed bottom-0 flex flex-row justify-evenly items-center">
        <div
          className="h-93/100 border rounded-lg aspect-square flex justify-center items-center flex-col cursor-pointer"
          onClick={isLoginScreen ? undefined : IrHome}
        >
          <div className="aspect-square h-50/100 border"></div>
          <p className="font-bold">Inicio</p>
        </div>
        <div className="h-93/100 border rounded-lg aspect-square flex justify-center items-center flex-col">
          <div className="aspect-square h-50/100 border"></div>
          <p className="font-bold">Salud</p>
        </div>
        <div className="h-93/100 border rounded-lg aspect-square flex justify-center items-center flex-col">
          <div className="aspect-square h-50/100 border"></div>
          <p className="font-bold">Contactos</p>
        </div>
        <div className="h-93/100 border rounded-lg aspect-square flex justify-center items-center flex-col bg-[#FFDAD6]">
          <div className="aspect-square h-50/100 border border-[#D0021B]"></div>
          <p className="font-bold text-[#D0021B]">SOS</p>
        </div>
      </footer>
    </>
  );
}
