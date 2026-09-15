import LogInForm from "../components/LogInForm";
import RegisterForm from "../components/RegisterForm";
import { useState } from "react";

// Pantalla de autenticación inicial.
// Aquí el usuario inicia sesión con DNI y contraseña para ingresar a la app.
export default function Ingreso() {
  const [hasAccount, setHasAccount] = useState(true);
  function toggleForm() {
    setHasAccount(!hasAccount);
  }

  return (
    <>
      <main className="w-screen min-h-screen bg-main flex flex-col justify-center gap-5 items-center">
        <div className="flex flex-col gap-3 items-center text[#002B2F]">
          <div className="h-20 bg-gray-300 aspect-square rounded-3xl" />
          <div className="flex flex-col items-center gap-0">
            <h1 className="text-3xl font-semibold">NONOS</h1>
            <span className="text-md text-gray-500 p-0 m-0">
              Acompañamiento Mayor
            </span>
          </div>
          <h2 className="text-2xl font-bold">{hasAccount ? "Ingrese a NONOS" : "Registrese a NONOS"}</h2>
        </div>
        <div className="border w-80/100 md:w-30/100 h-15 md:h-18 bg-white rounded-2xl text-center">
          gugel
        </div>
        <div className="flex items-center w-80/100">
          <div className="border-t grow border-gray-300"></div>
          <span className="px-4 text-md text-gray-400">O bien</span>
          <div className="border-t grow border-gray-300"></div>
        </div>
        {hasAccount ? <LogInForm /> : <RegisterForm />}
        <footer className="w-80/100 h-auto flex flex-col gap-5 items-center justify-center ">
          <span
            className="active:underline cursor-pointer"
            onClick={toggleForm}
          >
            {hasAccount
              ? "¿No tiene cuenta? Regístrese"
              : "¿Ya tiene cuenta? Inicie sesión"}
          </span>
          <hr className="border w-screen border-gray-200 m-0" />
          <h2 className="active:underline cursor-pointer text-xl text-[#0D5C63]">
            ¿Olvidó su contraseña?
          </h2>
          <h2 className="active:underline cursor-pointer text-xl text-[#0D5C63] mb-10">
            Contactar a Soporte
          </h2>
        </footer>
      </main>
    </>
  );
}
