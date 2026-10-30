import { useEffect, useState } from "react";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { useAuth } from "../../hooks/useAuth";
import { medicionesService, type Medicion } from "../../services/medicionesService";
import { dispositivosService } from "../../services/dispositivosService";
import { alertasService, type Alerta } from "../../services/alertasService";
import tiempoDesde from "../../utils/tiempoDesde";
import { LuMoon, LuShieldCheck, LuTriangleAlert } from "react-icons/lu";
import { TbLungs } from "react-icons/tb";
import { MdCheck, MdDirectionsWalk, MdFavorite } from "react-icons/md";

const HORA_MS = 60 * 60 * 1000;
const DIA_MS = 24 * HORA_MS;
// meta de pasos diaria (fija hasta que el back permita guardarla por persona)
const META_PASOS = 3000;

// cuántos días abarca cada pestaña
const periodos = [
  { valor: "hoy", texto: "Hoy", dias: 1 },
  { valor: "semana", texto: "Semana", dias: 7 },
  { valor: "mes", texto: "Mes", dias: 30 },
];

// pasa minutos a "7h 45m"
function horasYMinutos(minutos: number) {
  return `${Math.floor(minutos / 60)}h ${Math.round(minutos % 60)}m`;
}

// hora de una fecha del back: "14:09"
function hora(fecha: string) {
  return new Date(fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

// día y hora: "jue 29 oct · 19:30 hs"
function diaYHora(fecha: string) {
  const dia = new Date(fecha).toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
  return `${dia} · ${hora(fecha)} hs`;
}

// arma los puntos de la línea del gráfico de pulso ("x,y x,y ...") en un dibujo de 300 x 60
// eje x: el tiempo del período; eje y: de 40 lpm (abajo) a 140 lpm (arriba)
function puntosDelGrafico(pulsos: Medicion[], desdeMs: number, hastaMs: number) {
  // si hay muchísimos datos (1 por minuto) se toma 1 de cada "salto" para no dibujar miles de puntos
  const salto = Math.max(1, Math.floor(pulsos.length / 300));
  let puntos = "";
  // vienen del más nuevo al más viejo: se recorren al revés para dibujar de izquierda a derecha
  for (let i = pulsos.length - 1; i >= 0; i = i - salto) {
    const tiempo = new Date(pulsos[i].timestamp).getTime();
    const x = ((tiempo - desdeMs) / (hastaMs - desdeMs)) * 300;
    const valor = Math.min(140, Math.max(40, pulsos[i].valor));
    const y = 60 - ((valor - 40) / 100) * 60;
    puntos = puntos + `${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return puntos;
}

// etiqueta del oxígeno según el valor
function estadoOxigeno(valor: number) {
  if (valor >= 98) return "Óptima";
  if (valor >= 95) return "Normal";
  return "Bajo";
}

// pantalla del adulto: sus signos vitales de la pulsera, por día, semana o mes
export default function SignosVitales() {
  const { usuario } = useAuth();
  const [periodo, setPeriodo] = useState("hoy");
  const [pulsos, setPulsos] = useState<Medicion[]>([]);
  const [oxigenos, setOxigenos] = useState<Medicion[]>([]);
  const [pasos, setPasos] = useState<Medicion[]>([]);
  const [suenos, setSuenos] = useState<Medicion[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // momento de la última carga: se usa para el rango del gráfico (no se puede leer la hora durante el render)
  const [cargadoEn, setCargadoEn] = useState(0);

  const dias = periodos.find((p) => p.valor === periodo)?.dias ?? 1;

  useEffect(() => {
    if (!usuario) return;
    const id = usuario.id;

    // pide al back lo nuevo de la pulsera (si falla, se muestra igual lo que ya hay guardado)
    const sincronizar = async () => {
      try {
        const dispositivos = await dispositivosService.getDispositivos(id);
        const fitbit = dispositivos.find((d) => d.tipo === "FITBIT_AIR");
        if (fitbit && !fitbit.requiereReautenticacion) {
          await dispositivosService.sincronizarDispositivo(fitbit.id);
        }
      } catch (err) {
        console.error("No se pudo sincronizar la pulsera:", err);
      }
    };

    // trae las mediciones del período elegido
    const cargar = async () => {
      setError(null);
      const ahora = Date.now();
      const desde = new Date(ahora - dias * DIA_MS).toISOString();

      // los pasos de "Hoy" se cuentan desde las 00:00, no desde hace 24 hs
      const inicioPasos = new Date(ahora - (dias - 1) * DIA_MS);
      inicioPasos.setHours(0, 0, 0, 0);

      // el sueño se busca siempre en los últimos 30 días, para tener la última noche aunque sea vieja
      const desdeSueno = new Date(ahora - 30 * DIA_MS).toISOString();

      try {
        setPulsos(await medicionesService.getMediciones(id, "FRECUENCIA_CARDIACA", desde));
        setOxigenos(await medicionesService.getMediciones(id, "SPO2", desde));
        setPasos(await medicionesService.getMediciones(id, "PASOS", inicioPasos.toISOString()));
        setSuenos(await medicionesService.getMediciones(id, "SUENO", desdeSueno));
        setAlertas(await alertasService.getAlertas(id));
        setCargadoEn(ahora);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos de la pulsera.");
      } finally {
        setCargando(false);
      }
    };

    // primero sincroniza y después lee
    const sincronizarYCargar = async () => {
      await sincronizar();
      await cargar();
    };

    sincronizarYCargar();
    // cada 1 minuto se actualiza, igual que el Home
    const intervalo = setInterval(sincronizarYCargar, 60 * 1000);
    return () => clearInterval(intervalo);
  }, [usuario, dias]);

  // ---------- cuentas a partir de lo que llegó ----------

  // estado general: si hay alguna alerta crítica sin resolver
  const hayAlertas = alertas.some((a) => a.estado === "PENDIENTE" && a.categoria === "CRITICO");

  // el dato más nuevo de todos, para el "Hace X min"
  let ultimoDato: string | null = null;
  for (const lista of [pulsos, oxigenos, pasos]) {
    if (lista.length > 0 && (!ultimoDato || lista[0].timestamp > ultimoDato)) ultimoDato = lista[0].timestamp;
  }

  // pulso: último, mínimo y máximo del período
  const ultimoPulso = pulsos.length > 0 ? pulsos[0] : null;
  let minimo: Medicion | null = null;
  let maximo: Medicion | null = null;
  for (const pulso of pulsos) {
    if (!minimo || pulso.valor < minimo.valor) minimo = pulso;
    if (!maximo || pulso.valor > maximo.valor) maximo = pulso;
  }
  const pulsoEnRango = ultimoPulso !== null && ultimoPulso.valor >= 60 && ultimoPulso.valor <= 100;

  // oxígeno: el último y los 2 anteriores
  const ultimoOxigeno = oxigenos.length > 0 ? oxigenos[0] : null;
  const oxigenosPrevios = oxigenos.slice(1, 3);

  // pasos: en "Hoy" el total del día; en semana y mes, el promedio por día
  let totalPasos = 0;
  for (const paso of pasos) totalPasos += paso.valor;
  const pasosPorDia = Math.round(totalPasos / dias);
  const porcentajeMeta = Math.round((pasosPorDia / META_PASOS) * 100);

  // sueño: la noche más reciente
  const ultimoSueno = suenos.length > 0 ? suenos[0] : null;
  let horaDespertar = "";
  let minutosProfundo = 0;
  if (ultimoSueno) {
    const fin = new Date(ultimoSueno.timestamp).getTime() + ultimoSueno.valor * 60000;
    horaDespertar = hora(new Date(fin).toISOString());
    const etapas = ultimoSueno.metadata?.etapas ?? [];
    for (const etapa of etapas) {
      if (etapa.tipo.toUpperCase().includes("DEEP")) minutosProfundo += etapa.minutos;
    }
  }

  // rango del gráfico
  const hastaMs = cargadoEn;
  const desdeMs = hastaMs - dias * DIA_MS;

  return (
    <main className="mainBody text-[#0E1D28]">
      <Header />
      <VueltaAtras titulo="Signos vitales y salud" compacto />

      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <div role="group" aria-label="Período de consulta" className="grid grid-cols-3 gap-1 rounded-2xl bg-[#DAEAF9]/60 p-1">
          {periodos.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              aria-pressed={periodo === opcion.valor}
              onClick={() => setPeriodo(opcion.valor)}
              className={`min-h-11 min-w-0 cursor-pointer rounded-xl px-2 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF] ${
                periodo === opcion.valor
                  ? "bg-white font-bold text-[#0049CC] shadow-xs"
                  : "font-semibold text-[#424656] hover:bg-white/50 active:bg-white/70"
              }`}
            >
              {opcion.texto}
            </button>
          ))}
        </div>

        {cargando && <p className="text-center text-[#424656]">Cargando datos de la pulsera…</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

        <section className="flex w-full min-w-0 flex-col gap-3 rounded-3xl bg-white p-5 shadow-xs" aria-label="Estado general de salud">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {hayAlertas ? (
              <span className="flex items-center gap-1.5 rounded-full bg-[#FFDBD2] px-3 py-1 text-xs font-bold tracking-wide text-[#AD2B00]">
                <LuTriangleAlert aria-hidden="true" className="size-4 shrink-0" />
                REVISAR PARÁMETROS
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-[#84F6E6]/30 px-3 py-1 text-xs font-bold tracking-wide text-[#006A61]">
                <LuShieldCheck aria-hidden="true" className="size-4 shrink-0" />
                PARÁMETROS NORMALES
              </span>
            )}
            {ultimoDato && <p className="text-xs text-[#424656]">{tiempoDesde(ultimoDato)}</p>}
          </div>
          <p className="text-base leading-snug">
            {hayAlertas
              ? "Hay valores fuera de tus rangos habituales. Revisá los avisos en el inicio."
              : "Tus valores están dentro de los rangos habituales. Sincronizado con tu pulsera."}
          </p>
        </section>

        <section className="flex w-full min-w-0 flex-col gap-4 rounded-3xl bg-white p-5 shadow-xs" aria-labelledby="frecuencia-cardiaca">
          <h2 id="frecuencia-cardiaca" className="flex items-center gap-2 text-base font-bold sm:text-lg">
            <MdFavorite aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#FFDBD2] p-2 text-[#AD2B00]" />
            Frecuencia cardíaca
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex min-w-0 flex-wrap items-baseline gap-2">
              <span className="text-4xl font-bold leading-tight tracking-tight">
                {ultimoPulso ? Math.round(ultimoPulso.valor) : "—"}
              </span>
              <span className="text-lg font-semibold text-[#424656]">lpm</span>
            </p>
            {ultimoPulso && (
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${pulsoEnRango ? "bg-[#84F6E6]/30 text-[#006A61]" : "bg-[#FFDBD2] text-[#AD2B00]"}`}>
                {pulsoEnRango ? "En rango" : "Fuera de rango"}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-[#EBF5FF]/70 p-3">
            <p className="text-xs text-[#424656]">Zona segura esperada (60-100 lpm)</p>
            {pulsos.length > 0 ? (
              <svg viewBox="0 0 300 60" preserveAspectRatio="none" role="img" aria-label="Gráfico del pulso en el período" className="h-24 w-full">
                {/* franja azul: de 60 a 100 lpm */}
                <rect x="0" y="24" width="300" height="24" fill="#0B5FFF" opacity="0.15" />
                <polyline points={puntosDelGrafico(pulsos, desdeMs, hastaMs)} fill="none" stroke="#E5341B" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
            ) : (
              <p className="py-6 text-center text-sm text-[#424656]">Sin datos de pulso en este período</p>
            )}
            <div className="flex justify-between text-[0.65rem] text-[#424656]">
              <span>{periodo === "hoy" ? "Hace 24 hs" : `Hace ${dias} días`}</span>
              <span>Ahora</span>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-2.5">
            <div className="flex min-w-0 flex-col gap-0.5 rounded-2xl bg-[#EBF5FF] p-3">
              <dt className="text-xs text-[#424656]">Mínimo registrado</dt>
              <dd className="text-base font-bold">{minimo ? `${Math.round(minimo.valor)} lpm` : "—"}</dd>
              {minimo && <dd className="text-xs text-[#424656]">{diaYHora(minimo.timestamp)}</dd>}
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 rounded-2xl bg-[#EBF5FF] p-3">
              <dt className="text-xs text-[#424656]">Máximo registrado</dt>
              <dd className="text-base font-bold">{maximo ? `${Math.round(maximo.valor)} lpm` : "—"}</dd>
              {maximo && <dd className="text-xs text-[#424656]">{diaYHora(maximo.timestamp)}</dd>}
            </div>
          </dl>
        </section>

        <section className="flex w-full min-w-0 flex-col gap-4 rounded-3xl bg-white p-5 shadow-xs" aria-labelledby="oxigeno-sangre">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="oxigeno-sangre" className="flex items-center gap-2 text-base font-bold sm:text-lg">
              <TbLungs aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#E0F0FF] p-2 text-[#0B5FFF]" />
              Oxígeno en sangre
            </h2>
            {ultimoOxigeno && (
              <span className="rounded-full bg-[#84F6E6]/30 px-2.5 py-1 text-xs font-bold text-[#006A61]">
                {estadoOxigeno(ultimoOxigeno.valor)}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="flex min-w-0 flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold leading-none">{ultimoOxigeno ? Math.round(ultimoOxigeno.valor) : "—"}</span>
              <span className="text-base font-semibold text-[#424656]">%</span>
            </p>
            {ultimoOxigeno && <p className="text-xs font-semibold text-[#424656]">Medido {hora(ultimoOxigeno.timestamp)} hs</p>}
          </div>
          {/* la Fitbit mide el oxígeno mientras la persona duerme */}
          {!ultimoOxigeno && (
            <p className="text-sm text-[#424656]">La pulsera mide el oxígeno mientras dormís. Va a aparecer después de una noche con la pulsera puesta.</p>
          )}
          {oxigenosPrevios.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#424656]">Mediciones previas</h3>
              <ul className="flex flex-col gap-2">
                {oxigenosPrevios.map((medicion) => (
                  <li key={medicion.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#EBF5FF]/60 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm">{Math.round(medicion.valor)} %</p>
                      <p className="text-xs text-[#424656]">{diaYHora(medicion.timestamp)}</p>
                    </div>
                    <span className="rounded-full bg-[#E0F0FF] px-2.5 py-1 text-xs font-bold text-[#0049CC]">
                      {estadoOxigeno(medicion.valor)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="flex w-full min-w-0 flex-col gap-3 rounded-3xl bg-white p-5 shadow-xs" aria-labelledby="movilidad-actividad">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="movilidad-actividad" className="flex items-center gap-2 text-base font-bold sm:text-lg">
              <MdDirectionsWalk aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#84F6E6]/30 p-2 text-[#006A61]" />
              Movilidad y actividad
            </h2>
            <span className="rounded-full bg-[#E0F0FF] px-2.5 py-1 text-xs font-bold text-[#0049CC]">{porcentajeMeta}% meta</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-2 pt-1">
            <p className="flex min-w-0 flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold leading-none">{pasosPorDia.toLocaleString("es-AR")}</span>
              <span className="text-sm font-semibold text-[#424656]">{periodo === "hoy" ? "pasos de hoy" : "pasos por día"}</span>
            </p>
            <p className="text-xs font-semibold text-[#424656]">Meta: {META_PASOS.toLocaleString("es-AR")}</p>
          </div>
          <progress
            max={META_PASOS}
            value={Math.min(pasosPorDia, META_PASOS)}
            aria-label="Progreso de pasos hacia la meta"
            className="block h-3 w-full appearance-none overflow-hidden rounded-full border-0 bg-[#E0F0FF] [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-[#0B5FFF] [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-[#E0F0FF] [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-[#0B5FFF]"
          />
        </section>

        <section className="flex w-full min-w-0 flex-col gap-3 rounded-3xl bg-white p-5 shadow-xs" aria-labelledby="descanso-sueno">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="descanso-sueno" className="flex items-center gap-2 text-base font-bold sm:text-lg">
              <LuMoon aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#E0F0FF] p-2 text-[#0B5FFF]" />
              Descanso y sueño
            </h2>
            <p className="text-xs text-[#424656]">{ultimoSueno ? new Date(ultimoSueno.timestamp).toLocaleDateString("es-AR", { weekday: "long", day: "numeric" }) : "Noche anterior"}</p>
          </div>
          {ultimoSueno ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-3xl font-bold leading-tight">{horasYMinutos(ultimoSueno.valor)}</p>
                {ultimoSueno.valor >= 7 * 60 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#84F6E6]/30 px-2.5 py-1 text-xs font-bold text-[#006A61]">
                    <MdCheck aria-hidden="true" className="size-3 shrink-0" />
                    Sueño reparador
                  </span>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="min-w-0 rounded-xl bg-[#EBF5FF] px-3 py-2">
                  <dt className="text-xs text-[#424656]">Te dormiste</dt>
                  <dd className="text-base font-bold">{hora(ultimoSueno.timestamp)} hs</dd>
                </div>
                <div className="min-w-0 rounded-xl bg-[#EBF5FF] px-3 py-2">
                  <dt className="text-xs text-[#424656]">Te despertaste</dt>
                  <dd className="text-base font-bold">{horaDespertar} hs</dd>
                </div>
              </dl>
              {minutosProfundo > 0 && (
                <p className="flex items-center gap-2 px-1 text-sm">
                  <LuMoon aria-hidden="true" className="size-4 shrink-0 text-[#006A61]" />
                  Sueño profundo: {horasYMinutos(minutosProfundo)}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-[#424656]">Todavía no hay registros de sueño. Dormí con la pulsera puesta para verlos acá.</p>
          )}
        </section>
      </div>
    </main>
  );
}
