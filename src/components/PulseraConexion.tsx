import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  dispositivosService,
  type Dispositivo,
  type EstadoSyncHistorico,
  type ResultadoSincronizacion,
} from "../services/dispositivosService";
import tiempoDesde from "../utils/tiempoDesde";
import { LuDatabase, LuLink, LuRefreshCw, LuTriangleAlert, LuWatch } from "react-icons/lu";

const HORA_MS = 60 * 60 * 1000;

// opciones para "Recuperar datos": desde cuándo volver a pedirle todo a Google
const opcionesHistorial = [
  { valor: "6h", texto: "Últimas 6 horas", horas: 6 },
  { valor: "3d", texto: "Últimos 3 días", horas: 3 * 24 },
  { valor: "30d", texto: "Último mes", horas: 30 * 24 },
  { valor: "todo", texto: "Todo lo que tenga Google", horas: 0 },
];

// porcentaje de avance de la carga del historial (0 a 100)
function porcentajeHistorial(estado: EstadoSyncHistorico) {
  const desde = new Date(estado.desde).getTime();
  const hasta = new Date(estado.hasta).getTime();
  const progreso = new Date(estado.progresoHasta).getTime();
  if (hasta <= desde) return 100;
  return Math.round(((progreso - desde) / (hasta - desde)) * 100);
}

