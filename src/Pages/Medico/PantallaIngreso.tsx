import CajasCodigo from "../../components/CajasCodigo";
import {
  LuBriefcaseMedical,
  LuCheck,
  LuCircleAlert,
  LuCircleHelp,
  LuClock3,
  LuInfo,
  LuShieldCheck,
} from "react-icons/lu";

interface Props {
  codigo: string;
  onCambiarCodigo: (codigo: string) => void;
  onValidar: () => void;
  // true después de un código equivocado: muestra el contacto, el cartel rojo y las cajas en rojo
  incorrecto: boolean;
  codigoInvalido: boolean;
  validando: boolean;
  // mensaje para otros problemas (QR apagado, demasiados intentos, sin conexión)
  error: string | null;
}

// pantalla donde el médico escribe el código de 6 dígitos (y su versión "Código no válido")
export default function PantallaIngreso({ codigo, onCambiarCodigo, onValidar, incorrecto, codigoInvalido, validando, error }: Props) {
  const completo = codigo.length === 6;

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

          {/* PENDIENTE BACK: sin el código correcto el back no devuelve ningún contacto;
              el diseño mostraba la tarjeta de "Sofía Gómez · Familiar · +54 11 4455-6677" con Llamar y Mensaje */}

          <section id="error-codigo-medico" role="alert" className="rounded-xl border-2 border-[#C92A2A] bg-[#FBE9E9] p-4">
            <h1 tabIndex={-1} className="flex items-center gap-2 text-lg font-bold">
              <LuCircleAlert aria-hidden="true" className="size-7 shrink-0 rounded-full bg-[#C92A2A] p-1 text-white" />
              Código no válido
            </h1>
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
          if (completo && !validando) onValidar();
        }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4">
          <label htmlFor="codigo-medico" className="mb-4 w-full text-center text-base font-bold">Código de 6 dígitos</label>
          <CajasCodigo codigo={codigo} onChange={onCambiarCodigo} conError={codigoInvalido} descripcion={codigoInvalido ? "error-codigo-medico" : !completo && !incorrecto ? "ayuda-codigo-medico" : undefined} />
          {!completo && !incorrecto && <p id="ayuda-codigo-medico" className="text-center text-xs text-[#435059]">Completá los 6 números</p>}
        </div>

        <p className="flex items-center gap-3 rounded-xl bg-[#E7EDFB]/80 p-3 text-sm leading-5">
          <LuClock3 aria-hidden="true" className="size-8 shrink-0 rounded-lg bg-white p-1.5 text-[#0B6D3C]" />
          <span>
            Los códigos tienen una vigencia de <span className="font-semibold text-[#1550E0]">30 minutos</span> por
            seguridad y estricta confidencialidad clínica.
          </span>
        </p>

        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

        <p role="status" className="sr-only">{validando ? "Validando código…" : ""}</p>
        <button
          type="submit"
          disabled={!completo || validando}
          className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D] disabled:cursor-not-allowed disabled:bg-[#E7EDFB] disabled:text-[#435059]"
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
