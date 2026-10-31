import { useEffect, useState } from "react";
import VueltaAtras from "../../components/vueltaAtras";
import Header from "../../components/Header";
import {
  LuCircleHelp,
  LuClipboard,
  LuFileKey2,
  LuHistory,
  LuLockKeyhole,
  LuRefreshCw,
  LuShare2,
  LuShieldCheck,
  LuTimer,
} from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService, type AdultoMayorVinculado, type CodigoQR } from "../../services/usuariosService";
import { buscarAdultoSeleccionado } from "../../utils/adultoQueSeMira";

const DURACION_CODIGO = 30 * 60;

// "987212" → "987 - 212", como en el diseño
function codigoConGuion(codigo: string) {
  return `${codigo.slice(0, 3)} - ${codigo.slice(3)}`;
}

// pantalla del familiar/cuidador: el código de emergencia del adulto vinculado que mira
export default function CodigoEmergencia() {
  const { usuario } = useAuth();
  const [adulto, setAdulto] = useState<AdultoMayorVinculado | null>(null);
  const [qr, setQr] = useState<CodigoQR | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  useEffect(() => {
    if (!usuario) return;
    const miId = usuario.id;

    // trae el adulto y su código.
    // PENDIENTE BACK: GET /usuarios/:id/qr solo deja entrar al propio adulto (requireSelf),
    // así que a un familiar o cuidador hoy le responde error y el código no se puede mostrar
    const cargar = async () => {
      try {
        const elegido = await buscarAdultoSeleccionado(miId);
        setAdulto(elegido);
        if (!elegido) return;
        setQr(await usuarioService.getQR(elegido.id));
      } catch (err) {
        console.error(err);
        setQr(null);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario]);

  useEffect(() => {
    if (!qr) return;
    const vence = new Date(qr.expiraEn).getTime();

    // cada segundo recalcula cuánto falta para que venza el código
    const actualizar = () => {
      const faltan = Math.round((vence - Date.now()) / 1000);
      setSegundosRestantes(faltan > 0 ? faltan : 0);
    };
    actualizar();
    const temporizador = window.setInterval(actualizar, 1000);
    return () => window.clearInterval(temporizador);
  }, [qr]);

  // pide un código nuevo (invalida el anterior)
  const generarNuevo = async () => {
    if (!adulto) return;
    setMensaje(null);
    try {
      setQr(await usuarioService.regenerarQR(adulto.id));
    } catch (err) {
      console.error(err);
      setMensaje(`Por ahora el código nuevo solo lo puede generar ${primerNombre} desde su app.`);
    }
  };

  // copia el código al portapapeles
  const copiar = async () => {
    if (!qr) return;
    try {
      await navigator.clipboard.writeText(qr.codigo);
      setMensaje("Código copiado.");
    } catch {
      setMensaje("No se pudo copiar el código.");
    }
  };

  // abre el menú de compartir del celular; si no hay, lo copia
  const compartir = async () => {
    if (!qr) return;
    if (!navigator.share) {
      copiar();
      return;
    }
    try {
      await navigator.share({ text: `Código de emergencia de ${adulto?.nombreCompleto}: ${qr.codigo}` });
    } catch {
      // si la persona cierra el menú de compartir no pasa nada
    }
  };

  const nombreAdulto = adulto ? adulto.nombreCompleto : "";
  const primerNombre = nombreAdulto.split(" ")[0];
  const vigente = qr !== null && qr.isActivo && segundosRestantes > 0;
  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const progreso = (segundosRestantes / DURACION_CODIGO) * 100;

  return (
    <main className="mainBody gap-4">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Código de emergencia" compacto />

        <section
          aria-label="Acceso temporal encriptado"
          className="flex flex-col gap-2"
        >
          <span className="flex w-fit items-center gap-1 rounded-full bg-[#E8FAF1] px-2 py-1 text-xs font-semibold text-[#0B4C2B]">
            <LuLockKeyhole aria-hidden="true" className="size-3.5" />
            Acceso Temporal Encriptado
          </span>
          <p className="text-sm leading-5 text-[#435059]">
            Código temporal vinculado a la pulsera física de {nombreAdulto}.
          </p>
        </section>

        <section
          aria-labelledby="codigo-acceso-medico"
          className="rounded-xl bg-[#101B25] p-4 text-white shadow-lg"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id="codigo-acceso-medico"
              className="flex items-center gap-2 text-sm font-bold leading-5"
            >
              <LuFileKey2 aria-hidden="true" className="size-5" />
              Código de acceso médico
            </h2>
            {vigente ? (
              <span className="flex items-center gap-1 rounded-full bg-[#E8FAF1] px-2 py-1 text-xs font-bold text-[#0B4C2B]">
                <span className="size-1.5 rounded-full bg-[#0B6D3C]" /> Activo
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-[#E9EEF2] px-2 py-1 text-xs font-bold text-[#435059]">
                <span className="size-1.5 rounded-full bg-[#435059]" /> Inactivo
              </span>
            )}
          </div>

          <p className="mt-5 text-center text-sm font-semibold leading-5">
            Se debe scanear el QR de la pulsera e ingresá este código:
          </p>
          <p className="mt-5 rounded-lg bg-[#E7EDFB] px-4 py-5 text-center text-3xl font-bold tracking-widest text-[#143C94]">
            {cargando ? "…" : vigente ? codigoConGuion(qr.codigo) : "— — —"}
          </p>
          {!cargando && !qr && (
            <p className="mt-3 text-center text-xs leading-4 text-[#E7EDFB]">
              Por ahora el código solo se ve en la app de {primerNombre}.
            </p>
          )}

          <div className="mt-5 rounded-lg border border-[#C8D8E9] p-3">
            <div className="flex items-center justify-between gap-2 text-xs font-semibold">
              <p className="flex items-center gap-1.5">
                <LuTimer aria-hidden="true" className="size-4" /> Válido por{" "}
                {minutos} minutos más
              </p>
              <p className="tabular-nums">
                {minutos} min {String(segundos).padStart(2, "0")} s
              </p>
            </div>
            <div
              role="progressbar"
              aria-label="Tiempo restante del código"
              aria-valuemin={0}
              aria-valuemax={DURACION_CODIGO}
              aria-valuenow={segundosRestantes}
              className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-linear-to-r from-red-500 to-green-500"
            >
              <div
                className="absolute inset-y-0 right-0 bg-gray-700 transition-[width] duration-1000"
                style={{ width: `${100 - progreso}%` }}
              />
            </div>
            <p className="mt-3 text-center text-xs leading-4 text-[#E7EDFB]">
              Se renueva automáticamente cada 30 minutos por seguridad.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={copiar}
              disabled={!vigente}
              className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E7EDFB] px-3 text-sm font-semibold text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuClipboard aria-hidden="true" className="size-4" /> Copiar
            </button>
            <button
              type="button"
              onClick={compartir}
              disabled={!vigente}
              className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E7EDFB] px-3 text-sm font-semibold text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuShare2 aria-hidden="true" className="size-4" /> Compartir
            </button>
          </div>
        </section>

        <section
          aria-labelledby="uso-codigo"
          className="rounded-xl bg-white p-4 shadow-xs"
        >
          <h2
            id="uso-codigo"
            className="flex items-center gap-2 text-base font-bold leading-5"
          >
            <LuCircleHelp
              aria-hidden="true"
              className="size-5 text-[#1550E0]"
            />
            ¿Cómo utiliza este código el médico o la ambulancia?
          </h2>
          <ol className="mt-4 flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1550E0] text-xs font-bold text-white">
                1
              </span>
              <div>
                <h3 className="text-sm font-semibold">Escaneo de pulsera</h3>
                <p className="text-xs leading-4 text-[#435059]">
                  Escanea el código QR de la pulsera de {primerNombre}.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1550E0] text-xs font-bold text-white">
                2
              </span>
              <div>
                <h3 className="text-sm font-semibold">Ingreso del código</h3>
                <p className="text-xs leading-4 text-[#435059]">
                  Ingresá el código de 6 dígitos en la pantalla de validación.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1550E0] text-xs font-bold text-white">
                3
              </span>
              <div>
                <h3 className="text-sm font-semibold">
                  Ficha médica desbloqueada
                </h3>
                <p className="text-xs leading-4 text-[#435059]">
                  Accede durante 30 minutos a alergias críticas, medicación y
                  contactos sin necesidad de tener la app.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section
          aria-labelledby="registro-auditoria"
          className="rounded-xl bg-white p-4 shadow-xs"
        >
          <h2
            id="registro-auditoria"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <LuHistory aria-hidden="true" className="size-4 text-[#435059]" />{" "}
            Registro de auditoría
          </h2>
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#E9EEF2] p-3">
            <LuShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[#0B6D3C]"
            />
            <div>
              <h3 className="text-xs font-semibold">
                Último acceso registrado
              </h3>
              {/* PENDIENTE BACK: el back no registra los accesos al código, queda el texto del diseño */}
              <p className="text-xs leading-4 text-[#435059]">
                12 de Oct a las 17:40 hs por Personal de ambulancia SAME.
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col items-center gap-2 pb-4">
          {mensaje && <p role="status" className="w-full rounded-xl bg-white p-3 text-center text-sm font-semibold text-[#435059]">{mensaje}</p>}
          <button
            type="button"
            onClick={generarNuevo}
            disabled={!adulto}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 text-base font-bold text-white shadow-sm hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
          >
            <LuRefreshCw aria-hidden="true" className="size-5" /> Generar nuevo
            código ahora
          </button>
          <p className="max-w-70/100 text-center text-xs leading-4 text-[#435059]">
            La renovación manual invalida inmediatamente el código anterior.
          </p>
        </div>
      </div>
    </main>
  );
}