// bloque de la Cuenta del adulto: conectar la pulsera, sincronizarla y recuperar datos que llegaron tarde
export default function PulseraConexion() {
  const { usuario } = useAuth();
  const [params] = useSearchParams();
  // el back vuelve a /cuenta?conectado=1 si se vinculó, o ?conectado=0 si se canceló o falló
  const conectado = params.get("conectado");

  const [pulsera, setPulsera] = useState<Dispositivo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoSincronizacion | null>(null);
  const [opcion, setOpcion] = useState("6h");
  const [historial, setHistorial] = useState<EstadoSyncHistorico | null>(null);

  // trae la pulsera del adulto (el dispositivo FITBIT_AIR, si tiene)
  const buscarPulsera = async (usuarioId: string) => {
    const dispositivos = await dispositivosService.getDispositivos(usuarioId);
    return dispositivos.find((d) => d.tipo === "FITBIT_AIR") ?? null;
  };

  useEffect(() => {
    if (!usuario) return;
    const cargar = async () => {
      try {
        setPulsera(await buscarPulsera(usuario.id));
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el estado de la pulsera.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario]);

  // mientras se recuperan datos, cada 3 segundos se pregunta cómo va
  const enCurso = historial?.estado === "EN_CURSO";
  useEffect(() => {
    if (!enCurso || !pulsera || !usuario) return;
    const dispositivoId = pulsera.id;
    const usuarioId = usuario.id;
    const intervalo = setInterval(async () => {
      try {
        const estado = await dispositivosService.getSyncHistorico(dispositivoId);
        setHistorial(estado);
        // cuando termina, se vuelve a pedir la pulsera para ver la última sincronización nueva
        if (estado.estado !== "EN_CURSO") setPulsera(await buscarPulsera(usuarioId));
      } catch (err) {
        console.error(err);
      }
    }, 3000);
    return () => clearInterval(intervalo);
  }, [enCurso, pulsera, usuario]);

  // pide al back el link de Google y lleva al usuario ahí para que autorice la pulsera
  const conectar = async () => {
    setError(null);
    setOcupado(true);
    try {
      const { authUrl } = await dispositivosService.getGoogleHealthAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar la conexión con Google. Probá de nuevo.");
      setOcupado(false);
    }
  };

  // trae ya mismo lo nuevo de la pulsera
  const sincronizar = async () => {
    if (!pulsera) return;
    setError(null);
    setResultado(null);
    setOcupado(true);
    try {
      setResultado(await dispositivosService.sincronizarDispositivo(pulsera.id));
    } catch (err) {
      console.error(err);
      setError("No se pudo sincronizar. Si sigue pasando, volvé a conectar la pulsera.");
    }
    // se vuelve a pedir la pulsera para mostrar la última sincronización nueva
    try {
      if (usuario) setPulsera(await buscarPulsera(usuario.id));
    } catch (err) {
      console.error(err);
    }
    setOcupado(false);
  };

  // vuelve a pedirle a Google todo desde la fecha elegida (recupera lo que llegó tarde, sin duplicar)
  const recuperarDatos = async () => {
    if (!pulsera) return;
    setError(null);
    setOcupado(true);
    try {
      const elegida = opcionesHistorial.find((o) => o.valor === opcion);
      let desde: string | undefined = undefined;
      if (elegida && elegida.horas > 0) desde = new Date(Date.now() - elegida.horas * HORA_MS).toISOString();
      setHistorial(await dispositivosService.iniciarSyncHistorico(pulsera.id, desde));
    } catch (err) {
      console.error(err);
      setError("No se pudo empezar a recuperar los datos. Puede que ya haya una carga en curso.");
    } finally {
      setOcupado(false);
    }
  };

  return (
    <section className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="titulo-pulsera">
      <h2 id="titulo-pulsera" className="flex items-center gap-2 text-lg font-bold">
        <LuWatch aria-hidden="true" className="size-8 shrink-0 rounded-full bg-blue-50 p-1.5 text-blue-600" />
        Pulsera inteligente
      </h2>
      <p className="text-sm text-slate-500">
        Compartís solo los datos que autorices en Google Health. Se usan para detectar cambios importantes y avisar a tu red.
      </p>

      {conectado === "1" && (
        <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">¡Tu pulsera quedó conectada!</p>
      )}
      {conectado === "0" && (
        <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          No se conectó la pulsera. Cancelaste el permiso o Google no respondió. Probá de nuevo.
        </p>
      )}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      {cargando && <p className="text-sm text-slate-500">Cargando…</p>}

      {/* sin pulsera, o con el permiso de Google vencido: hay que conectar */}
      {!cargando && (!pulsera || pulsera.requiereReautenticacion) && (
        <>
          {pulsera?.requiereReautenticacion && (
            <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              <LuTriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              Google necesita tu permiso otra vez. Mientras tanto no llegan datos nuevos.
            </p>
          )}
          <button
            type="button"
            onClick={conectar}
            disabled={ocupado}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#0B6D3C] bg-white px-3 text-sm font-bold text-[#1550E0] hover:bg-[#E8FAF1] active:bg-[#BAEDD3] disabled:cursor-wait disabled:opacity-70"
          >
            <LuLink aria-hidden="true" className="size-4" />
            {pulsera ? "Volver a conectar con Google Health" : "Conectar con Google Health / Fitbit"}
          </button>
        </>
      )}

      {/* pulsera conectada */}
      {!cargando && pulsera && !pulsera.requiereReautenticacion && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#EBF5FF] p-3">
            <div>
              <p className="font-bold">Fitbit Air</p>
              <p className="text-sm text-slate-600">
                {pulsera.ultimaSincronizacion
                  ? `Última sincronización ${tiempoDesde(pulsera.ultimaSincronizacion)}`
                  : "Todavía no sincronizó"}
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">Conectada</span>
          </div>

          <button
            type="button"
            onClick={sincronizar}
            disabled={ocupado || enCurso}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D] disabled:cursor-wait disabled:opacity-70"
          >
            <LuRefreshCw aria-hidden="true" className={`size-5 ${ocupado ? "animate-spin" : ""}`} />
            Sincronizar ahora
          </button>
          {resultado && (
            <p className="text-sm text-slate-600">
              {resultado.insertadas === 0
                ? "No había datos nuevos en Google todavía. Abrí la app de Fitbit en el celular y probá de nuevo."
                : `Llegaron ${resultado.insertadas} mediciones nuevas.`}
              {resultado.tiposConError.length > 0 && ` No se pudo traer: ${resultado.tiposConError.join(", ")}.`}
            </p>
          )}

          {/* recuperar datos que Google recibió tarde (la sincronización normal no vuelve a buscarlos) */}
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3">
            <p className="flex items-center gap-2 font-bold">
              <LuDatabase aria-hidden="true" className="size-4 shrink-0 text-[#1550E0]" />
              Recuperar datos
            </p>
            <p className="text-sm text-slate-500">
              Si ves datos viejos, volvé a pedirle todo a Google desde una fecha. No se duplica nada.
            </p>
            <label htmlFor="desde-historial" className="text-sm font-semibold">Desde</label>
            <select
              id="desde-historial"
              value={opcion}
              onChange={(e) => setOpcion(e.target.value)}
              disabled={enCurso}
              className="min-h-11 rounded-lg border border-slate-300 bg-white px-2"
            >
              {opcionesHistorial.map((o) => (
                <option key={o.valor} value={o.valor}>{o.texto}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={recuperarDatos}
              disabled={ocupado || enCurso}
              className="flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[#EBF5FF] font-semibold text-[#1550E0] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] disabled:cursor-wait disabled:opacity-70"
            >
              {enCurso ? "Recuperando…" : "Recuperar datos"}
            </button>

            {historial && historial.estado === "EN_CURSO" && (
              <div className="flex flex-col gap-1">
                <progress
                  max={100}
                  value={porcentajeHistorial(historial)}
                  aria-label="Avance de la recuperación de datos"
                  className="block h-2.5 w-full appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:bg-[#1550E0] [&::-webkit-progress-bar]:bg-[#E0F0FF] [&::-webkit-progress-value]:bg-[#1550E0]"
                />
                <p className="text-xs text-slate-500">
                  {porcentajeHistorial(historial)}% · {historial.insertadas} mediciones recuperadas hasta ahora
                </p>
              </div>
            )}
            {historial && historial.estado === "TERMINADO" && (
              <p className="text-sm font-semibold text-emerald-700">Listo: se recuperaron {historial.insertadas} mediciones.</p>
            )}
            {historial && historial.estado === "ERROR" && (
              <p className="text-sm font-semibold text-red-700">La recuperación se cortó. Probá de nuevo más tarde.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
