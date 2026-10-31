import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderPublico from "../../components/HeaderPublico";
import { fichaEmergenciaService, type FichaEmergencia } from "../../services/fichaEmergenciaService";
import PantallaIngreso from "./PantallaIngreso";
import PantallaCodigoInvalido from "./PantallaCodigoInvalido";
import PantallaVerificado from "./PantallaVerificado";
import FichaEmergenciaPantalla from "./FichaEmergencia";

const TREINTA_MINUTOS = 30 * 60 * 1000;
const DIGITOS_VACIOS = ["", "", "", "", "", ""];

// un número de 0 a 9 con un cero adelante ("7" → "07")
function dosDigitos(numero: number) {
  if (numero < 10) return `0${numero}`;
  return `${numero}`;
}

// clave donde este celular recuerda el último código que funcionó para esta pulsera.
// El back invalida el código apenas se usa, así que si lo vuelven a escribir sabemos que es "ya utilizado"
function claveCodigoUsado(qrId: string) {
  return `nonos_codigo_usado_${qrId}`;
}

// lee el último código usado (null si no hay o si el navegador no deja)
function leerCodigoUsado(qrId: string) {
  try {
    return sessionStorage.getItem(claveCodigoUsado(qrId));
  } catch {
    return null;
  }
}

// guarda el código que acaba de funcionar
function guardarCodigoUsado(qrId: string, codigo: string) {
  try {
    sessionStorage.setItem(claveCodigoUsado(qrId), codigo);
  } catch {
    // si no se puede guardar, solo se pierde el aviso de "ya utilizado"
  }
}

// pantalla pública del médico: se abre al escanear el QR de la pulsera (/emergencia/:qrId).
// Va pasando por: ingresar código → (incorrecto / vencido / usado) → verificado → ficha
export default function Emergencia() {
  const { qrId } = useParams();
  const [pantalla, setPantalla] = useState("ingreso");
  const [digitos, setDigitos] = useState(DIGITOS_VACIOS);
  const [validando, setValidando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // la ficha solo vive en memoria: si recargan la página hay que pedir un código nuevo
  const [ficha, setFicha] = useState<FichaEmergencia | null>(null);
  const [vence, setVence] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [segundosRedireccion, setSegundosRedireccion] = useState(3);

  // manda el código al back y elige qué pantalla mostrar según la respuesta
  const validar = async () => {
    if (!qrId) return;
    const codigo = digitos.join("");
    setError(null);

    // si es el mismo código que ya funcionó en este celular, el back ya lo invalidó
    if (leerCodigoUsado(qrId) === codigo) {
      setPantalla("usado");
      return;
    }

    setValidando(true);
    try {
      const respuesta = await fichaEmergenciaService.accederFicha(qrId, codigo);
      if (respuesta.ficha) {
        guardarCodigoUsado(qrId, codigo);
        setFicha(respuesta.ficha);
        setVence(Date.now() + TREINTA_MINUTOS);
        setSegundosRedireccion(3);
        setPantalla("verificado");
      } else if (respuesta.estado === 401) {
        setPantalla("incorrecto");
      } else if (respuesta.estado === 410) {
        setPantalla("vencido");
      } else if (respuesta.estado === 429) {
        setError("Demasiados intentos fallidos. Probá de nuevo en unos minutos.");
      } else if (respuesta.estado === 404) {
        setError("Este código QR no está activo. Pedile al familiar o cuidador que revise la app de NONOS.");
      } else {
        setError("No se pudo validar el código. Probá de nuevo.");
      }
    } catch (err) {
      console.error(err);
      setError("No hay conexión. Revisá internet y probá de nuevo.");
    } finally {
      setValidando(false);
    }
  };

  // vuelve a la pantalla para escribir un código, con las cajas vacías
  const ingresarOtro = () => {
    setDigitos(DIGITOS_VACIOS);
    setError(null);
    setPantalla("ingreso");
  };

  // cierra la ficha y borra los datos de la memoria
  const finalizar = () => {
    setFicha(null);
    setVence(0);
    ingresarOtro();
  };

  useEffect(() => {
    if (!vence) return;

    // cada segundo calcula cuánto queda de los 30 minutos; al llegar a 0 cierra la ficha
    const actualizar = () => {
      const faltan = Math.round((vence - Date.now()) / 1000);
      if (faltan <= 0) {
        setFicha(null);
        setVence(0);
        setPantalla("vencido");
        return;
      }
      setSegundosRestantes(faltan);
    };
    actualizar();
    const intervalo = setInterval(actualizar, 1000);
    return () => clearInterval(intervalo);
  }, [vence]);

  useEffect(() => {
    if (pantalla !== "verificado") return;

    // cuenta 3, 2, 1 y pasa sola a la ficha
    let quedan = 3;
    const intervalo = setInterval(() => {
      quedan = quedan - 1;
      setSegundosRedireccion(quedan);
      if (quedan <= 0) setPantalla("ficha");
    }, 1000);
    return () => clearInterval(intervalo);
  }, [pantalla]);

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;

  return (
    <main className="mainBody pt-24 pb-10">
      <HeaderPublico />

      {(pantalla === "ingreso" || pantalla === "incorrecto") && (
        <PantallaIngreso
          digitos={digitos}
          onCambiarDigitos={setDigitos}
          onValidar={validar}
          incorrecto={pantalla === "incorrecto"}
          validando={validando}
          error={error}
        />
      )}

      {pantalla === "vencido" && <PantallaCodigoInvalido motivo="vencido" onIngresarOtro={ingresarOtro} />}
      {pantalla === "usado" && <PantallaCodigoInvalido motivo="usado" onIngresarOtro={ingresarOtro} />}

      {pantalla === "verificado" && ficha && (
        <PantallaVerificado
          nombre={ficha.nombreCompleto}
          edad={ficha.edad}
          tiempoRestante={`${minutos} min ${segundos} seg`}
          segundosRedireccion={segundosRedireccion}
          onVerFicha={() => setPantalla("ficha")}
        />
      )}

      {pantalla === "ficha" && ficha && (
        <FichaEmergenciaPantalla
          ficha={ficha}
          tiempoRestante={`${minutos} min ${dosDigitos(segundos)}s`}
          onFinalizar={finalizar}
        />
      )}
    </main>
  );
}
