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

const DURACION_CODIGO = 30 * 60;
const TIEMPO_INICIAL = 30 * 60;

export default function CodigoEmergencia() {
  const [segundosRestantes, setSegundosRestantes] = useState(TIEMPO_INICIAL);

  useEffect(() => {
    const temporizador = window.setInterval(() => {
      setSegundosRestantes((segundos) =>
        segundos > 0 ? segundos - 1 : DURACION_CODIGO,
      );
    }, 1000);

    return () => window.clearInterval(temporizador);
  }, []);

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
            Código temporal vinculado a la pulsera física de Roberto Gómez.
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
            <span className="flex items-center gap-1 rounded-full bg-[#E8FAF1] px-2 py-1 text-xs font-bold text-[#0B4C2B]">
              <span className="size-1.5 rounded-full bg-[#0B6D3C]" /> Activo
            </span>
          </div>

          <p className="mt-5 text-center text-sm font-semibold leading-5">
            Se debe scanear el QR de la pulsera e ingresá este código:
          </p>
          <p className="mt-5 rounded-lg bg-[#E7EDFB] px-4 py-5 text-center text-3xl font-bold tracking-widest text-[#143C94]">
            9 8 7 - 212
          </p>

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
              className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E7EDFB] px-3 text-sm font-semibold text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <LuClipboard aria-hidden="true" className="size-4" /> Copiar
            </button>
            <button
              type="button"
              className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E7EDFB] px-3 text-sm font-semibold text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
                  Escanea el código QR de la pulsera de José.
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
                  Ingresá el código de 5 dígitos en la pantalla de validación.
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
              <p className="text-xs leading-4 text-[#435059]">
                12 de Oct a las 17:40 hs por Personal de ambulancia SAME.
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col items-center gap-2 pb-4">
          <button
            type="button"
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
