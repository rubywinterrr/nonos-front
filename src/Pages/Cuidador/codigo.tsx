import VueltaAtras from "../../components/vueltaAtras";
import Header from "../../components/Header";
import {
  LuCopy,
  LuHistory,
  LuLock,
  LuRefreshCw,
  LuShare2,
  LuShieldCheck,
  LuTimer,
  LuCircleHelp,
} from "react-icons/lu";
import { MdOutlineMedicalInformation } from "react-icons/md";

// pasos que explican cómo usa el código el médico o la ambulancia
const pasos = [
  { titulo: "Escaneo de pulsera", texto: "Escanea el código QR de la pulsera de José." },
  { titulo: "Ingreso del código", texto: "Ingresá el código de 5 dígitos en la pantalla de validación." },
  {
    titulo: "Ficha médica desbloqueada",
    texto: "Accede durante 30 minutos a alergias críticas, medicación y contactos sin necesidad de tener la app.",
  },
];

// pantalla del familiar/cuidador: código temporal que desbloquea la ficha médica desde el QR de la pulsera
export default function CodigoEmergencia() {
  return (
    <>
      <main className="mainBody text-[#0E1D28]">
        <Header />
        <VueltaAtras titulo="Código de emergencia" compacto />

        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          <div className="flex flex-col items-start gap-2">
            <span className="flex items-center gap-1 rounded-full border border-[#006A61]/30 bg-[#84F6E6]/30 px-3 py-1 text-xs font-semibold text-[#006A61]">
              <LuLock aria-hidden="true" className="size-3.5" />
              Acceso Temporal Encriptado
            </span>
            <p className="text-sm text-[#424656]">Código temporal vinculado a la pulsera física de Roberto Gómez.</p>
          </div>

          {/* HARDCODEADO: código, tiempo y estado; después vienen de qrService */}
          <section className="flex flex-col gap-4 rounded-2xl bg-[#111A22] p-4 text-white" aria-labelledby="codigo-acceso">
            <div className="flex items-center justify-between gap-2">
              <h2 id="codigo-acceso" className="flex items-center gap-2 text-lg font-bold">
                <MdOutlineMedicalInformation aria-hidden="true" className="size-6 shrink-0" />
                Código de acceso médico
              </h2>
              <span className="flex items-center gap-1 rounded-full bg-[#84F6E6] px-2 py-0.5 text-xs font-bold text-[#006A61]">
                <span aria-hidden="true" className="size-2 rounded-full bg-[#006A61]" />
                Activo
              </span>
            </div>

            <p className="text-center text-lg leading-snug">
              Se debe scanear el QR de la pulsera e ingresá este código:
            </p>

            <p className="rounded-xl bg-[#EBF5FF] py-5 text-center text-3xl font-bold tracking-[0.3em] text-[#0049CC] sm:text-4xl">
              987-212
            </p>

            <div className="flex flex-col gap-2 rounded-xl border border-white/30 p-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <p className="flex items-center gap-1">
                  <LuTimer aria-hidden="true" className="size-4 shrink-0" />
                  Válido por 18 minutos más
                </p>
                <p className="font-bold">18 min 00 s</p>
              </div>
              <div aria-hidden="true" className="h-1.5 w-full rounded-full bg-linear-to-r from-[#006A61] via-[#E8590C] to-[#1550E0]" />
              <p className="text-center text-xs text-white/80">
                Se renueva automáticamente cada 30 minutos por seguridad.
              </p>
            </div>

            {/* HARDCODEADO: todavía no copian ni comparten */}
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#EBF5FF] text-sm font-semibold text-[#0049CC] hover:bg-[#DCEBFA] active:bg-[#CBDEF2]">
                <LuCopy aria-hidden="true" className="size-4" />
                Copiar
              </button>
              <button type="button" className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#EBF5FF] text-sm font-semibold text-[#0049CC] hover:bg-[#DCEBFA] active:bg-[#CBDEF2]">
                <LuShare2 aria-hidden="true" className="size-4" />
                Compartir
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl bg-white/70 p-4" aria-labelledby="como-se-usa">
            <h2 id="como-se-usa" className="flex items-start gap-2 text-lg font-bold leading-snug">
              <LuCircleHelp aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#1550E0]" />
              ¿Cómo utiliza este código el médico o la ambulancia?
            </h2>
            <ol className="flex flex-col gap-4">
              {pasos.map((paso, indice) => (
                <li key={paso.titulo} className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1550E0] text-xs font-bold text-white">
                    {indice + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{paso.titulo}</p>
                    <p className="text-xs leading-relaxed text-[#424656]">{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* HARDCODEADO: último acceso al código */}
          <section className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="auditoria">
            <h2 id="auditoria" className="flex items-center gap-2 text-sm font-semibold">
              <LuHistory aria-hidden="true" className="size-4 shrink-0" />
              Registro de auditoría
            </h2>
            <div className="flex items-start gap-2 rounded-xl bg-[#EBF5FF] p-3">
              <LuShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#1550E0]" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold">Último acceso registrado</p>
                <p className="text-[#424656]">12 de Octubre a las 17:40 hs por Personal de ambulancia SAME.</p>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-2">
            {/* HARDCODEADO: todavía no genera nada; después llama a qrService */}
            <button
              type="button"
              className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white shadow-md hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            >
              <LuRefreshCw aria-hidden="true" className="size-5 shrink-0" />
              Generar nuevo código ahora
            </button>
            <p className="text-center text-xs text-[#424656]">
              La renovación manual invalida inmediatamente el código anterior.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
