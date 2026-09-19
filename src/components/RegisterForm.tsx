import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import iconCandado from "../assets/Icon-Candado.png";
import iconEmail from "../assets/Icon-Email.png";
import iconPersona from "../assets/Icon-Persona.png";
import iconIngreso from "../assets/Icon-Ingreso.png";
import iconIngresoBlack from "../assets/Icon-Ingreso-Black.png";
export default function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const [rol, setRol] = useState("");
  const [tipoCuidador, setTipoCuidador] = useState("");
  const [botonEnHover, setBotonEnHover] = useState(false);

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
          <label className="text-lg flex items-center gap-2">
            <img
              src={iconPersona}
              alt=""
              className="h-5 aspect-square object-contain p-0.5"
            />
            Nombre completo
          </label>
          <input
            className="w-full h-12 bg-white shadow placeholder:text-[.75rem] focus:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1"
            placeholder="Ej: Juan Carlos Cruz"
          />
          <span className="text-xs text-gray-500">
            Ingrese su nombre completo.
          </span>
        </div>
        <div className="h-25/100 w-80/100 flex flex-col gap-1">
          <label className="text-lg flex items-center gap-2">
            <img
              src={iconEmail}
              alt=""
              className="h-5 aspect-square object-contain p-0.5"
            />
            Correo electrónico
          </label>
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
          <label className="text-lg flex items-center gap-2">
            <img
              src={iconCandado}
              alt=""
              className="h-6 w-6 object-contain p-0.5"
            />
            Contraseña
          </label>
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
        <div className="flex flex-col gap-5 mt-2 w-80/100 ">
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1">
              <label className="text-lg font-bold">Selecciona tu rol</label>
              <span className="text-sm text-gray-500">
                Elegí en función de tu usuario
              </span>
            </div>

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
          {rol === "Cuidador" && (
            <div className="flex flex-col gap-5 w-full">
              <div>
                <p className="font-bold text-lg text-gray-800">
                  En el caso de ser cuidador
                </p>
                <p className="text-sm text-gray-500">
                  Especifique su rol específico
                </p>
              </div>
              <div className="flex justify-around">
                {["Cuidador Físico", "Cuidador Digital"].map((tipo) => (
                  <button
                    className={`border rounded-lg p-2 cursor-pointer font-semibold text-sm w-40/100  ${tipoCuidador === tipo ? "bg-gray-300" : "hover:bg-gray-100"}`}
                    onClick={() => setTipoCuidador(tipo)}
                    type="button"
                    key={tipo}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          className="h-15/100 w-70/100 shadow-md bg-black text-white rounded-xl p-2 flex justify-center items-center cursor-pointer ring ring-black hover:bg-[#F5F5F5] hover:text-black transition-none!"
          type="submit"
          disabled={cargando}
          onMouseEnter={() => setBotonEnHover(true)}
          onMouseLeave={() => setBotonEnHover(false)}
        >
          <p className="flex gap-3 items-center text-md transition-none!">
            {" "}
            <img
              src={botonEnHover ? iconIngresoBlack : iconIngreso}
              alt=""
              className="h-5 aspect-square object-contain p-0.5"
            />
            {cargando ? "Entrando..." : "Ingresar"}
          </p>
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}{" "}
      </form>
    </>
  );
}
