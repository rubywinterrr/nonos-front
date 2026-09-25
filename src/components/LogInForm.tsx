import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MdMailOutline, MdLock, MdLogin } from "react-icons/md";

export default function LogInForm() {
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
        className="w-90/100 lg:w-50/100 xl:w-35/100 flex flex-col justify-center items-center gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="h-25/100 w-80/100 flex flex-col gap-1">
          <label className="text-lg flex items-center gap-2">
            <MdMailOutline />
            Correo electrónico <span className="font-bold text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 bg-white shadow placeholder:text-[.75rem] focus:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1"
            placeholder="Ej: nonos@gmail.com"
          />
          <span className="text-xs text-gray-500">
            Solo el correo. Sin espacios ni guiones.
          </span>
        </div>
        <div className="h-25/100 w-80/100 flex flex-col gap-1 ">
          <label className="text-lg flex items-center gap-2">
            <MdLock />
            Contraseña <span className="font-bold text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            name=""
            id=""
            className="w-full h-12 bg-white shadow placeholder:text-xs focus:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1"
            placeholder="Ej: Nonos1234!"
          />
        </div>
        <button
          className="h-15/100 w-70/100 shadow-md bg-black text-white rounded-xl p-2 flex justify-center items-center cursor-pointer ring ring-black hover:bg-[#F5F5F5] hover:text-black transition-none!"
          type="submit"
          disabled={cargando}
        >
          <p className="flex gap-3 items-center text-md transition-none!">
            {" "}
            <MdLogin />
            {cargando ? "Entrando..." : "Ingresar"}
          </p>
        </button>
        {error && <p className="text-red-600 text-xs">{error}</p>}
      </form>
    </>
  );
}
