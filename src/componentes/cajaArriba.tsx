import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginScreen = location.pathname === "/";

  function Cuenta() {
    navigate("/Cuenta");
    console.log("Cuenta");
  }

  function MenuDesplegable() {
    console.log("menu");
  }

  return (
    <>
      <header className="bg-blue-300 h-[10vh] md:h-[12vh] w-screen flex items-center justify-between">
        <div
          id="izq"
          className="h-90/100  w-20/100 flex items-center justify-center"
        >
          <div
            className="aspect-square border h-75/100 md:h-80/100 cursor-pointer scale-110"
            onClick={isLoginScreen ? undefined : MenuDesplegable}
          >
            menu
          </div>
        </div>
        <div className="h-90/100  w-60/100 flex items-center justify-center">
          <h1 className="font-black text-5xl md:text-7xl">NONOS</h1>
        </div>
        <div
          id="der"
          className="h-90/100  w-20/100 flex items-center justify-center"
        >
          <div
            className="aspect-square border h-75/100 md:h-80/100 scale-110 cursor-pointer text-sm"
            onClick={isLoginScreen ? undefined : Cuenta}
          >
            cuenta
          </div>
        </div>
      </header>
    </>
  );
}
