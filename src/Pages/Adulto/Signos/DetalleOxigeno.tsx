import { useEffect, useState } from "react";
import { LuCircleHelp, LuDroplet, LuTriangleAlert } from "react-icons/lu";
import { useAuth } from "../../../hooks/useAuth";
import { medicionesService, type Medicion } from "../../../services/medicionesService";
import { idDelAdultoQueSeMira } from "../../../utils/adultoQueSeMira";
import { hora } from "../../../utils/formatoSignos";
import Header from "../../../components/Header";
import VueltaAtras from "../../../components/vueltaAtras";

const DIA_MS = 24 * 60 * 60 * 1000;
const DIAS_HISTORIAL = 7;
const OXIGENO_MINIMO = 95;

export default function DetalleOxigenoAdulto() {
  const { usuario } = useAuth();
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
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
        const nuevas = await medicionesService.getMediciones(adultoId, "SPO2", desde);
        if (!activo) return;
        setMediciones(nuevas);
        setSinAdulto(false);
      } catch (err) {
        console.error(err);
        if (activo) setError("No se pudieron cargar los datos de oxígeno.");
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

  const ultimo = mediciones[0] ?? null;
  const ayer = mediciones.find((medicion) => {
    const fecha = new Date(medicion.timestamp);
    const hoy = new Date();
    const fechaAyer = new Date(hoy);
    fechaAyer.setDate(fechaAyer.getDate() - 1);
    return fecha.toDateString() === fechaAyer.toDateString();
  }) ?? null;
  const normal = ultimo !== null && ultimo.valor >= OXIGENO_MINIMO;

  return (
    <main className="mainBody text-[#16222C]">
      <Header />
      <VueltaAtras titulo="Mi oxígeno" seccion="Mi salud" compacto />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 pb-32">
        {cargando && <p role="status" className="text-center text-[#435059]">Cargando datos de oxígeno…</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
        {sinAdulto && <p className="rounded-2xl bg-white p-5 text-base">Todavía no estás vinculado a ningún adulto mayor. Cuando aceptes una invitación, vas a ver sus datos acá.</p>}
        {!cargando && !sinAdulto && (
          <>
            <section aria-label="Valor actual del oxígeno" className="flex flex-col gap-3.5 rounded-[28px] bg-white p-5 shadow-md">
              <div className="flex items-end gap-2.5 whitespace-nowrap">
                <p className="text-6xl font-bold leading-none">{ultimo ? Math.round(ultimo.valor) : "—"}</p>
                <p className="pb-1 text-xl text-[#435059]">%</p>
              </div>
              <span className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-lg font-bold ${normal ? "bg-[#E8FAF1] text-[#0B4C2B]" : ultimo ? "bg-[#FFDBD2] text-[#AD2B00]" : "bg-[#E9EEF2] text-[#435059]"}`}>
                {normal ? <LuDroplet aria-hidden="true" className="size-4" /> : ultimo ? <LuTriangleAlert aria-hidden="true" className="size-4" /> : null}
                {ultimo ? (normal ? "Normal" : "Bajo") : "Sin datos recientes"}
              </span>
              <p className="text-xl leading-7 text-[#435059]">Lo habitual: 95 % o más</p>
            </section>
            <section aria-label="Mediciones recientes de oxígeno" className="flex flex-col gap-3.5 rounded-[28px] bg-white p-5 shadow-md">
              <div className="flex flex-col gap-0.5 py-0.5">
                <p className="text-xl leading-[26px] text-[#435059]">Última medición</p>
                <p className="text-2xl font-bold leading-[31px]">{ultimo ? `Hoy, ${hora(ultimo.timestamp)} hs` : "Sin mediciones"}</p>
              </div>
              <div aria-hidden="true" className="h-0.5 w-full bg-[#D7DFE6]" />
              <div className="flex flex-col gap-0.5 py-0.5">
                <p className="text-xl leading-[26px] text-[#435059]">Ayer</p>
                <p className="text-2xl font-bold leading-[31px]">{ayer ? `${Math.round(ayer.valor)} % · ${hora(ayer.timestamp)} hs` : "Sin mediciones"}</p>
              </div>
              <div aria-hidden="true" className="h-0.5 w-full bg-[#D7DFE6]" />
            </section>
            <section aria-label="Información sobre el oxígeno" className="flex items-center gap-3.5 rounded-[28px] bg-[#E7EDFB] p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-3xl bg-white text-[#144BD3]"><LuCircleHelp aria-hidden="true" className="size-6" /></span>
              <p className="text-xl font-semibold leading-tight text-[#16222C]">
                {ultimo ? normal ? "Estás respirando bien. No hace falta hacer nada." : "El oxígeno está por debajo de lo habitual. Si se repite, consultá con tu médico." : "La pulsera mide el oxígeno durante la noche. Va a aparecer después de usarla."}
              </p>
            </section>
          </>
        )}
        <p className="text-center text-xs text-[#435059]">Información de acompañamiento. No reemplaza una consulta médica.</p>
      </div>
    </main>
  );
}
