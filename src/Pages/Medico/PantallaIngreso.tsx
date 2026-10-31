import CajasCodigo from "../../components/CajasCodigo";
import {
  LuBriefcaseMedical,
  LuCheck,
  LuCircleAlert,
  LuCircleHelp,
  LuClock3,
  LuInfo,
  LuMessageSquareText,
  LuPhone,
  LuShieldCheck,
} from "react-icons/lu";

interface Props {
  digitos: string[];
  onCambiarDigitos: (digitos: string[]) => void;
  onValidar: () => void;
  // true después de un código equivocado: muestra el contacto, el cartel rojo y las cajas en rojo
  incorrecto: boolean;
  validando: boolean;
  // mensaje para otros problemas (QR apagado, demasiados intentos, sin conexión)
  error: string | null;
}

// pantalla donde el médico escribe el código de 6 dígitos (y su versión "Código no válido")
export default function PantallaIngreso({ digitos, onCambiarDigitos, onValidar, incorrecto, validando, error }: Props) {
  const completo = digitos.every((d) => d !== "");

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 text-[#16222C]">
      {!incorrecto && (
        <>
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border-4 border-white bg-[#1550E0] text-white shadow-sm">
              <LuBriefcaseMedical aria-hidden="true" className="size-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold leading-7">Ficha Médica de Emergencia</h1>
              <p className="text-sm leading-5">Validación de código de pulsera</p>
            </div>
          </div>

          <section className="rounded-xl border-l-4 border-[#1550E0] bg-white p-4 shadow-xs" aria-labelledby="acceso-clinico">
            <h2 id="acceso-clinico" className="flex items-center gap-2 text-base font-bold">
              <LuInfo aria-hidden="true" className="size-6 shrink-0 rounded-full bg-[#E7EDFB] p-1 text-[#1550E0]" />
              Acceso clínico temporal
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#435059]">
              Para acceder de inmediato a antecedentes, alergias críticas y contactos, ingresá el código de 6 dígitos
              provisto por el familiar, acompañante o cuidador en el lugar.
            </p>
          </section>
        </>
      )}

      {incorrecto && (
        <>
          <section className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="codigo-incorrecto">
            <LuCircleHelp aria-hidden="true" className="size-9 shrink-0 rounded-lg bg-[#E7EDFB] p-2 text-[#1550E0]" />
            <div>
              <h2 id="codigo-incorrecto" className="text-base font-bold">¿El código es incorrecto?</h2>
              <p className="mt-1 text-sm leading-6 text-[#435059]">
                Si no contás con el código correcto, podés llamar al familiar para que lo consulte en la app de NONOS.
              </p>
            </div>
          </section>

          {/* PENDIENTE BACK: sin el código correcto el back no devuelve ningún contacto.
              Por decisión del equipo queda el contacto del diseño hasta que haya un endpoint */}
          <article className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#B7C8F0] bg-[#E7EDFB] text-lg font-bold text-[#0D328B]">
                SG
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold">Sofía Gómez</h3>
                  <span className="rounded bg-[#BAEDD3] px-2 py-0.5 text-sm font-semibold">Principal</span>
                </div>
                <p className="text-sm font-semibold text-[#435059]">Hija</p>
                <p className="mt-1 text-base font-semibold">+54 11 4455-6677</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:+541144556677"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1550E0] font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D]"
              >
                <LuPhone aria-hidden="true" className="size-5" />
                Llamar
              </a>
              <a
                href="sms:+541144556677"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#B7C8F0] bg-[#E7EDFB] font-semibold text-[#16222C] hover:bg-[#D3E0F8] active:bg-[#B7C8F0]"
              >
                <LuMessageSquareText aria-hidden="true" className="size-5 text-[#1550E0]" />
                Mensaje
              </a>
            </div>
          </article>

          <section role="alert" className="rounded-xl border-2 border-[#C92A2A] bg-[#FBE9E9] p-4">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <LuCircleAlert aria-hidden="true" className="size-7 shrink-0 rounded-full bg-[#C92A2A] p-1 text-white" />
              Código no válido
            </h2>
            <p className="mt-3 text-sm leading-6">
              El código ingresado no coincide con el código registrado para este paciente. Verificá los 6 dígitos en la
              pantalla del dispositivo y reingresalo.
            </p>
          </section>
        </>
      )}

      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          if (completo) onValidar();
        }}
        className="flex flex-col gap-6"
      >
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 w-full text-center text-base font-bold">Código de 6 dígitos</legend>
          <CajasCodigo digitos={digitos} onChange={onCambiarDigitos} conError={incorrecto} />
          {!completo && !incorrecto && <p className="text-center text-xs text-[#435059]">Completá los 6 números</p>}
        </fieldset>

        <p className="flex items-center gap-3 rounded-xl bg-[#E7EDFB]/80 p-3 text-sm leading-5">
          <LuClock3 aria-hidden="true" className="size-8 shrink-0 rounded-lg bg-white p-1.5 text-[#0B6D3C]" />
          <span>
            Los códigos tienen una vigencia de <span className="font-semibold text-[#1550E0]">30 minutos</span> por
            seguridad y estricta confidencialidad clínica.
          </span>
        </p>

        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

        <button
          type="submit"
          disabled={!completo || validando}
          className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LuCheck aria-hidden="true" className="size-5" />
          {validando ? "Validando…" : "Validar código y ver ficha médica"}
        </button>
      </form>

      <p className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm leading-6 shadow-xs">
        <LuShieldCheck aria-hidden="true" className="size-9 shrink-0 rounded-lg bg-[#E7EDFB] p-2 text-[#1550E0]" />
        <span>
          <span className="font-semibold">Acceso auditado y encriptado</span> conforme a normativa de protección de
          datos de salud.
        </span>
      </p>
    </div>
  );
}
