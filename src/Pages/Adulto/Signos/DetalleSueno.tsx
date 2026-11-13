import { useEffect, useState } from "react";
import { LuCircleHelp } from "react-icons/lu";
import { useAuth } from "../../../hooks/useAuth";
import { medicionesService, type Medicion } from "../../../services/medicionesService";
import { idDelAdultoQueSeMira } from "../../../utils/adultoQueSeMira";
import { hora } from "../../../utils/formatoSignos";
import VueltaAtras from "../../../components/vueltaAtras";

const DIA_MS = 24 * 60 * 60 * 1000;
const DIAS_HISTORIAL = 7;
const META_SUENO = 8 * 60;

export default function DetalleSuenoAdulto() {
  const { usuario } = useAuth();
  const [suenos, setSuenos] = useState<Medicion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sinAdulto, setSinAdulto] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    let activo = true;
    const cargar = async () => {
      setCargando(true);
      setError(null);
      try {
        const adultoId = await idDelAdultoQueSeMira(usuario);
        if (!activo) return;
        if (!adultoId) {
          setSinAdulto(true);
          return;
        }
        const desde = new Date(Date.now() - DIAS_HISTORIAL * DIA_MS).toISOString();
        const nuevas = await medicionesService.getMediciones(adultoId, "SUENO", desde);
        if (!activo) return;
        setSuenos(nuevas);
        setSinAdulto(false);
      } catch (err) {
        console.error(err);
        if (activo) setError("No se pudieron cargar los datos de sueño.");
      } finally {
        if (activo) setCargando(false);
      }
    };
    void cargar();
    const intervalo = window.setInterval(() => void cargar(), 60 * 1000);
    return () => {
      activo = false;
      window.clearInterval(intervalo);
    };
  }, [usuario]);

  const ultima = suenos[0] ?? null;
  const totalMinutos = ultima ? Math.round(ultima.valor) : 0;
  const progreso = Math.min(100, Math.max(0, (totalMinutos / META_SUENO) * 100));
  const horaInicio = ultima ? hora(ultima.timestamp) : null;
  const horaDespertar = ultima ? hora(new Date(new Date(ultima.timestamp).getTime() + ultima.valor * 60_000).toISOString()) : null;

  return (
    <main id="contenido-principal" tabIndex={-1} className="mainBody text-[#16222C]">
      <VueltaAtras titulo="Mi descanso" seccion="Mi salud" compacto />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 pb-32">
        {cargando && <p role="status" className="text-center text-[#435059]">Cargando tus datos de sueño…</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
        {sinAdulto && <p className="rounded-2xl bg-white p-5 text-base">Todavía no estás vinculado a ningún adulto mayor. Cuando aceptes una invitación, vas a ver sus datos acá.</p>}
        {!cargando && !sinAdulto && (
          <>
            <section aria-label="Duración del descanso" className="flex flex-col gap-3.5 rounded-[28px] bg-white p-5 shadow-md">
              <div className="flex flex-wrap items-end gap-2.5">
                <p className="text-6xl font-bold leading-none">{ultima ? `${Math.floor(totalMinutos / 60)} h ${String(totalMinutos % 60).padStart(2, "0")}` : "—"}</p>
                <p className="pb-1 text-xl text-[#435059]">de sueño</p>
              </div>
              <div role="progressbar" aria-label="Progreso hacia ocho horas de descanso" aria-valuemin={0} aria-valuemax={META_SUENO} aria-valuenow={Math.min(totalMinutos, META_SUENO)} aria-valuetext={`${totalMinutos} minutos de una meta de ${META_SUENO} minutos`} className="h-4 w-full overflow-hidden rounded-full bg-[#E7EDFB]">
                <div aria-hidden="true" className="h-full rounded-full bg-[#144BD3] transition-[width] duration-500" style={{ width: `${progreso}%` }} />
              </div>
            </section>
            <section aria-label="Horario de descanso" className="flex flex-col gap-3.5 rounded-[28px] bg-white p-5 shadow-md">
              <div className="flex flex-col gap-0.5 py-0.5">
                <p className="text-xl leading-[26px] text-[#435059]">Te dormiste</p>
                <p className="text-2xl font-bold leading-[31px]">{horaInicio ? `${horaInicio} hs` : "Sin registros"}</p>
              </div>
              <div aria-hidden="true" className="h-0.5 w-full bg-[#D7DFE6]" />
              <div className="flex flex-col gap-0.5 py-0.5">
                <p className="text-xl leading-[26px] text-[#435059]">Te despertaste</p>
                <p className="text-2xl font-bold leading-[31px]">{horaDespertar ? `${horaDespertar} hs` : "Sin registros"}</p>
              </div>
              <div aria-hidden="true" className="h-0.5 w-full bg-[#D7DFE6]" />
            </section>
            <section aria-label="Información sobre tu descanso" className="flex items-center gap-3.5 rounded-[28px] bg-[#E7EDFB] p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-3xl bg-white text-[#144BD3]"><LuCircleHelp aria-hidden="true" className="size-6" /></span>
              <p className="text-xl font-semibold leading-tight text-[#16222C]">
                {ultima ? totalMinutos >= 7 * 60 ? "Dormiste bien y descansaste." : "Dormiste menos de lo recomendado. Intentá descansar un poco más esta noche." : "Cuando la pulsera registre tu descanso, vas a poder consultarlo acá."}
              </p>
            </section>
          </>
        )}
        <p className="text-center text-xs text-[#435059]">Información de acompañamiento. No reemplaza una consulta médica.</p>
      </div>
    </main>
  );
}
