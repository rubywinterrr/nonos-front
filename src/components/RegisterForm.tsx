import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import rutaSegunRol from "../utils/rutaSegunRol";
import {
  MdMailOutline,
  MdLock,
  MdLogin,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import PasswordInput from "./PasswordInput";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const [opcionRol, setOpcionRol] = useState("");
  const [tipoCuidador, setTipoCuidador] = useState("");
  const [passwordInvalida, setPasswordInvalida] = useState(false);
  const primerRol = useRef<HTMLButtonElement>(null);
  const primeraModalidad = useRef<HTMLButtonElement>(null);

  const passwordRequirements = [
    { label: "Mínimo 8 caracteres", met: password.length >= 8 },
    { label: "Al menos una mayúscula (A-Z)", met: /[A-Z]/.test(password) },
    { label: "Al menos un dígito (0-9)", met: /\d/.test(password) },
    {
      label: 'Al menos un carácter especial (! @ # $ % ^ & * ( ) , . ? " : { } | < >)',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const handleRegister = async () => {
    setError("");
    if (!passwordRequirements.every((requirement) => requirement.met)) {
      setPasswordInvalida(true);
      setError("La contraseña no cumple todos los requisitos.");
      document.getElementById("register-password")?.focus();
      return;
    }
    if (!opcionRol) {
      setError("Por favor, selecciona un rol para continuar.");
      primerRol.current?.focus();
      return;
    }
    if (opcionRol === "Cuidador" && !tipoCuidador) {
      setError("Por favor, especifica el tipo de cuidador.");
      primeraModalidad.current?.focus();
      return;
    }

    const rol =
      opcionRol === "Adulto mayor" ? "ADULTO_MAYOR" :
        opcionRol === "Cuidador" ? "CUIDADOR" : "FAMILIAR";

    setCargando(true);
    try {
      await authService.register({ nombreCompleto, email, password, rol });
      const usuarioLogueado = await login({ email, password });
      // el adulto mayor recién registrado completa su ficha antes de llegar al home
      if (usuarioLogueado.rol === "ADULTO_MAYOR") {
        navigate("/adulto/configurar-cuenta");
      } else {
        navigate(rutaSegunRol(usuarioLogueado.rol));
      }
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
          handleRegister();
        }}
      >
        <div className="h-25/100 w-80/100 flex flex-col gap-1">
          <label htmlFor="register-nombre" className="text-lg flex items-center gap-2">
            <FaUser aria-hidden="true" />
            Nombre completo
            <span aria-hidden="true" className="font-bold text-red-700">*</span>
          </label>
          <input
            className="w-full h-12 bg-white shadow placeholder:text-[.75rem] focus:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1"
            id="register-nombre"
            name="name"
            autoComplete="name"
            aria-describedby="register-nombre-ayuda"
            placeholder="Ej: Juan Carlos Cruz"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            required
          />
          <span id="register-nombre-ayuda" className="text-xs text-gray-700">
            Ingrese su nombre completo.
          </span>
        </div>
        <div className="h-25/100 w-80/100 flex flex-col gap-1">
          <label htmlFor="register-email" className="text-lg flex items-center gap-2">
            <MdMailOutline aria-hidden="true" />
            Correo electrónico
            <span aria-hidden="true" className="font-bold text-red-700">*</span>
          </label>
          <input
            id="register-email"
            name="email"
            autoComplete="username"
            aria-describedby="register-email-ayuda"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 bg-white shadow placeholder:text-[.75rem] focus:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1"
            placeholder="Ej: nonos@gmail.com"
          />
          <span id="register-email-ayuda" className="text-xs text-gray-700">
            Ingresá tu correo electrónico completo, sin espacios.
          </span>
        </div>
        <div className="h-25/100 w-80/100 flex flex-col gap-1 ">
          <label htmlFor="register-password" className="text-lg flex items-center gap-2">
            <MdLock aria-hidden="true" />
            Contraseña
            <span aria-hidden="true" className="font-bold text-red-700">*</span>
          </label>
          <PasswordInput
            id="register-password"
            value={password}
            onChange={(valor) => { setPassword(valor); setPasswordInvalida(false); }}
            autoComplete="new-password"
            descripcion="register-password-requisitos"
            invalida={passwordInvalida}
            placeholder="Ej: Nonos1234!"
          />
          <div id="register-password-requisitos" className="flex flex-col gap-1">
            <p className="text-xs text-gray-700">La contraseña debe contener:</p>
            <ul className="flex flex-col gap-1">
              {passwordRequirements.map((requirement) => (
                <li
                  key={requirement.label}
                  className={`flex items-center gap-1 text-xs ${!password ? "text-gray-700" : requirement.met ? "text-green-800" : "text-red-800"}`}
                >
                  {password && (requirement.met ? <MdCheckCircle aria-hidden="true" /> : <MdCancel aria-hidden="true" />)}
                  {password && <span className="sr-only">{requirement.met ? "Cumplido: " : "Pendiente: "}</span>}
                  {requirement.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-5 mt-2 w-80/100 ">
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1">
              <p id="register-rol" className="text-lg font-bold">
                Selecciona tu rol{" "}
                <span aria-hidden="true" className="font-bold text-red-700">*</span>
              </p>
              <span className="text-sm text-gray-700">
                Elegí en función de tu usuario
              </span>
            </div>

            <div role="group" aria-labelledby="register-rol" className="flex flex-wrap justify-between gap-2 mt-2">
              {["Adulto mayor", "Familiar", "Cuidador"].map((opcion) => (
                <button
                  type="button"
                  key={opcion}
                  ref={opcion === "Adulto mayor" ? primerRol : undefined}
                  aria-pressed={opcionRol === opcion}
                  onClick={() => setOpcionRol(opcion)}
                  className={`flex-1 p-3 border rounded-lg cursor-pointer text-center font-bold text-sm transition-all ${opcionRol === opcion
                    ? "border-black bg-gray-300 text-black shadow-inner"
                    : "border-black bg-white text-black hover:bg-gray-100"
                    }`}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
          {opcionRol === "Cuidador" && (
            <div className="flex flex-col gap-5 w-full">
              <div>
                <p id="register-modalidad" className="font-bold text-lg text-gray-800">
                  En el caso de ser cuidador
                </p>
                <p className="text-sm text-gray-700">
                  Especifique su rol específico
                </p>
              </div>
              <div role="group" aria-labelledby="register-modalidad" className="flex flex-wrap justify-around gap-2">
                {["Cuidador Físico", "Cuidador Digital"].map((tipo) => (
                  <button
                    className={`border rounded-lg p-2 cursor-pointer font-semibold text-sm min-w-fit w-40/100  ${tipoCuidador === tipo
                      ? "bg-gray-300"
                      : "hover:bg-gray-100 bg-white"
                      }`}
                    onClick={() => setTipoCuidador(tipo)}
                    type="button"
                    key={tipo}
                    ref={tipo === "Cuidador Físico" ? primeraModalidad : undefined}
                    aria-pressed={tipoCuidador === tipo}
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
        >
          <span className="flex gap-3 items-center text-md transition-none!">
            {" "}
            <MdLogin aria-hidden="true" />
            {cargando ? "Entrando..." : "Registrarme"}
          </span>
        </button>
        <p role="alert" className={error ? "text-red-800 text-sm" : "sr-only"}>{error}</p>
      </form>
    </>
  );
}
