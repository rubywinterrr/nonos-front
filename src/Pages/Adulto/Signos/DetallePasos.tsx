import { useEffect, useState } from "react";
import { LuCircleHelp } from "react-icons/lu";
import { useAuth } from "../../../hooks/useAuth";
import { medicionesService, type Medicion } from "../../../services/medicionesService";
import { idDelAdultoQueSeMira } from "../../../utils/adultoQueSeMira";
import VueltaAtras from "../../../components/vueltaAtras";

const META_PASOS = 3000;

export default function DetallePasosAdulto() {
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
        const inicio = new Date();
        inicio.setHours(0, 0, 0, 0);
        const nuevas = await medicionesService.getMediciones(adultoId, "PASOS", inicio.toISOString());
        if (!activo) return;
        setMediciones(nuevas);
        setSinAdulto(false);
      } catch (err) {
        console.error(err);
        if (activo) setError("No se pudieron cargar los pasos de hoy.");
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

  const pasos = mediciones.reduce((total, medicion) => total + medicion.valor, 0);
  const progreso = Math.min(100, Math.max(0, (pasos / META_PASOS) * 100));
  const restantes = Math.max(0, META_PASOS - pasos);

  return (
    <main id="contenido-principal" tabIndex={-1} className="mainBody text-[#16222C]">
      <VueltaAtras titulo="Mis pasos" seccion="Mi salud" compacto />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 pb-32">
        {cargando && <p role="status" className="text-center text-[#435059]">Cargando tus pasos…</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
        {sinAdulto && <p className="rounded-2xl bg-white p-5 text-base">Todavía no estás vinculado a ningún adulto mayor. Cuando aceptes una invitación, vas a ver sus datos acá.</p>}
        {!cargando && !sinAdulto && (
          <>
            <section aria-label="Pasos de hoy" className="flex flex-col gap-3.5 rounded-[28px] bg-white p-5 shadow-md">
              <div className="flex flex-wrap items-end gap-2.5">
                <p className="truncate text-6xl font-bold leading-none">{Math.round(pasos).toLocaleString("es-AR")}</p>
                <p className="pb-1 text-xl text-[#435059]">de 3.000 pasos</p>
              </div>
              <div role="progressbar" aria-label="Progreso de la meta diaria" aria-valuemin={0} aria-valuemax={META_PASOS} aria-valuenow={Math.min(pasos, META_PASOS)} aria-valuetext={`${pasos.toLocaleString("es-AR")} de ${META_PASOS.toLocaleString("es-AR")} pasos`} className="h-4 w-full overflow-hidden rounded-full bg-[#E7EDFB]">
                <div aria-hidden="true" className="h-full rounded-full bg-[#144BD3] transition-[width] duration-500" style={{ width: `${progreso}%` }} />
              </div>
            </section>
            {/* PENDIENTE BACK: no hay dato de paseos ni de caídas; el diseño mostraba "Paseo de la mañana · 30 minutos" y "Caídas hoy · Ninguna" */}
            <section aria-label="Información sobre tus pasos" className="flex items-center gap-3.5 rounded-[28px] bg-[#E7EDFB] p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-3xl bg-white text-[#144BD3]"><LuCircleHelp aria-hidden="true" className="size-6" /></span>
              <p className="text-xl font-semibold leading-tight text-[#16222C]">
                {pasos >= META_PASOS ? "¡Llegaste a tu meta de pasos de hoy!" : pasos > 0 ? `Un paseo corto más y te faltan ${restantes.toLocaleString("es-AR")} pasos para llegar a tu meta.` : "Empezá a moverte y tus pasos de hoy van a aparecer acá."}
              </p>
            </section>
          </>
        )}
        <p className="text-center text-xs text-[#435059]">Información de acompañamiento. No reemplaza una consulta médica.</p>
      </div>
    </main>
  );
}
