import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { alertasService, type Alerta } from "../../services/alertasService";
import { dispositivosService, type Dispositivo } from "../../services/dispositivosService";
import { usuarioService, type Vinculo } from "../../services/usuariosService";
import { medicionesService, type ResumenMedicion } from "../../services/medicionesService";
import { medicamentosService, type Medicamento } from "../../services/medicamentosService";
import { RiAlertFill } from "react-icons/ri";
import { LuActivity, LuHeartPulse, LuWatch } from "react-icons/lu";
import {
  MdArrowForward,
  MdCheck,
  MdCheckCircleOutline,
  MdChevronRight,
  MdDirectionsWalk,
  MdFavorite,
  MdOutlineBedtime,
  MdOutlineCalendarToday,
  MdOutlineDescription,
  MdOutlineHealthAndSafety,
  MdOutlineInfo,
  MdOutlineMedication,
  MdOutlinePhone,
  MdOutlineSchedule,
  MdOutlineSupportAgent,
  MdOutlineVolunteerActivism,
  MdPerson,
  MdWbSunny,
} from "react-icons/md";
import { LiaQrcodeSolid } from "react-icons/lia";
import obtenerFechaActual, { obtenerDiaActual } from "../../utils/obtenerFechaActual";
import calcularEdad from "../../utils/calcularEdad";
import AvisosSalud from "../../components/AvisosSalud";
import tiempoDesde from "../../utils/tiempoDesde";
import { tomasDeHoy, proximaToma, momentoDelDia } from "../../utils/tomasDeHoy";

const SETENTA_Y_DOS_HORAS = 72 * 60 * 60 * 1000;

// pasa minutos a "7h 45m"
function horasYMinutos(minutos: number) {
  return `${Math.floor(minutos / 60)}h ${minutos % 60}m`;
}

// elige hasta 2 personas para los botones de llamar:
// primero los contactos de emergencia (en orden de prioridad), después el resto; solo los que tienen teléfono
function personasParaLlamar(vinculos: Vinculo[]) {
  const emergencia = vinculos.filter((v) => v.esContactoEmergencia && v.familiar.telefono);
  emergencia.sort((a, b) => (a.prioridadContacto ?? 99) - (b.prioridadContacto ?? 99));
  const resto = vinculos.filter((v) => !v.esContactoEmergencia && v.familiar.telefono);
  return [...emergencia, ...resto].slice(0, 2);
}

