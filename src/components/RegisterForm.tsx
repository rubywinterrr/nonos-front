import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export default function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Redirige al usuario a la pantalla principal después de validar el acceso.
  const handleLogin = async () => {
    setError("");
    setCargando(true);
    try {
      await login({ email, password });
      navigate("/Home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <form
        className="border border-gray-400 shadow-md h-40/100 w-80/100 md:w-60/100 lg:w-40/100 rounded-xl bg-white flex flex-col justify-center items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="h-25/100 w-80/100 flex flex-col gap-1">
          <span className="text-lg">Email </span>
          <input
            type="email"
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
          type="submit"
          className="h-15/100 w-80/100 shadow-md bg-[#012B2F] text-white text-xl rounded-xl p-2 flex justify-center items-center cursor-pointer"
          disabled={cargando}
        >
          <p>{cargando ? "Entrando..." : "Registrarse"}</p>
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </>
  );
}
