import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VueltaAtras from "../../components/vueltaAtras";
import { useAuth } from "../../hooks/useAuth";
import { medicionesService, type Medicion } from "../../services/medicionesService";
import { dispositivosService } from "../../services/dispositivosService";
import { alertasService, type Alerta } from "../../services/alertasService";
import { idDelAdultoQueSeMira } from "../../utils/adultoQueSeMira";
import { horasYMinutos } from "../../utils/formatoSignos";
import minutosDespierto from "../../utils/minutosDespierto";
import {
  LuCheck,
  LuChevronRight,
  LuCircleCheck,
  LuDroplet,
  LuFootprints,
  LuHeart,
  LuMoon,
  LuTriangleAlert,
} from "react-icons/lu";

const HORA_MS = 60 * 60 * 1000;
const DIA_MS = 24 * HORA_MS;
const META_PASOS = 3000;
const RANGO_PULSO_MIN = 60;
const RANGO_PULSO_MAX = 100;
const OXIGENO_MINIMO_HABITUAL = 95;

function porcentajeSeguro(valor: number, maximo: number) {
  if (!Number.isFinite(valor) || maximo <= 0) return 0;
  return Math.max(0, Math.min(100, (valor / maximo) * 100));
}

export default function SignosVitales() {
  const { usuario } = useAuth();
  const [pulsos, setPulsos] = useState<Medicion[]>([]);
  const [oxigenos, setOxigenos] = useState<Medicion[]>([]);
  const [pasos, setPasos] = useState<Medicion[]>([]);
  const [suenos, setSuenos] = useState<Medicion[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sinAdulto, setSinAdulto] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    let activo = true;
    const actual = usuario;

    const sincronizarPulsera = async (usuarioId: string) => {
      if (actual.rol !== "ADULTO_MAYOR") return;
      try {
        const dispositivos = await dispositivosService.getDispositivos(usuarioId);
        const pulsera = dispositivos.find((dispositivo) => dispositivo.tipo === "FITBIT_AIR");
        if (pulsera && !pulsera.requiereReautenticacion) {
          await dispositivosService.sincronizarDispositivo(pulsera.id);
        }
      } catch (err) {
        // La pantalla puede seguir mostrando mediciones que ya estén guardadas.
        console.error("No se pudo sincronizar la pulsera:", err);
      }
    };

    const cargarDatos = async (adultoId: string) => {
      const ahora = Date.now();
      const desde24Horas = new Date(ahora - DIA_MS).toISOString();
      const inicioDelDia = new Date(ahora);
      inicioDelDia.setHours(0, 0, 0, 0);
      const desdeSueno = new Date(ahora - 30 * DIA_MS).toISOString();

      try {
        const [nuevosPulsos, nuevoOxigeno, nuevosPasos, nuevoSueno, nuevasAlertas] = await Promise.all([
          medicionesService.getMediciones(adultoId, "FRECUENCIA_CARDIACA", desde24Horas),
          medicionesService.getMediciones(adultoId, "SPO2", desde24Horas),
          medicionesService.getMediciones(adultoId, "PASOS", inicioDelDia.toISOString()),
          medicionesService.getMediciones(adultoId, "SUENO", desdeSueno),
          alertasService.getAlertas(adultoId),
        ]);
        if (!activo) return;
        setPulsos(nuevosPulsos);
        setOxigenos(nuevoOxigeno);
        setPasos(nuevosPasos);
        setSuenos(nuevoSueno);
        setAlertas(nuevasAlertas);
        setSinAdulto(false);
        setError(null);
      } catch (err) {
        console.error(err);
        if (activo) setError("No se pudieron cargar los datos de la pulsera.");
      } finally {
        if (activo) setCargando(false);
      }
    };

    const sincronizarYCargar = async () => {
      let adultoId: string | null = null;
      try {
        adultoId = await idDelAdultoQueSeMira(actual);
      } catch (err) {
        console.error(err);
      }
      if (!activo) return;
      if (!adultoId) {
        setSinAdulto(true);
        setCargando(false);
        return;
      }

      await sincronizarPulsera(adultoId);
      if (activo) await cargarDatos(adultoId);
    };

    void sincronizarYCargar();
    const intervalo = window.setInterval(() => void sincronizarYCargar(), 60 * 1000);
    return () => {
      activo = false;
      window.clearInterval(intervalo);
    };
  }, [usuario]);

  const ultimoPulso = pulsos[0] ?? null;
  const ultimoOxigeno = oxigenos[0] ?? null;
  const ultimoSueno = suenos[0] ?? null;
  const hayAlertasCriticas = alertas.some((alerta) => (
    alerta.estado === "PENDIENTE" && alerta.categoria === "CRITICO"
  ));
  const pulsoEnRango = ultimoPulso !== null && ultimoPulso.valor >= RANGO_PULSO_MIN && ultimoPulso.valor <= RANGO_PULSO_MAX;
  const oxigenoEnRango = ultimoOxigeno !== null && ultimoOxigeno.valor >= OXIGENO_MINIMO_HABITUAL;
  const totalPasos = pasos.reduce((total, medicion) => total + medicion.valor, 0);
  const pasosRestantes = Math.max(0, META_PASOS - totalPasos);
  const progresoPasos = porcentajeSeguro(totalPasos, META_PASOS);
  const progresoSueno = porcentajeSeguro(ultimoSueno?.valor ?? 0, 8 * 60);
  const minutosDespiertoSueno = minutosDespierto(ultimoSueno);
  const duracionSueno = ultimoSueno
    ? Math.round(ultimoSueno.valor)
    : null;

  return (
    <main id="contenido-principal" tabIndex={-1} className="mainBody">
      <VueltaAtras titulo="Mis signos vitales" compacto seccion="Mi salud" />

      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-32">
        {cargando && <p role="status" className="text-center text-[#435059]">Cargando tus signos vitales…</p>}
        {sinAdulto && (
          <p className="rounded-2xl bg-white p-5 text-base text-[#16222C]">
            Todavía no estás vinculado a ningún adulto mayor. Cuando aceptes una invitación, vas a ver sus signos acá.
          </p>
        )}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

        {!sinAdulto && (
          <>
            <section
              aria-live="polite"
              aria-label="Estado general de salud"
              className="relative isolate flex w-full min-w-0 items-center gap-4 overflow-hidden rounded-2xl p-6"
              style={{
                background: hayAlertasCriticas
                  ? "linear-gradient(163.344deg, #A92323 0%, #741717 71.429%)"
                  : "linear-gradient(163.344deg, #0F663A 0%, #0B4729 71.429%)",
                boxShadow: "0px 5px 18px 0px rgba(23, 33, 43, 0.09)",
              }}
            >
              <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-18 size-42 rounded-full bg-white/10" />
              <span className="relative z-10 flex size-17 shrink-0 items-center justify-center bg-white text-[#006A3A] rounded-lg p-1">
                {hayAlertasCriticas
                  ? <LuTriangleAlert aria-hidden="true" className="size-8 text-[#A92323]" />
                  : <LuCircleCheck aria-hidden="true" className="size-8" />}
              </span>
              <h2 className="relative z-10 min-w-0 flex-1 text-3xl font-bold leading-tight text-white">
                {hayAlertasCriticas ? "Revisar parámetros" : "Todo normal"}
              </h2>
            </section>

            <Link
              to="pulso"
              className="flex w-full min-w-0 cursor-pointer flex-col gap-4 rounded-3xl bg-white p-5 shadow-md transition-colors hover:bg-[#FBFDFC] active:bg-[#EEF8F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-3xl bg-[#E8FAF1] text-[#0B7040]"><LuHeart aria-hidden="true" className="size-6" /></span>
                <span className="min-w-0 flex-1 text-xl font-bold text-[#16222C]">Corazón</span>
                <LuChevronRight aria-hidden="true" className="size-6 shrink-0 text-[#144BD3]" />
              </span>
              <span className="flex min-w-0 flex-wrap items-end gap-2">
                <span className="text-5xl font-bold leading-none text-[#16222C]">{ultimoPulso ? Math.round(ultimoPulso.valor) : "—"}</span>
                <span className="pb-1 text-base text-[#435059]">lpm</span>
              </span>
              <span className="flex items-center gap-1.5 text-base leading-5 text-[#435059]">
                <LuCheck aria-hidden="true" className={`size-5 shrink-0 ${pulsoEnRango ? "text-[#0B7040]" : "text-[#A92323]"}`} />
                {ultimoPulso ? (pulsoEnRango ? "Lo habitual: 60 a 100 lpm" : "Fuera del rango habitual") : "Sin datos recientes"}
              </span>
            </Link>

            <Link
              to="oxigeno"
              className="flex w-full min-w-0 cursor-pointer flex-col gap-4 rounded-3xl bg-white p-5 shadow-md transition-colors hover:bg-[#FBFDFC] active:bg-[#EEF8F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-3xl bg-[#E8FAF1] text-[#0B7040]"><LuDroplet aria-hidden="true" className="size-6" /></span>
                <span className="min-w-0 flex-1 text-xl font-bold text-[#16222C]">Oxígeno</span>
                <LuChevronRight aria-hidden="true" className="size-6 shrink-0 text-[#144BD3]" />
              </span>
              <span className="flex min-w-0 flex-wrap items-end gap-2">
                <span className="text-5xl font-bold leading-none text-[#16222C]">{ultimoOxigeno ? Math.round(ultimoOxigeno.valor) : "—"}</span>
                <span className="pb-1 text-base text-[#435059]">%</span>
              </span>
              <span className="flex items-center gap-1.5 text-base leading-5 text-[#435059]">
                <LuCheck aria-hidden="true" className={`size-5 shrink-0 ${oxigenoEnRango ? "text-[#0B7040]" : "text-[#A92323]"}`} />
                {ultimoOxigeno ? (oxigenoEnRango ? "Lo habitual: 95 % o más" : "Por debajo de lo habitual") : "Sin datos recientes"}
              </span>
            </Link>

            <Link
              to="pasos"
              className="flex w-full min-w-0 cursor-pointer flex-col gap-4 rounded-3xl bg-white p-5 shadow-md transition-colors hover:bg-[#FBFDFC] active:bg-[#EEF8F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-3xl bg-[#E8FAF1] text-[#0B7040]"><LuFootprints aria-hidden="true" className="size-6" /></span>
                <span className="min-w-0 flex-1 text-xl font-bold text-[#16222C]">Pasos de hoy</span>
                <LuChevronRight aria-hidden="true" className="size-6 shrink-0 text-[#144BD3]" />
              </span>
              <span className="flex min-w-0 flex-wrap items-end gap-2">
                <span className="break-all text-5xl font-bold leading-none text-[#16222C]">{Math.round(totalPasos).toLocaleString("es-AR")}</span>
                <span className="pb-1 text-base text-[#435059]">pasos</span>
              </span>
              <span role="progressbar" aria-label="Progreso hacia la meta de pasos" aria-valuemin={0} aria-valuemax={META_PASOS} aria-valuenow={Math.min(totalPasos, META_PASOS)} className="flex h-3.5 w-full overflow-hidden rounded-full bg-[#E7EDFB]">
                <span aria-hidden="true" className="h-full rounded-full bg-[#144BD3] transition-[width] duration-500" style={{ width: `${progresoPasos}%` }} />
              </span>
              <span className="text-base leading-5 text-[#435059]">
                {pasos.length === 0
                  ? "Todavía no hay datos de pasos de hoy."
                  : pasosRestantes > 0
                    ? `Te faltan ${pasosRestantes.toLocaleString("es-AR")} pasos para tu meta.`
                    : "¡Llegaste a tu meta de pasos!"}
              </span>
            </Link>

            <Link
              to="sueno"
              className="flex w-full min-w-0 cursor-pointer flex-col gap-4 rounded-3xl bg-white p-5 shadow-md transition-colors hover:bg-[#FBFDFC] active:bg-[#EEF8F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-3xl bg-[#E8FAF1] text-[#0B7040]"><LuMoon aria-hidden="true" className="size-6" /></span>
                <span className="min-w-0 flex-1 text-xl font-bold text-[#16222C]">Descanso</span>
                <LuChevronRight aria-hidden="true" className="size-6 shrink-0 text-[#144BD3]" />
              </span>
              <span className="flex min-w-0 flex-wrap items-end gap-2">
                <span className="text-5xl font-bold leading-none text-[#16222C]">
                  {duracionSueno !== null
                    ? `${Math.floor(duracionSueno / 60)} h ${String(duracionSueno % 60).padStart(2, "0")}`
                    : "—"}
                </span>
                <span className="pb-1 text-base text-[#435059]">de sueño</span>
              </span>
              <span role="progressbar" aria-label="Progreso hacia ocho horas de descanso" aria-valuemin={0} aria-valuemax={8 * 60} aria-valuenow={Math.min(ultimoSueno?.valor ?? 0, 8 * 60)} className="flex h-3.5 w-full overflow-hidden rounded-full bg-[#E7EDFB]">
                <span aria-hidden="true" className="h-full rounded-full bg-[#144BD3] transition-[width] duration-500" style={{ width: `${progresoSueno}%` }} />
              </span>
              <span className="text-base leading-5 text-[#435059]">
                {/* sin etapas de sueño en metadata no se sabe si se despertó: no se dice nada */}
                {!ultimoSueno && "Todavía no hay registros de sueño."}
                {ultimoSueno && minutosDespiertoSueno === 0 && "Dormiste sin interrupciones."}
                {ultimoSueno && minutosDespiertoSueno !== null && minutosDespiertoSueno > 0 && `Estuviste despierto ${horasYMinutos(minutosDespiertoSueno)} durante la noche.`}
              </span>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
