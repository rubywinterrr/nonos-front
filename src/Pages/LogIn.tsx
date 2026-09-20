import LogInForm from "../components/LogInForm";
import RegisterForm from "../components/RegisterForm";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

function IngresoContent() {
  const [hasAccount, setHasAccount] = useState(true);

  function toggleForm() {
    setHasAccount(!hasAccount);
  }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log("Token:", tokenResponse),
    onError: (error) => console.error("Error:", error),
  });

  useEffect(() => {
    document.body.style.setProperty("background-color", "#F7F9FF", "important");
    return () => {
      document.body.style.removeProperty("background-color");
    };
  }, []);

  return (
    <main className="w-screen min-h-screen bg-main flex flex-col justify-center gap-5 items-center pt-10 pb-10">
      <div className="flex flex-col gap-3 items-center text-[#002B2F]">
        <div className="h-20 bg-gray-300 aspect-square rounded-3xl" />
        <div className="flex flex-col items-center gap-0">
          <h1 className="text-3xl font-semibold">NONOS</h1>
          <span className="text-md text-gray-500 p-0 m-0">
            Acompañamiento Mayor
          </span>
        </div>
        <h2 className="text-2xl font-bold">
          {hasAccount ? "Ingrese a NONOS" : "Registrese a NONOS"}
        </h2>
      </div>

      <button
        type="button"
        onClick={() => login()}
        className="w-80 cursor-pointer py-2.5 mt-10 px-4 bg-white border rounded-lg hover:bg-gray-200 flex items-center justify-center gap-3 font-medium text-gray-700 transition-all"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Continuar con Google
      </button>

      <div className="flex items-center w-[80%] lg:w-[40%]">
        <div className="border-t grow border-gray-400"></div>
        <span className="px-4 text-md text-gray-500 font-semibold">O BIEN</span>
        <div className="border-t grow border-gray-400"></div>
      </div>

      {hasAccount ? <LogInForm /> : <RegisterForm />}

      <span className="active:underline cursor-pointer" onClick={toggleForm}>
        {hasAccount
          ? "¿No tiene cuenta? Regístrese"
          : "¿Ya tiene cuenta? Inicie sesión"}
      </span>

      <a href="/home" className="underline">
        home
      </a>

      {/* <footer className="w-[80%] h-auto flex flex-col gap-5 items-center justify-center ">
        
        <hr className="border w-screen border-gray-200 m-0" />
        <h2 className="active:underline cursor-pointer text-xl text-[#0D5C63]">
          ¿Olvidó su contraseña?
        </h2>
        <h2 className="active:underline cursor-pointer text-xl text-[#0D5C63">
          Contactar a Soporte
        </h2>
      </footer>*/}
    </main>
  );
}

// Exportación envuelta en el Provider
export default function Ingreso() {
  return (
    <GoogleOAuthProvider clientId="329138846196-q5d13gj5v3ojlgge0f484jql8lo53fj5.apps.googleusercontent.com ">
      <IngresoContent />
    </GoogleOAuthProvider>
  );
}
