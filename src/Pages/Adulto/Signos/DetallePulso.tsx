import { useEffect, useState } from "react";
import { LuCircleHelp, LuHeart, LuTriangleAlert } from "react-icons/lu";
import { useAuth } from "../../../hooks/useAuth";
import { medicionesService, type Medicion } from "../../../services/medicionesService";
import { idDelAdultoQueSeMira } from "../../../utils/adultoQueSeMira";
import { diaYHora } from "../../../utils/formatoSignos";
import Header from "../../../components/Header";
import VueltaAtras from "../../../components/vueltaAtras";

const DIA_MS = 24 * 60 * 60 * 1000;
const PULSO_MINIMO = 60;
const PULSO_MAXIMO = 100;

export default function DetallePulsoAdulto() {
  const { usuario } = useAuth();
  const [pulsos, setPulsos] = useState<Medicion[]>([]);
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
        const desde = new Date(Date.now() - DIA_MS).toISOString();
        const mediciones = await medicionesService.getMediciones(adultoId, "FRECUENCIA_CARDIACA", desde);
        if (!activo) return;
        setPulsos(mediciones);
        setSinAdulto(false);
      } catch (err) {
        console.error(err);
        if (activo) setError("No se pudieron cargar los datos del pulso.");
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

  const ultimo = pulsos[0] ?? null;
  let minimo: Medicion | null = null;
  let maximo: Medicion | null = null;
  for (const pulso of pulsos) {
    if (!minimo || pulso.valor < minimo.valor) minimo = pulso;
    if (!maximo || pulso.valor > maximo.valor) maximo = pulso;
  }
  const normal = ultimo !== null && ultimo.valor >= PULSO_MINIMO && ultimo.valor <= PULSO_MAXIMO;

  return (
    <main className="mainBody text-[#16222C]">
      <Header />
      <VueltaAtras titulo="Mi corazón" seccion="Mi salud" compacto />

      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 pb-32">
        {cargando && <p role="status" className="text-center text-[#435059]">Cargando datos del pulso…</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
        {sinAdulto && <p className="rounded-2xl bg-white p-5 text-base">Todavía no estás vinculado a ningún adulto mayor. Cuando aceptes una invitación, vas a ver sus datos acá.</p>}

        {!cargando && !sinAdulto && (
          <>
            <section aria-label="Valor actual del pulso" className="flex flex-col gap-3.5 rounded-[28px] bg-white p-5 shadow-md">
              <div className="flex items-end gap-2.5 whitespace-nowrap">
                <p className="text-6xl font-bold leading-none">{ultimo ? Math.round(ultimo.valor) : "—"}</p>
                <p className="pb-1 text-xl text-[#435059]">lpm</p>
              </div>
              <span className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-lg font-bold ${normal ? "bg-[#E8FAF1] text-[#0B4C2B]" : ultimo ? "bg-[#FFDBD2] text-[#AD2B00]" : "bg-[#E9EEF2] text-[#435059]"}`}>
                {normal ? <LuHeart aria-hidden="true" className="size-4" /> : ultimo ? <LuTriangleAlert aria-hidden="true" className="size-4" /> : null}
                {ultimo ? (normal ? "Normal" : "Fuera de lo habitual") : "Sin datos recientes"}
              </span>
              <p className="text-xl leading-7 text-[#435059]">{ultimo && !normal ? "Lo habitual: 60 a 100 lpm" : "Lo habitual: 60 a 100 lpm"}</p>
            </section>

            <section aria-label="Datos del pulso de hoy" className="flex flex-col gap-3.5 rounded-[28px] bg-white p-5 shadow-md">
              <div className="flex flex-col gap-0.5 py-0.5">
                <p className="text-xl leading-[26px] text-[#435059]">Lo más bajo hoy</p>
                <p className="text-2xl font-bold leading-[31px]">{minimo ? `${Math.round(minimo.valor)} lpm` : "Sin mediciones"}</p>
                {minimo && <p className="text-sm text-[#435059]">{diaYHora(minimo.timestamp)}</p>}
              </div>
              <div aria-hidden="true" className="h-0.5 w-full bg-[#D7DFE6]" />
              <div className="flex flex-col gap-0.5 py-0.5">
                <p className="text-xl leading-[26px] text-[#435059]">Lo más alto hoy</p>
                <p className="text-2xl font-bold leading-[31px]">{maximo ? `${Math.round(maximo.valor)} lpm` : "Sin mediciones"}</p>
                {maximo && <p className="text-sm text-[#435059]">{diaYHora(maximo.timestamp)}</p>}
              </div>
            </section>

            <section aria-label="Información sobre el pulso" className="flex items-center gap-3.5 rounded-[28px] bg-[#E7EDFB] p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-3xl bg-white text-[#144BD3]">
                <LuCircleHelp aria-hidden="true" className="size-6" />
              </span>
              <p className="text-xl font-semibold leading-tight text-[#16222C]">
                {ultimo
                  ? normal
                    ? "Tu corazón late a un ritmo tranquilo. No hace falta hacer nada."
                    : "Tu pulso está fuera de lo habitual. Si se repite, conversalo con tu médico."
                  : "Cuando la pulsera registre tu pulso, vas a poder consultarlo acá."}
              </p>
            </section>
          </>
        )}
        <p className="text-center text-xs text-[#435059]">Información de acompañamiento. No reemplaza una consulta médica.</p>
      </div>
    </main>
  );
}
