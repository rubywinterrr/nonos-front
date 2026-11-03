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
import { LuArrowRight, LuClock3, LuFootprints, LuPhone, LuPill, LuQrCode, LuShieldCheck, LuTriangleAlert, LuWatch } from "react-icons/lu";
import { MdChevronRight, MdOutlineDescription, MdOutlineInfo, MdOutlineSupportAgent, MdOutlineVolunteerActivism } from "react-icons/md";
import obtenerFechaActual from "../../utils/obtenerFechaActual";
import AvisosSalud from "../../components/AvisosSalud";
import tiempoDesde from "../../utils/tiempoDesde";
import { tomasDeHoy, proximaToma, momentoDelDia } from "../../utils/tomasDeHoy";
import { horasYMinutos } from "../../utils/formatoSignos";

const SETENTA_Y_DOS_HORAS = 72 * 60 * 60 * 1000;
const META_PASOS = 3000;

// conserva los atajos de llamada del Home, priorizando contactos de emergencia
function personasParaLlamar(vinculos: Vinculo[]) {
  const emergencia = vinculos.filter((v) => v.esContactoEmergencia && v.familiar.telefono);
  emergencia.sort((a, b) => (a.prioridadContacto ?? 99) - (b.prioridadContacto ?? 99));
  const resto = vinculos.filter((v) => !v.esContactoEmergencia && v.familiar.telefono);
  return [...emergencia, ...resto].slice(0, 2);
}

interface SignoCircularProps {
  etiqueta: string;
  valor: string;
  detalle: string;
  progreso: number;
  destino: string;
}

