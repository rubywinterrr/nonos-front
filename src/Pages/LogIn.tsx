import heartIMG from "../assets/heart.png";
import LogInForm from "../components/LogInForm";
import RegisterForm from "../components/RegisterForm";
import { useState } from "react";

// Pantalla de autenticación inicial.
// Aquí el usuario inicia sesión con DNI y contraseña para ingresar a la app.
export default function LogIn() {
  const [hasAccount, setHasAccount] = useState(true);
  function toggleForm() {
    setHasAccount(!hasAccount);
  }

  return (
    <>
      <main className="w-screen h-screen bg-main2 flex flex-col justify-evenly items-center">
        <div className="flex flex-col gap-3 items-center text[#002B2F]">
          <img src={heartIMG} alt="corazon" className="h-25 rounded-full" />
          <h1 className="text-4xl font-semibold">Bienvenido a NONOS</h1>
          <h2 className="text-2xl">Su compañero diario de salud.</h2>
        </div>
        {hasAccount ? <LogInForm /> : <RegisterForm /> }
        <div className="w-80/100 h-auto flex flex-col gap-3 items-center justify-center ">
          <span className="active:underline cursor-pointer" onClick={toggleForm}>
            {hasAccount ? "¿No tiene cuenta? Regístrese" : "¿Ya tiene cuenta? Inicie sesión"}
          </span>
          <hr className="border w-screen border-gray-200 m-0" />
          <h2 className="active:underline cursor-pointer text-xl text-[#0D5C63]">
            ¿Olvidó su contraseña?
          </h2>
          <h2 className="active:underline cursor-pointer text-xl text-[#0D5C63]">
            Contactar a Soporte
          </h2>
        </div>
      </main>
    </>
  );
}
