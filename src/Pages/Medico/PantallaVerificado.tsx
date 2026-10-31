import { LuArrowRight, LuCheck, LuLockKeyhole, LuShield, LuShieldCheck, LuTimer, LuUserRound, LuWatch } from "react-icons/lu";

interface Props {
  nombre: string;
  edad: number | null;
  // lo que queda de los 30 minutos, ya armado ("29 min 59 seg")
  tiempoRestante: string;
  // segundos que faltan para pasar sola a la ficha (3, 2, 1)
  segundosRedireccion: number;
  onVerFicha: () => void;
}

// pantalla "Código verificado con éxito": se ve 3 segundos y después pasa sola a la ficha
export default function PantallaVerificado({ nombre, edad, tiempoRestante, segundosRedireccion, onVerFicha }: Props) {
  const progreso = ((3 - segundosRedireccion) / 3) * 100;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 text-[#16222C]">
      <div className="flex items-center justify-between gap-3">
        <h1 className="flex items-center gap-3 text-lg font-semibold">
          <LuLockKeyhole aria-hidden="true" className="size-9 rounded-full bg-[#E7EDFB] p-2" />
          Ficha Médica
        </h1>
        <span className="flex items-center gap-1 rounded-full border border-[#BAEDD3] bg-[#E8FAF1] px-3 py-1 text-sm font-semibold text-[#0B4C2B]">
          <LuShieldCheck aria-hidden="true" className="size-4" />
          Segura
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-[#E8FAF1] ring-8 ring-white/40">
          <LuCheck aria-hidden="true" className="size-12 rounded-full bg-[#0B6D3C] p-2.5 text-white" />
        </span>
        <p className="rounded-full border border-[#BAEDD3] bg-[#E8FAF1] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0B4C2B]">
          Autenticación correcta
        </p>
        <h2 className="text-2xl font-bold" role="status">Código verificado con éxito</h2>
        <p className="text-sm text-[#435059]">Acceso médico temporal habilitado por 30 minutos.</p>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-xs" aria-labelledby="credencial">
        <div className="flex items-center justify-between border-b border-[#D7DFE6] pb-3">
          <h3 id="credencial" className="text-xs font-bold uppercase tracking-wide text-[#435059]">Credencial autorizada</h3>
          <span className="flex items-center gap-1 rounded border border-[#BAEDD3] bg-[#E8FAF1] px-2 py-0.5 text-xs font-semibold text-[#0B4C2B]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-[#0B6D3C]" />
            Activo
          </span>
        </div>
        <dl className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <LuUserRound aria-hidden="true" className="size-11 shrink-0 rounded-xl border border-[#B7C8F0] bg-[#E7EDFB] p-2.5 text-[#1550E0]" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-[#435059]">Paciente identificado</dt>
              <dd className="text-lg font-bold">
                {nombre} {edad !== null && <span className="text-base font-normal">({edad} años)</span>}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LuWatch aria-hidden="true" className="size-11 shrink-0 rounded-xl border border-[#B7C8F0] bg-[#E7EDFB] p-2.5 text-[#1550E0]" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-[#435059]">Dispositivo de origen</dt>
              {/* PENDIENTE BACK: el back no manda el id de la pulsera; queda el del diseño */}
              <dd className="flex items-center gap-2 text-lg font-bold">
                Pulsera <span className="rounded bg-[#E7EDFB] px-1.5 font-mono text-sm">#RG-8830</span>
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LuTimer aria-hidden="true" className="size-11 shrink-0 rounded-xl border border-[#BAEDD3] bg-[#E8FAF1] p-2.5 text-[#1550E0]" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-[#435059]">Tiempo de consulta disponible</dt>
              <dd className="text-lg font-bold text-[#0B6D3C]">{tiempoRestante}</dd>
            </div>
          </div>
        </dl>
        <p className="flex items-start gap-2 rounded-xl border border-[#B7C8F0] bg-[#E7EDFB] p-4 text-sm font-semibold leading-6">
          <LuShield aria-hidden="true" className="mt-1 size-4 shrink-0 fill-[#1550E0] text-[#1550E0]" />
          Aviso clínico: Uso estrictamente confidencial para asistencia de salud y auxilio de guardia.
        </p>
      </section>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-[#435059]">
            <span aria-hidden="true" className="size-2 rounded-full bg-[#0B6D3C]" />
            Redirección automática
          </span>
          <span className="font-semibold">{segundosRedireccion}s</span>
        </div>
        <div aria-hidden="true" className="h-2 w-full overflow-hidden rounded-full bg-white/70">
          <div className="h-full rounded-full bg-[#1550E0] transition-[width] duration-1000" style={{ width: `${progreso}%` }} />
        </div>
      </div>

      <button
        type="button"
        onClick={onVerFicha}
        className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white shadow-sm hover:bg-[#1245BF] active:bg-[#0F389D]"
      >
        Ver perfil y ficha de emergencia ahora
        <LuArrowRight aria-hidden="true" className="size-5" />
      </button>

      <p className="flex items-center justify-center gap-2 text-sm text-[#435059]">
        <LuShieldCheck aria-hidden="true" className="size-4 text-[#0B6D3C]" />
        Acceso trazable y auditado por seguridad médica
      </p>
    </div>
  );
}
