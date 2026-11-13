import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderPublico from "../../components/HeaderPublico";
import { fichaEmergenciaService, type FichaEmergencia } from "../../services/fichaEmergenciaService";
import PantallaIngreso from "./PantallaIngreso";
import PantallaCodigoInvalido from "./PantallaCodigoInvalido";
import PantallaVerificado from "./PantallaVerificado";
import FichaEmergenciaPantalla from "./FichaEmergencia";

const TREINTA_MINUTOS = 30 * 60 * 1000;

// un número de 0 a 9 con un cero adelante ("7" → "07")
function dosDigitos(numero: number) {
  if (numero < 10) return `0${numero}`;
  return `${numero}`;
}

// pantalla pública del médico: se abre al escanear el QR de la pulsera (/emergencia/:qrId).
// Va pasando por: ingresar código → (incorrecto / vencido / usado) → verificado → ficha
export default function Emergencia() {
  const { qrId } = useParams();
  const [pantalla, setPantalla] = useState("ingreso");
  const [codigo, setCodigo] = useState("");
  const [codigoIncorrecto, setCodigoIncorrecto] = useState(false);
  const contenido = useRef<HTMLElement>(null);
  const pantallaAnterior = useRef("ingreso");
  const [validando, setValidando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // la ficha solo vive en memoria: si recargan la página hay que pedir un código nuevo
  const [ficha, setFicha] = useState<FichaEmergencia | null>(null);
  const [vence, setVence] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  // manda el código al back y elige qué pantalla mostrar según la respuesta
  const validar = async () => {
    if (!qrId || validando || codigo.length !== 6) return;
    setError(null);
    setValidando(true);
    try {
      const respuesta = await fichaEmergenciaService.accederFicha(qrId, codigo);
      if (respuesta.ficha) {
        setFicha(respuesta.ficha);
        setSegundosRestantes(TREINTA_MINUTOS / 1000);
        setVence(Date.now() + TREINTA_MINUTOS);
        setPantalla("verificado");
      } else if (respuesta.estado === 409) {
        // el back avisa que ese código ya se usó en los últimos 5 minutos
        setPantalla("usado");
      } else if (respuesta.estado === 401) {
        setCodigoIncorrecto(true);
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
    setCodigo("");
    setCodigoIncorrecto(false);
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

  useLayoutEffect(() => {
    if (pantallaAnterior.current === pantalla && !(pantalla === "incorrecto" && codigoIncorrecto)) return;
    pantallaAnterior.current = pantalla;
    const titulo = contenido.current?.querySelector<HTMLElement>("h1");
    if (titulo) {
      document.title = `${titulo.textContent?.trim()} | NONOS`;
      titulo.tabIndex = -1;
      window.scrollTo(0, 0);
      titulo.focus({ preventScroll: true });
    }
  }, [pantalla, codigoIncorrecto]);

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;

  return (
    <>
      <HeaderPublico />
      <main ref={contenido} id="contenido-principal" tabIndex={-1} className="mainBody pt-24 pb-10">
        <p role="status" className="sr-only">
          {ficha && segundosRestantes > 0 && segundosRestantes <= 120 ? "Quedan dos minutos o menos para que se cierre el acceso a la ficha." : ""}
        </p>

        {(pantalla === "ingreso" || pantalla === "incorrecto") && (
          <PantallaIngreso
            codigo={codigo}
            onCambiarCodigo={(valor) => { setCodigo(valor); setCodigoIncorrecto(false); setError(null); }}
            onValidar={validar}
            incorrecto={pantalla === "incorrecto"}
            codigoInvalido={codigoIncorrecto}
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
            idDispositivo={ficha.idDispositivo}
            tiempoRestante={`${minutos} min ${segundos} seg`}
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
    </>
  );
}
