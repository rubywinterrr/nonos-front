import { useNavigate } from "react-router-dom";
import {useState} from "react";
import {useAuth} from "../context/AuthContext";

// Pantalla de autenticación inicial.
// Aquí el usuario inicia sesión con DNI y contraseña para ingresar a la app.
export default function LogIn() {
  const navigate = useNavigate();
  const {login} = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);


  // Redirige al usuario a la pantalla principal después de validar el acceso.
  const handleLogin = async () =>{
    setError("");
    setCargando(true);
    try{
      await login({email, password});
      navigate("/Home");
    }
    catch (err) {
      (err instanceof Error ? err.message : "Error al iniciar sesión");
    }
    finally{
      setCargando(false);
    }
  }

  return (
    <>
      <main className="w-screen h-screen bg-main2 flex flex-col justify-evenly items-center">
        <div className="flex flex-col gap-3 items-center text[#002B2F]">
          <img src="" alt="corazon" className="aspect-square h-25 border shadow-md rounded-full" />
          <h1 className="text-4xl font-semibold">Bienvenido a NONOS</h1>
          <h2 className="text-2xl">Su compañero diario de salud.</h2>
        </div>
        <div className="border border-gray-400 shadow-md h-40/100 w-80/100 md:w-60/100 lg:w-40/100 rounded-xl bg-white flex flex-col justify-center items-center gap-3">
          <div className="h-25/100 w-80/100 flex flex-col gap-1">
            <span className="text-lg">Email </span>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-70/100 bg-main2 border-2 border-gray-400 placeholder:text-[.75rem] focus:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1"
              placeholder="Ej: nonos@gmail.com"
            />
          </div>
          <div className="h-25/100 w-80/100 flex flex-col gap-1 ">
            <span className="text-lg">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name=""
              id=""
              className="w-full h-70/100 bg-main2 border-2 border-gray-400 placeholder:text-xs focus:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1"
              placeholder="******"
            />
          </div>
          <button
            className="h-15/100 w-80/100 shadow-md bg-[#012B2F] text-white text-xl rounded-xl p-2 flex justify-center items-center cursor-pointer"
            onClick={handleLogin}
            disabled={cargando}
          >
            <p>{cargando ? "Entrando..." : "Entrar"}</p>
          </button>
        </div>
        <div className="w-80/100 h-auto flex flex-col gap-10 items-center justify-center text-2xl text-[#0D5C63]">
          <h2 className="active:underline cursor-pointer">¿Olvidó su contraseña?</h2>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <h2 className="active:underline cursor-pointer">Contactar a Soporte</h2>
        </div>
      </main>
    </>
  );
}