function SignoCircular({ etiqueta, valor, detalle, progreso, destino }: SignoCircularProps) {
  const progresoSeguro = Math.max(0, Math.min(100, progreso));

  return (
    <Link
      to={destino}
      aria-label={`${etiqueta}: ${valor} ${detalle}. Ver detalle`}
      className="flex min-w-0 cursor-pointer flex-col items-center gap-1.5 rounded-2xl bg-white px-3 py-3 shadow-md hover:bg-[#F8FBFF] active:bg-[#EEF4FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
    >
      <span
        aria-hidden="true"
        className="flex size-24 items-center justify-center rounded-full"
        style={{ background: `conic-gradient(#0B7040 ${progresoSeguro}%, #DDF2E5 ${progresoSeguro}% 100%)` }}
      >
        <span className="flex size-20 flex-col items-center justify-center rounded-full bg-white text-center">
          <span className="max-w-full text-lg font-bold leading-tight">{valor}</span>
          <span className="text-xs leading-4 text-[#435059]">{detalle}</span>
        </span>
      </span>
      <span className="text-sm font-bold leading-5">{etiqueta}</span>
    </Link>
  );
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
  // solo las críticas cambian el resumen de salud
  const alertasPendientes = alertas.filter((a) => a.estado === "PENDIENTE" && a.categoria === "CRITICO");
  const pulso = resumen.find((r) => r.tipo === "FRECUENCIA_CARDIACA");
  const oxigeno = resumen.find((r) => r.tipo === "SPO2");
  const llamar = personasParaLlamar(vinculos);
  const tomas = tomasDeHoy(medicamentos);
  const pasosRestantes = pasosHoy === null ? null : Math.max(0, META_PASOS - pasosHoy);
  const progresoPasos = pasosHoy === null ? 0 : (pasosHoy / META_PASOS) * 100;
  const progresoSueno = suenoMinutos === null ? 0 : (suenoMinutos / (8 * 60)) * 100;

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
      <main className="mainBody gap-6">
        <Header />
        <div className="mx-auto flex w-full max-w-lg flex-col gap-6 pb-32 text-[#0E1D28]">
          <header className="flex flex-col gap-0.5 px-1">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">Hola, {nombre || "Usuario"}</h1>
            <p className="text-lg leading-6 text-[#435059]">{obtenerFechaActual()}</p>
          </header>

          <section
            id="resumen-hoy"
            aria-labelledby="estado-hoy"
            className={`flex w-full min-w-0 flex-col gap-4 rounded-3xl px-5 py-5 ${alertasPendientes.length === 0 ? "bg-[#E8FAF1]" : "bg-[#FFE9E6]"}`}
          >
            <div className="flex items-center gap-3">
              {alertasPendientes.length === 0 ? (
                <LuShieldCheck aria-hidden="true" className="size-10 shrink-0 text-[#0B6D3C]" />
              ) : (
                <LuTriangleAlert aria-hidden="true" className="size-10 shrink-0 text-[#A92323]" />
              )}
              <h2 id="estado-hoy" className="text-2xl font-bold leading-tight">
                {alertasPendientes.length === 0 ? "Hoy estás bien" : "Hay avisos para revisar"}
              </h2>
            </div>
            <div className={`border-t ${alertasPendientes.length === 0 ? "border-[#BAEDD3]" : "border-[#F2C1BA]"}`} />
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0B5FFF]">
                <LuFootprints aria-hidden="true" className="size-6" />
              </span>
              <p className="text-base font-semibold leading-5">
                {pasosRestantes === null
                  ? "Todavía no hay datos de pasos de hoy."
                  : pasosRestantes > 0
                    ? `Te faltan ${pasosRestantes.toLocaleString("es-AR")} pasos para tu meta.`
                    : "¡Llegaste a tu meta de pasos de hoy!"}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-white/70 pt-2 text-xs leading-4 text-[#435059]">
              <p className="flex items-center gap-1.5">
                <LuWatch aria-hidden="true" className="size-4 shrink-0 text-[#006A61]" />
                {pulsera ? `Pulsera conectada · ${ultimaActualizacion}` : "Sin pulsera conectada"}
              </p>
              {!pulsera && <Link to="/cuenta" className="font-bold text-[#0049CC] underline">Conectar</Link>}
              <p>{incidentes72hs} {incidentes72hs === 1 ? "alerta" : "alertas"} en 72 hs</p>
            </div>
          </section>

          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={pedirAyuda}
              disabled={enviando}
              aria-busy={enviando}
              aria-describedby={errorSOS ? "error-sos" : undefined}
              className="flex min-h-20 w-full cursor-pointer items-center justify-center gap-4 rounded-3xl bg-[#A92323] px-4 py-4 text-center text-white shadow-lg shadow-red-900/20 hover:bg-[#921D1D] active:bg-[#741717] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#741717] disabled:cursor-wait disabled:opacity-70"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#A92323]">
                <RiAlertFill aria-hidden="true" className="size-7" />
              </span>
              <span className="text-2xl font-bold uppercase leading-tight">{enviando ? "Enviando ayuda…" : "Pedir ayuda"}</span>
            </button>
            {errorSOS && <p id="error-sos" role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{errorSOS}</p>}
          </div>

          <div id="avisos-home" className="w-full scroll-mt-24" aria-label="Avisos pendientes">
            <AvisosSalud
              alertas={alertas}
              onRespondida={(id) => setAlertas(alertas.filter((a) => a.id !== id))}
            />
          </div>

          <Link
            to="../medicamentos"
            className="relative flex w-full min-w-0 flex-col gap-4 rounded-3xl bg-white px-5 py-5 shadow-md hover:bg-[#FAFCFF] active:bg-[#F0F5FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
          >
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-2 rounded-l-3xl bg-[#144BD3]" />
            <span className="flex items-center gap-3 pl-1">
              <LuPill aria-hidden="true" className="size-12 shrink-0 rounded-full bg-[#E7EDFB] p-3 text-[#0D328B]" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold uppercase leading-5 tracking-wide text-[#435059]">Tu próxima medicina</span>
                <span className="block text-xl font-bold leading-6">{proxima ? `${proxima.medicamento.nombre} ${proxima.medicamento.dosis}` : (tomas.length === 0 ? "Sin medicación para hoy" : "Ya pasaron las tomas de hoy")}</span>
              </span>
              <MdChevronRight aria-hidden="true" className="size-5 shrink-0 text-[#73808A]" />
            </span>
            <span className="flex items-center gap-2 rounded-2xl bg-[#E7EDFB] px-4 py-3 text-sm font-semibold leading-5 text-[#0D328B]">
              <LuClock3 aria-hidden="true" className="size-5 shrink-0" />
              {proxima ? `Hoy a las ${proxima.horario} hs · ${momentoDelDia(proxima.horario)}` : `${tomas.length} ${tomas.length === 1 ? "toma" : "tomas"} programadas hoy`}
              {proxima && <span className="ml-auto shrink-0 rounded-full bg-white px-2 py-1 text-xs font-bold">{tomas.length} {tomas.length === 1 ? "toma" : "tomas"}</span>}
            </span>
          </Link>

          <section className="flex w-full min-w-0 flex-col gap-3" aria-labelledby="signos-hoy">
            <h2 id="signos-hoy" className="px-1 text-2xl font-bold leading-7">Mis signos de hoy</h2>
            <div className="grid grid-cols-2 gap-2">
              <SignoCircular
                etiqueta="Corazón"
                valor={pulso ? String(Math.round(pulso.ultimoValor)) : "—"}
                detalle="lpm"
                progreso={pulso?.ultimoValor ?? 0}
                destino="../signos/pulso"
              />
              <SignoCircular
                etiqueta="Oxígeno"
                valor={oxigeno ? String(Math.round(oxigeno.ultimoValor)) : "—"}
                detalle="%"
                progreso={oxigeno?.ultimoValor ?? 0}
                destino="../signos/oxigeno"
              />
              <SignoCircular
                etiqueta="Pasos"
                valor={pasosHoy !== null ? pasosHoy.toLocaleString("es-AR") : "—"}
                detalle=""
                progreso={progresoPasos}
                destino="../signos/pasos"
              />
              <SignoCircular
                etiqueta="Descanso"
                valor={suenoMinutos !== null ? horasYMinutos(suenoMinutos) : "—"}
                detalle={suenoMinutos !== null ? "anoche" : "sin datos"}
                progreso={progresoSueno}
                destino="../signos/sueno"
              />
            </div>
            <Link
              to="../signos"
              className="flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl bg-[#E7EDFB] px-4 py-3 text-sm font-bold text-[#0D328B] hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
            >
              Ver todos mis signos
              <LuArrowRight aria-hidden="true" className="size-5" />
            </Link>
          </section>

          <section className="flex w-full min-w-0 flex-col gap-3 rounded-3xl bg-white p-4 shadow-md" aria-labelledby="ficha-consulta">
            <h2 id="ficha-consulta" className="flex items-center gap-2 px-1 text-xl font-bold leading-6">
              <MdOutlineDescription aria-hidden="true" className="size-5 shrink-0 text-[#0B5FFF]" />
              Mi ficha de consulta
            </h2>
            <div className="flex flex-col gap-2">
              <Link to="../salud" className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl bg-[#E7EDFB] px-3 py-2.5 hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]">
                <span className="flex min-w-0 items-center gap-3">
                  <MdOutlineInfo aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-[#D4E4F3] p-2.5 text-[#0B5FFF]" />
                  <span className="text-sm font-bold leading-5">Mi información médica</span>
                </span>
                <MdChevronRight aria-hidden="true" className="size-5 shrink-0 text-[#73808A]" />
              </Link>
              <Link to="../codigo" className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl bg-[#E7EDFB] px-3 py-2.5 hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]">
                <span className="flex min-w-0 items-center gap-3">
                  <LuQrCode aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-[#D4E4F3] p-2.5 text-[#0B5FFF]" />
                  <span className="text-sm font-bold leading-5">Código de emergencia</span>
                </span>
                <MdChevronRight aria-hidden="true" className="size-5 shrink-0 text-[#73808A]" />
              </Link>
              <Link to="../cuidados" className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl bg-[#E7EDFB] px-3 py-2.5 hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]">
                <span className="flex min-w-0 items-center gap-3">
                  <MdOutlineVolunteerActivism aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-[#D4E4F3] p-2.5 text-[#0B5FFF]" />
                  <span className="text-sm font-bold leading-5">Mis voluntades y cuidados</span>
                </span>
                <MdChevronRight aria-hidden="true" className="size-5 shrink-0 text-[#73808A]" />
              </Link>
              <Link to="../ayuda" className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl bg-[#E7EDFB] px-3 py-2.5 hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]">
                <span className="flex min-w-0 items-center gap-3">
                  <MdOutlineSupportAgent aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-[#D4E4F3] p-2.5 text-[#0B5FFF]" />
                  <span className="text-sm font-bold leading-5">Ayuda y soporte</span>
                </span>
                <MdChevronRight aria-hidden="true" className="size-5 shrink-0 text-[#73808A]" />
              </Link>
            </div>
          </section>

          {llamar.length > 0 && (
            <section className="flex w-full flex-col gap-2 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="llamadas-rapidas">
              <h2 id="llamadas-rapidas" className="text-base font-bold">Contactos rápidos</h2>
              <div className="grid grid-cols-2 gap-2">
                {llamar.map((vinculo) => (
                  <a key={vinculo.id} href={`tel:${vinculo.familiar.telefono}`} className="flex min-h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#EBF5FF] px-2 py-2 text-sm font-semibold text-[#0B5FFF] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]">
                    <LuPhone aria-hidden="true" className="size-4 shrink-0" />
                    <span className="truncate">Llamar a {vinculo.familiar.nombreCompleto.split(" ")[0]}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    );
  }
