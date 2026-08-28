import Header2 from "../componentes/cajaArriba2";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
  const navigate = useNavigate();
  function Continuar() {
    navigate("/Home");
  }
  return (
    <>
      <Header2 />
      <main className="w-screen h-[90vh] bg-purple-200 flex flex-col justify-evenly items-center">
        <h1 className="text-4xl font-extrabold">Cuenta</h1>
        <div className="border h-70/100 w-75/100 rounded-2xl bg-white flex flex-col justify-center items-center gap-5">
          <h2 className="text-3xl font-bold pb-12">Log In</h2>
          <input
            type="text"
            className="w-80/100 h-10/100 bg-gray-200 border placeholder:text-[.75rem] focus:bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1"
            placeholder="Correo electronico o nombre de usuario"
          />
          <input
            type="password"
            name=""
            id=""
            className="w-70/100 h-10/100 bg-gray-200 border placeholder:text-xs focus:bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1"
            placeholder="Contraseña"
          />
          <button
            className="h-7/100 w-auto border rounded-xl p-2 flex justify-center items-center cursor-pointer"
            onClick={Continuar}
          >
            <p>Continuar</p>
          </button>
        </div>
      </main>
    </>
  );
}
