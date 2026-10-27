import { LuHeartPulse, LuMoon, LuShieldCheck, LuSmile } from "react-icons/lu";
import { MdCheck, MdDirectionsWalk, MdFavorite, MdOutlineInfo } from "react-icons/md";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";

interface EstadoIndicador {
  texto: string;
  tono?: "normal" | "informativo" | "atencion" | "alerta";
}

interface RegistroPulso {
  valor?: number | null;
  detalle?: string | null;
}

interface MedicionPresion {
  id: string;
  sistolica?: number | null;
  diastolica?: number | null;
  fecha?: string | null;
  estado?: EstadoIndicador | null;
}

export interface DatosSignosVitales {
  resumen?: {
    estado?: EstadoIndicador | null;
    actualizado?: string | null;
    descripcion?: string | null;
  } | null;
  frecuenciaCardiaca?: {
    actual?: number | null;
    estado?: EstadoIndicador | null;
    minimo?: RegistroPulso | null;
    maximo?: RegistroPulso | null;
  } | null;
  presion?: {
    sistolica?: number | null;
    diastolica?: number | null;
    control?: string | null;
    estado?: EstadoIndicador | null;
    medicionesPrevias?: MedicionPresion[] | null;
  } | null;
  movilidad?: {
    pasos?: number | null;
    meta?: number | null;
    actividad?: string | null;
    observacion?: string | null;
  } | null;
  descanso?: {
    periodo?: string | null;
    duracion?: string | null;
    estado?: EstadoIndicador | null;
    inicio?: string | null;
    fin?: string | null;
    suenoProfundo?: string | null;
  } | null;
}

interface Props {
  datos?: DatosSignosVitales | null;
  periodo?: "hoy" | "semana" | "mes";
}

const tarjeta = "flex w-full min-w-0 flex-col rounded-3xl bg-white p-5 shadow-xs";
const foco = "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]";
const tonosEstado = {
  normal: "bg-[#84F6E6]/30 text-[#006A61]",
  informativo: "bg-[#E0F0FF] text-[#0049CC]",
  atencion: "bg-amber-100 text-amber-800",
  alerta: "bg-red-100 text-red-800",
};
const periodos = [
  { valor: "hoy", titulo: "Hoy" },
  { valor: "semana", titulo: "Semana" },
  { valor: "mes", titulo: "Mes" },
] as const;

function Estado({ estado, mostrarCheck = false }: { estado?: EstadoIndicador | null; mostrarCheck?: boolean }) {
  return (
    <span className={`inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold leading-normal ${estado ? tonosEstado[estado.tono ?? "informativo"] : "bg-[#EBF5FF] text-[#424656]"}`}>
      {mostrarCheck && estado?.tono === "normal" && <MdCheck aria-hidden="true" className="size-3 shrink-0" />}
      {estado?.texto ?? "Sin datos"}
    </span>
  );
}

function Numero({ valor }: { valor?: number | null }) {
  return <>{valor?.toLocaleString("es-AR") ?? "—"}</>;
}

function FilaPresion({ medicion }: { medicion?: MedicionPresion }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#EBF5FF]/60 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm">
          {medicion?.sistolica ?? "—"}/{medicion?.diastolica ?? "—"} mmHg
        </p>
        <p className="text-xs leading-normal text-[#424656]">{medicion?.fecha ?? "—"}</p>
      </div>
      <Estado estado={medicion?.estado} />
    </li>
  );
}

