import { useNavigate } from "react-router-dom";

// Encabezado global de la aplicación.
// Muestra el menú, el nombre de la app y acceso a la cuenta en todas las pantallas principales.
export default function Header() {
  const navigate = useNavigate();

  

  // Navega a la vista de cuenta del usuario.
  function Cuenta() {
    navigate("/Cuenta");
    console.log("Cuenta");
  }

  // Placeholder para abrir el menú lateral o acciones adicionales del header.
  function MenuDesplegable() {
    console.log("menu");
  }

  return (
    <>
      <header className="border-b-2 h-[10vh] md:h-[12vh] w-screen flex items-center justify-between">
        <div
          id="izq"
          className="h-90/100  w-20/100 flex items-center justify-center"
        >
          <div
            className="aspect-square border h-75/100 md:h-80/100 cursor-pointer scale-110"
            onClick={MenuDesplegable}
          >
            menu
          </div>
        </div>
        <div className="h-90/100  w-60/100 flex items-center justify-center">
          <h1 className="font-bold text-5xl md:text-7xl md:font-extrabold">NONOS</h1>
        </div>
        <div
          id="der"
          className="h-90/100  w-20/100 flex items-center justify-center"
        >
          <div
            className="aspect-square border h-75/100 md:h-80/100 scale-110 cursor-pointer text-sm"
            onClick={Cuenta}
          >
            cuenta
          </div>
        </div>
      </header>
    </>
  );
}
