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
  const [rol, setRol] = useState("");

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
        className="w-90/100 md:w-60/100 lg:w-40/100 flex flex-col justify-center items-center gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="h-25/100 w-80/100 flex flex-col gap-1">
          <label className="text-lg">Nombre completo </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 bg-white shadow placeholder:text-[.75rem] focus:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1"
            placeholder="Ej: nonos@gmail.com"
          />
          <span className="text-xs text-gray-500">
            Ingrese su nombre completo.
          </span>
        </div>
        <div className="h-25/100 w-80/100 flex flex-col gap-1">
          <label className="text-lg">Correo electrónico </label>
          <input
            type="email"
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
          <label className="text-lg">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name=""
            id=""
            className="w-full h-12 bg-white shadow placeholder:text-xs focus:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1"
            placeholder="Ej: Nonos1234!"
          />
          <span className="text-xs text-gray-500">
            La contraseña debe contener:
          </span>
          <span className="text-xs text-gray-500">Mínimo 8 caracteres</span>
          <span className="text-xs text-gray-500">
            Al menos un digito (0-9)
          </span>
          <span className="text-xs text-gray-500">
            Al menos un caracter especial (! @ # $ % & * ?)
          </span>
        </div>
        <div className="flex flex-col gap-1 mt-2 w-80/100 ">
          <label className="text-lg font-bold">Selecciona tu rol</label>
          <span className="text-sm text-gray-500">
            Elegí en función de tu usuario
          </span>

          <div className="flex flex-row justify-between gap-2 mt-2">
            {["Adulto mayor", "Familiar", "Cuidador"].map((opcion) => (
              <button
                type="button"
                key={opcion}
                onClick={() => setRol(opcion)}
                className={`flex-1 p-3 border rounded-lg cursor-pointer text-center font-bold text-sm transition-all ${
                  rol === opcion
                    ? "border-black bg-gray-300 text-black shadow-inner"
                    : "border-black bg-white text-black hover:bg-gray-100"
                }`}
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>
        <button
          className="h-15/100 w-70/100 shadow-md bg-black text-white text-xl rounded-xl p-2 flex justify-center items-center cursor-pointer"
          type="submit"
          disabled={cargando}
        >
          <p>{cargando ? "Entrando..." : "Ingresar"}</p>
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}{" "}
      </form>
    </>
  );
}