export default function Home() {
  const { usuario } = useAuth();
  const nombre = usuario?.nombreCompleto?.trim().split(/\s+/)[0];
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState<boolean>(false);
  const [errorSOS, setErrorSOS] = useState<string | null>(null);

  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [incidentes72hs, setIncidentes72hs] = useState<number>(0);
  const [pulsera, setPulsera] = useState<Dispositivo | null>(null);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [resumen, setResumen] = useState<ResumenMedicion[]>([]);
  const [pasosHoy, setPasosHoy] = useState<number | null>(null);
  const [suenoMinutos, setSuenoMinutos] = useState<number | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

  useEffect(() => {
    if (!usuario) return;
    const id = usuario.id;

    // cada bloque se carga por separado: si falla uno, los demás se muestran igual

    // alertas: para "Todo en orden", "Estable" e incidentes de las últimas 72 hs
    const cargarAlertas = async () => {
      try {
        const data = await alertasService.getAlertas(id);
        setAlertas(data);

        // cuántas alertas hubo en las últimas 72 hs (se cuenta acá, al llegar los datos)
        const ahora = Date.now();
        const recientes = data.filter(
          (a) => ahora - new Date(a.createdAt).getTime() <= SETENTA_Y_DOS_HORAS
        );
        setIncidentes72hs(recientes.length);
      } catch (err) {
        console.error(err);
      }
    };

    // familiares y cuidadores, para los botones de llamar
    const cargarVinculos = async () => {
      try {
        setVinculos(await usuarioService.getVinculos(id));
      } catch (err) {
        console.error(err);
      }
    };

    // pulso y oxígeno salen del resumen de 24 hs; pasos y sueño se piden aparte
    const cargarMediciones = async () => {
      try {
        setResumen(await medicionesService.getResumen(id));

        // pasos de hoy: se suman todas las mediciones desde las 00:00
        const inicioDelDia = new Date();
        inicioDelDia.setHours(0, 0, 0, 0);
        const pasos = await medicionesService.getMediciones(id, "PASOS", inicioDelDia.toISOString());
        let total = 0;
        for (const medicion of pasos) total += medicion.valor;
        setPasosHoy(total);

        // sueño: el registro más reciente de las últimas 24 hs (vienen del más nuevo al más viejo)
        const hace24hs = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const sueno = await medicionesService.getMediciones(id, "SUENO", hace24hs.toISOString());
        setSuenoMinutos(sueno.length > 0 ? sueno[0].valor : null);
      } catch (err) {
        console.error(err);
      }
    };

    // pide al back que traiga lo nuevo de la pulsera (Google Health) y después vuelve a leer las mediciones
    const sincronizarPulsera = async () => {
      try {
        const dispositivos = await dispositivosService.getDispositivos(id);
        const fitbit = dispositivos.find((d) => d.tipo === "FITBIT_AIR");

        if (fitbit && !fitbit.requiereReautenticacion) {
          try {
            await dispositivosService.sincronizarDispositivo(fitbit.id);
          } catch (err) {
            // si falla la sincronización igual se muestra lo último que haya guardado
            console.error("No se pudo sincronizar la pulsera:", err);
          }
          // se vuelve a pedir para tener la "ultimaSincronizacion" nueva
          const actualizados = await dispositivosService.getDispositivos(id);
          setPulsera(actualizados.find((d) => d.tipo === "FITBIT_AIR") ?? null);
        } else {
          setPulsera(fitbit ?? null);
        }
      } catch (err) {
        console.error(err);
      }

      await cargarMediciones();
    };

    // medicamentos, para la próxima toma
    const cargarMedicamentos = async () => {
      try {
        setMedicamentos(await medicamentosService.getMedicamentos(id));
      } catch (err) {
        console.error(err);
      }
    };

    cargarAlertas();
    cargarVinculos();
    cargarMedicamentos();
    sincronizarPulsera();

    // cada 1 minuto se vuelve a sincronizar la pulsera y a revisar las alertas
    const intervalo = setInterval(() => {
      sincronizarPulsera();
      cargarAlertas();
    }, 60 * 1000);

    // al salir del Home se corta el intervalo, para no seguir pidiendo datos
    return () => clearInterval(intervalo);
  }, [usuario]);

  // datos calculados a partir de lo que llegó del back
  // solo las críticas cambian "Todo en orden" (un logro o un cambio de rutina no es una alerta)
  const alertasPendientes = alertas.filter((a) => a.estado === "PENDIENTE" && a.categoria === "CRITICO");
  const alertasDeSalud = alertasPendientes.filter(
    (a) => a.tipo === "FC_ELEVADA" || a.tipo === "FC_BAJA" || a.tipo === "SP02_BAJO"
  );
  const pulso = resumen.find((r) => r.tipo === "FRECUENCIA_CARDIACA");
  const oxigeno = resumen.find((r) => r.tipo === "SPO2");
  const llamar = personasParaLlamar(vinculos);
  const tomas = tomasDeHoy(medicamentos);

  // cartel al lado de "Pulsera conectada": cuándo se actualizó por última vez
  let ultimaActualizacion = "Todavía no se sincronizó";
  if (pulsera?.ultimaSincronizacion) ultimaActualizacion = `Sincronizado ${tiempoDesde(pulsera.ultimaSincronizacion)}`;
  if (pulsera?.requiereReautenticacion) ultimaActualizacion = "Hay que volver a conectarla desde Mi cuenta";
  const proxima = proximaToma(tomas);

  // llama SOS en back y si sale bien, lleva a la pantalla de emergencia
  const pedirAyuda = async () => {
    if (!usuario) return;
    setEnviando(true);
    setErrorSOS(null);

    try {
      await alertasService.dispararEmergencia(usuario.id);
      navigate("/adulto/sos");
    } catch (err) {
      console.error(err);
      // avisa si ya hay un SOS de los últimos 10 min
      if (
        err instanceof Error &&
        err.message === "Ya existe una alerta pendiente"
      ) {
        navigate("/adulto/sos");
      } else {
        setErrorSOS("No se pudo enviar el pedido de ayuda. Probá de nuevo.");
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="mainBody text-[#0E1D28]">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 wrap-anywhere">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold leading-9 tracking-tight">Hola, {nombre || "Usuario"}</h1>
          <p className="text-base leading-relaxed text-[#424656]">{obtenerFechaActual()}</p>
        </div>

        <section className="flex w-full min-w-0 flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="mi-perfil">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <MdPerson aria-hidden="true" className="size-12 shrink-0 rounded-full bg-[#D4E4F3] p-2 text-[#424656]" />
              <div className="min-w-0">
                <h2 id="mi-perfil" className="text-lg font-bold leading-snug sm:text-xl">{usuario?.nombreCompleto || "Usuario"}</h2>
                <p className="text-sm font-semibold leading-normal text-[#424656]">
                  Adulto mayor · {usuario?.fechaNacimiento
                    ? `${calcularEdad(usuario.fechaNacimiento)} años`
                    : "Sin dato de edad"}
                </p>
              </div>
            </div>
            {alertasPendientes.length === 0 ? (
              <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#84F6E6]/40 px-2.5 py-1 text-xs font-bold uppercase leading-normal tracking-wide text-[#006A61]">
                <MdCheckCircleOutline aria-hidden="true" className="size-4 shrink-0" />
                TODO EN ORDEN
              </span>
            ) : (
              <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#FFDBD2] px-2.5 py-1 text-xs font-bold uppercase leading-normal tracking-wide text-[#AD2B00]">
                <RiAlertFill aria-hidden="true" className="size-4 shrink-0" />
                ALERTA PENDIENTE
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-[#EBF5FF] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-base leading-relaxed">
                <LuWatch aria-hidden="true" className="size-4 shrink-0 text-[#006A61]" />
                {pulsera ? "Pulsera conectada" : "Sin pulsera conectada"}
              </p>
              {pulsera && !pulsera.requiereReautenticacion && (
                <span className="flex items-center gap-1.5 rounded-md bg-white px-2 py-0.5 text-sm font-bold text-[#006A61]">
                  <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-[#006A61]" />
                  En vivo
                </span>
              )}
              {!pulsera && (
                <Link to="/cuenta" className="rounded-md bg-white px-2 py-0.5 text-sm font-bold text-[#0B5FFF]">
                  Conectar
                </Link>
              )}
            </div>
            {pulsera && (
              <p className="text-xs leading-relaxed text-[#424656]">{ultimaActualizacion}</p>
            )}
          </div>
          {llamar.length > 0 && (
            <div className="grid grid-cols-2 gap-3.5">
              {llamar.map((vinculo) => (
                <a
                  key={vinculo.id}
                  href={`tel:${vinculo.familiar.telefono}`}
                  className="flex min-h-14 min-w-0 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold leading-5 text-[#0B5FFF] bg-[#EBF5FF] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]"
                >
                  <MdOutlinePhone aria-hidden="true" className="size-4 shrink-0 text-[#0B5FFF]" />
                  <span>Llamar a {vinculo.familiar.nombreCompleto.split(" ")[0]}</span>
                </a>
              ))}
            </div>
          )}
        </section>

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={pedirAyuda}
            disabled={enviando}
            aria-busy={enviando}
            aria-describedby={errorSOS ? "error-sos" : undefined}
            className="flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-red-500 bg-[#F20D0D] p-5 text-center text-white shadow-lg shadow-red-600/30 hover:bg-[#DE0000] active:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800 disabled:cursor-wait disabled:opacity-70"
          >
            <RiAlertFill aria-hidden="true" className="size-12 rounded-full bg-white/25 p-2.5" />
            <span className="text-xl font-bold uppercase leading-tight tracking-wide">{enviando ? "Enviando ayuda…" : "PEDIR AYUDA URGENTE"}</span>
            <span className="max-w-xs text-xs font-bold leading-snug text-red-100">Presioná para notificar de inmediato a tu familia y cuidadores</span>
          </button>
          {errorSOS && <p id="error-sos" role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{errorSOS}</p>}
        </div>

        {/* avisos cuando los datos de la pulsera salen de lo normal (los genera el back al sincronizar) */}
        <AvisosSalud
          alertas={alertas}
          onRespondida={(id) => setAlertas(alertas.filter((a) => a.id !== id))}
        />

        <section className="flex w-full min-w-0 flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="supervision-medica">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="supervision-medica" className="flex items-center gap-2 text-lg font-bold leading-normal sm:text-xl">
              <LuActivity aria-hidden="true" className="size-6 shrink-0 text-[#0049CC]" />
              Supervisión Médica
            </h2>
            {alertasDeSalud.length === 0 ? (
              <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#84F6E6]/40 px-2.5 py-1 text-xs font-bold uppercase leading-normal tracking-wide text-[#006A61]">
                <MdCheckCircleOutline aria-hidden="true" className="size-4 shrink-0" />
                ESTABLE
              </span>
            ) : (
              <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#FFDBD2] px-2.5 py-1 text-xs font-bold uppercase leading-normal tracking-wide text-[#AD2B00]">
                <RiAlertFill aria-hidden="true" className="size-4 shrink-0" />
                REVISAR
              </span>
            )}
          </div>
          <dl className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
              <dt className="flex items-center justify-between gap-1">
                <span className="text-xs leading-normal text-[#424656]">Pulso</span>
                <MdFavorite aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#FFDBD2] text-[#AD2B00]" />
              </dt>
              <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-tight">
                {pulso ? Math.round(pulso.ultimoValor) : "—"}
                <span className="text-sm font-semibold leading-normal text-[#424656]">lpm</span>
              </dd>
              <dd className="flex items-center gap-1 text-xs leading-normal text-[#424656]">
                <MdOutlineSchedule aria-hidden="true" className="size-3 shrink-0" />
                <span>{pulso ? tiempoDesde(pulso.ultimaMedicion) : "Sin datos de hoy"}</span>
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
              <dt className="flex items-center justify-between gap-1">
                <span className="text-xs leading-normal text-[#424656]">Oxígeno</span>
                <LuHeartPulse aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#DAEAF9] text-[#0B5FFF]" />
              </dt>
              {/* la pulsera no mide presión arterial: en su lugar va el oxígeno en sangre */}
              <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-tight">
                {oxigeno ? Math.round(oxigeno.ultimoValor) : "—"}
                <span className="text-sm font-semibold leading-normal text-[#424656]">%</span>
              </dd>
              <dd className="flex items-center gap-1 text-xs leading-normal text-[#424656]">
                <MdOutlineSchedule aria-hidden="true" className="size-3 shrink-0" />
                <span>{oxigeno ? tiempoDesde(oxigeno.ultimaMedicion) : "Sin datos de hoy"}</span>
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
              <dt className="flex items-center justify-between gap-1">
                <span className="text-xs leading-normal text-[#424656]">Movilidad</span>
                <MdDirectionsWalk aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#84F6E6]/40 text-[#006A61]" />
              </dt>
              <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-tight">
                {pasosHoy !== null ? pasosHoy.toLocaleString("es-AR") : "—"}
                <span className="text-sm font-semibold leading-normal text-[#424656]">pasos</span>
              </dd>
              <dd className="flex items-center gap-1 text-xs leading-normal text-[#424656]">
                <MdWbSunny aria-hidden="true" className="size-3 shrink-0" />
                <span>Hoy</span>
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
              <dt className="flex items-center justify-between gap-1">
                <span className="text-xs leading-normal text-[#424656]">Descanso</span>
                <MdOutlineBedtime aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#DBE1FF] text-[#0B5FFF]" />
              </dt>
              <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-tight">
                {suenoMinutos !== null ? horasYMinutos(suenoMinutos) : "—"}
              </dd>
              <dd className="flex items-center gap-1 text-xs leading-normal text-[#424656]">
                <MdOutlineBedtime aria-hidden="true" className="size-3 shrink-0" />
                <span>{suenoMinutos !== null ? "Última noche" : "Sin datos de anoche"}</span>
              </dd>
            </div>
          </dl>
          <button type="button" className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl px-4 py-2.5 text-lg font-bold leading-6 text-[#0049CC] bg-[#EBF5FF] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
            Ver signos específicos
            <MdArrowForward aria-hidden="true" className="size-4 shrink-0" />
          </button>
        </section>

        <section className="flex w-full min-w-0 flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="rutina-hoy">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="rutina-hoy" className="flex items-center gap-2 text-xl font-bold leading-normal">
              <MdOutlineCalendarToday aria-hidden="true" className="size-5 shrink-0 text-[#0B5FFF]" />
              Rutina de hoy
            </h2>
            <span className="text-sm font-semibold text-[#424656]">{obtenerDiaActual()}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#EBF5FF] p-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <MdOutlineMedication aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-white p-3 text-[#0B5FFF] shadow-xs" />
              <div className="min-w-0">
                {proxima ? (
                  <>
                    <h3 className="text-base font-bold leading-relaxed">
                      {proxima.medicamento.nombre} {proxima.medicamento.dosis}
                    </h3>
                    <p className="text-xs leading-relaxed text-[#424656]">
                      Próxima: {proxima.horario} hs ({momentoDelDia(proxima.horario)})
                    </p>
                  </>
                ) : (
                  <h3 className="text-base font-bold leading-relaxed">
                    {tomas.length === 0 ? "Sin medicación para hoy" : "Ya pasaron las tomas de hoy"}
                  </h3>
                )}
              </div>
            </div>
            <Link to="../medicamentos" className="rounded-full px-2.5 py-1 text-xs font-bold bg-[#84F6E6]/40 text-[#006A61]">
              {tomas.length} {tomas.length === 1 ? "toma" : "tomas"} hoy
            </Link>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-[#EBF5FF] p-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <MdOutlineHealthAndSafety aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-[#84F6E6]/40 p-2.5 text-[#006A61]" />
              <div className="min-w-0">
                <h3 className="text-base font-bold leading-relaxed">Incidentes y caídas</h3>
                <p className="text-xs leading-relaxed text-[#424656]">
                  {incidentes72hs} {incidentes72hs === 1 ? "alerta" : "alertas"} en las últimas 72 hs
                </p>
              </div>
            </div>
            {incidentes72hs === 0 ? (
              <MdCheck aria-hidden="true" className="size-7 shrink-0 rounded-full bg-white p-1.5 text-[#006A61]" />
            ) : (
              <RiAlertFill aria-hidden="true" className="size-7 shrink-0 rounded-full bg-white p-1.5 text-[#AD2B00]" />
            )}
          </div>
        </section>

        <section className="flex w-full min-w-0 flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="ficha-consulta">
          <h2 id="ficha-consulta" className="flex items-center gap-2 text-xl font-bold leading-normal">
            <MdOutlineDescription aria-hidden="true" className="size-5 shrink-0 text-[#0B5FFF]" />
            Ficha de consulta
          </h2>
          <p className="text-sm font-semibold leading-normal text-[#424656]">Para guardia / SAME</p>
          <div className="flex flex-col gap-2">
            <Link to="../salud" className="flex w-full items-center justify-between gap-3 rounded-xl p-3.5 text-left bg-[#EBF5FF] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
              <span className="flex min-w-0 items-center gap-3">
                <MdOutlineInfo aria-hidden="true" className="size-10 shrink-0 rounded-xl p-2.5 bg-[#D4E4F3] text-[#0B5FFF]" />
                <span className="flex min-w-0 flex-col">
                  <span className="text-base font-bold leading-relaxed">Mi información médica</span>
                  <span className="text-xs leading-relaxed text-[#424656]">Tocá para consultar los datos</span>
                </span>
              </span>
              <MdChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#B9C6D5]" />
            </Link>
            <Link to="../codigo" className="flex w-full items-center justify-between gap-3 rounded-xl p-3.5 text-left bg-[#EBF5FF] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
              <span className="flex min-w-0 items-center gap-3">
                <LiaQrcodeSolid aria-hidden="true" className="size-10 shrink-0 rounded-xl p-2.5 bg-[#FFDBD2] text-[#AD2B00]" />
                <span className="flex min-w-0 flex-col">
                  <span className="text-base font-bold leading-relaxed">Código de emergencia</span>
                  <span className="text-xs leading-relaxed text-[#424656]">Tocá para consultar los datos</span>
                </span>
              </span>
              <MdChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#B9C6D5]" />
            </Link>
            <Link to="../cuidados" className="flex w-full items-center justify-between gap-3 rounded-xl p-3.5 text-left bg-[#EBF5FF] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
              <span className="flex min-w-0 items-center gap-3">
                <MdOutlineVolunteerActivism aria-hidden="true" className="size-10 shrink-0 rounded-xl p-2.5 bg-[#D4E4F3] text-[#0B5FFF]" />
                <span className="flex min-w-0 flex-col">
                  <span className="text-base font-bold leading-relaxed">Mis voluntades y cuidados</span>
                  <span className="text-xs leading-relaxed text-[#424656]">Tocá para consultar los datos</span>
                </span>
              </span>
              <MdChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#B9C6D5]" />
            </Link>
            <Link to="../ayuda" className="flex w-full items-center justify-between gap-3 rounded-xl p-3.5 text-left bg-[#EBF5FF] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
              <span className="flex min-w-0 items-center gap-3">
                <MdOutlineSupportAgent aria-hidden="true" className="size-10 shrink-0 rounded-xl p-2.5 bg-[#D4E4F3] text-[#0B5FFF]" />
                <span className="flex min-w-0 flex-col">
                  <span className="text-base font-bold leading-relaxed">Ayuda y soporte</span>
                  <span className="text-xs leading-relaxed text-[#424656]">Tocá para consultar los datos</span>
                </span>
              </span>
              <MdChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#B9C6D5]" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