// Presentación sin servicios ni acciones. Los datos se reciben desde la pantalla que la utilice.
export default function SignosVitales({ datos, periodo = "hoy" }: Props) {
  const frecuencia = datos?.frecuenciaCardiaca;
  const presion = datos?.presion;
  const movilidad = datos?.movilidad;
  const descanso = datos?.descanso;
  const historial = presion?.medicionesPrevias ?? [];
  const estadoGeneral = datos?.resumen?.estado;
  const IconoEstadoGeneral = estadoGeneral?.tono === "normal" ? LuShieldCheck : MdOutlineInfo;
  const porcentajePasos = movilidad?.pasos != null && movilidad.meta != null && movilidad.meta > 0
    ? Math.min(100, Math.max(0, movilidad.pasos / movilidad.meta * 100))
    : null;

  return (
    <main className="mainBody text-[#0E1D28]">
      <Header />
      <VueltaAtras titulo="Signos vitales y salud" />

      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <div role="group" aria-label="Período de consulta" className="grid grid-cols-3 gap-1 rounded-2xl bg-[#DAEAF9]/60 p-1">
          {periodos.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              aria-pressed={periodo === opcion.valor}
              className={`min-h-11 min-w-0 rounded-xl px-2 py-2 text-sm font-semibold ${foco} ${periodo === opcion.valor ? "bg-white font-bold text-[#0049CC] shadow-xs hover:bg-blue-50 active:bg-blue-100" : "text-[#424656] hover:bg-white/50 active:bg-white/70"}`}
            >
              {opcion.titulo}
            </button>
          ))}
        </div>

        <section className={`${tarjeta} gap-3`} aria-label="Estado general de salud">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className={`flex min-w-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide ${estadoGeneral ? tonosEstado[estadoGeneral.tono ?? "informativo"] : "bg-[#EBF5FF] text-[#424656]"}`}>
              <IconoEstadoGeneral aria-hidden="true" className="size-4 shrink-0" />
              <span>{estadoGeneral?.texto ?? "SIN DATOS"}</span>
            </div>
            <p className="text-xs text-[#424656]">{datos?.resumen?.actualizado ?? "—"}</p>
          </div>
          <p className="text-base leading-snug">
            {datos?.resumen?.descripcion ?? "Los valores de salud y la sincronización con la pulsera se mostrarán cuando haya datos disponibles."}
          </p>
        </section>

        <section className={`${tarjeta} gap-4`} aria-labelledby="frecuencia-cardiaca">
          <h2 id="frecuencia-cardiaca" className="flex items-center gap-2 text-base font-bold leading-normal sm:text-lg">
            <MdFavorite aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#FFDBD2] p-2 text-[#AD2B00]" />
            Frecuencia cardíaca
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex min-w-0 flex-wrap items-baseline gap-2">
              <span className="text-4xl font-bold leading-tight tracking-tight"><Numero valor={frecuencia?.actual} /></span>
              <span className="text-lg font-semibold text-[#424656]">lpm</span>
            </p>
            <Estado estado={frecuencia?.estado} />
          </div>

          <div
            role="img"
            aria-label="Espacio reservado para el gráfico de frecuencia cardíaca"
            className="h-48 w-full rounded-2xl bg-[#EBF5FF]/70"
          />

          <dl className="grid grid-cols-2 gap-2.5">
            <div className="flex min-w-0 flex-col gap-0.5 rounded-2xl bg-[#EBF5FF] p-3">
              <dt className="text-xs leading-normal text-[#424656]">Mínimo registrado</dt>
              <dd className="text-base font-bold"><Numero valor={frecuencia?.minimo?.valor} /> lpm</dd>
              <dd className="text-xs leading-normal text-[#424656]">{frecuencia?.minimo?.detalle ?? "—"}</dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 rounded-2xl bg-[#EBF5FF] p-3">
              <dt className="text-xs leading-normal text-[#424656]">Máximo registrado</dt>
              <dd className="text-base font-bold"><Numero valor={frecuencia?.maximo?.valor} /> lpm</dd>
              <dd className="text-xs leading-normal text-[#424656]">{frecuencia?.maximo?.detalle ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section className={`${tarjeta} gap-4`} aria-labelledby="presion-arterial">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="presion-arterial" className="flex items-center gap-2 text-base font-bold leading-normal sm:text-lg">
              <LuHeartPulse aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#E0F0FF] p-2 text-[#0B5FFF]" />
              Presión arterial
            </h2>
            <Estado estado={presion?.estado} />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="flex min-w-0 flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold leading-none tracking-tight">{presion?.sistolica ?? "—"}/{presion?.diastolica ?? "—"}</span>
              <span className="text-base font-semibold text-[#424656]">mmHg</span>
            </p>
            <p className="text-xs font-semibold text-[#424656]">Control: {presion?.control ?? "—"}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase leading-normal tracking-wider text-[#424656]">Mediciones previas</h3>
            <ul aria-label="Mediciones previas de presión arterial" className="flex flex-col gap-2">
              {historial.length > 0 ? historial.map((medicion) => (
                <FilaPresion key={medicion.id} medicion={medicion} />
              )) : (
                <>
                  <FilaPresion />
                  <FilaPresion />
                </>
              )}
            </ul>
          </div>
        </section>

        <section className={`${tarjeta} gap-3`} aria-labelledby="movilidad-actividad">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="movilidad-actividad" className="flex items-center gap-2 text-base font-bold leading-normal sm:text-lg">
              <MdDirectionsWalk aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#84F6E6]/30 p-2 text-[#006A61]" />
              Movilidad y actividad
            </h2>
            <span className="rounded-full bg-[#E0F0FF] px-2.5 py-1 text-xs font-bold text-[#0049CC]">
              {porcentajePasos == null ? "—" : Math.round(porcentajePasos)}% meta
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-2 pt-1">
            <label htmlFor="progreso-pasos" className="flex min-w-0 flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold leading-none"><Numero valor={movilidad?.pasos} /></span>
              <span className="text-sm font-semibold text-[#424656]">pasos de hoy</span>
            </label>
            <p className="text-xs font-semibold text-[#424656]">Meta: <Numero valor={movilidad?.meta} /></p>
          </div>
          <progress
            id="progreso-pasos"
            max={100}
            value={porcentajePasos ?? 0}
            aria-label="Progreso de pasos hacia la meta"
            aria-valuetext={porcentajePasos == null ? "Sin datos de pasos o de la meta" : `${Math.round(porcentajePasos)}% de la meta`}
            className="block h-3 w-full appearance-none overflow-hidden rounded-full border-0 bg-[#E0F0FF] [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-[#0B5FFF] [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-[#E0F0FF] [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-[#0B5FFF]"
          />
          <div className="flex items-start gap-2.5 rounded-2xl bg-[#EBF5FF] p-3">
            <LuSmile aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#006A61]" />
            <div className="min-w-0 text-sm leading-relaxed">
              <p>{movilidad?.actividad ?? "—"}</p>
              <p className="text-[#424656]">{movilidad?.observacion ?? "—"}</p>
            </div>
          </div>
        </section>

        <section className={`${tarjeta} gap-3`} aria-labelledby="descanso-sueno">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="descanso-sueno" className="flex items-center gap-2 text-base font-bold leading-normal sm:text-lg">
              <LuMoon aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#E0F0FF] p-2 text-[#0B5FFF]" />
              Descanso y sueño
            </h2>
            <p className="text-xs text-[#424656]">{descanso?.periodo ?? "—"}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-3xl font-bold leading-tight">{descanso?.duracion ?? "—"}</p>
            <Estado estado={descanso?.estado} mostrarCheck />
          </div>
          <dl className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="min-w-0 rounded-xl bg-[#EBF5FF] px-3 py-2">
              <dt className="text-xs leading-normal text-[#424656]">Se durmió</dt>
              <dd className="text-base font-bold">{descanso?.inicio ?? "—"}</dd>
            </div>
            <div className="min-w-0 rounded-xl bg-[#EBF5FF] px-3 py-2">
              <dt className="text-xs leading-normal text-[#424656]">Se despertó</dt>
              <dd className="text-base font-bold">{descanso?.fin ?? "—"}</dd>
            </div>
          </dl>
          <p className="flex items-center gap-2 px-1 text-sm">
            <LuMoon aria-hidden="true" className="size-4 shrink-0 text-[#006A61]" />
            <span>Sueño profundo: {descanso?.suenoProfundo ?? "—"}</span>
          </p>
        </section>
      </div>
    </main>
  );
}
