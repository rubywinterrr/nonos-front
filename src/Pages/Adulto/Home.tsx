import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { alertasService, type Alerta } from "../../services/alertasService";
import { dispositivosService, type Dispositivo } from "../../services/dispositivosService";
import { medicionesService, type ResumenMedicion } from "../../services/medicionesService";
import { medicamentosService, type Medicamento } from "../../services/medicamentosService";
import { RiAlertFill } from "react-icons/ri";
import { LuArrowRight, LuCheck, LuClock3, LuFootprints, LuPill, LuQrCode, LuShieldCheck, LuTriangleAlert } from "react-icons/lu";
import { MdChevronRight, MdOutlineDescription, MdOutlineInfo, MdOutlineVolunteerActivism } from "react-icons/md";
import obtenerFechaActual from "../../utils/obtenerFechaActual";
import AvisosSalud from "../../components/AvisosSalud";
import tiempoDesde from "../../utils/tiempoDesde";
import { tomasDeHoy, proximaToma, momentoDelDia } from "../../utils/tomasDeHoy";

const SETENTA_Y_DOS_HORAS = 72 * 60 * 60 * 1000;
const META_PASOS = 3000;

interface SignoCardProps {
  etiqueta: string;
  valor: string;
  detalle: string;
  estado?: string;
  progreso?: number;
  destino: string;
}

function SignoCard({ etiqueta, valor, detalle, estado, progreso = 0, destino }: SignoCardProps) {
  const progresoSeguro = Math.max(0, Math.min(100, progreso));

  return (
    <Link
      to={destino}
      className="flex min-w-0 cursor-pointer flex-col gap-2 rounded-3xl bg-white px-4 py-4 shadow-md transition-colors hover:bg-[#F8FBFF] active:bg-[#EEF4FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
    >
      <span className="text-lg font-bold leading-6 text-[#16222C]">{etiqueta}</span>
      <span className="flex min-w-0 flex-wrap items-end gap-1">
        <span className="break-all text-4xl font-bold leading-10 text-[#16222C]">{valor}</span>
        {detalle && <span className="text-base leading-6 text-[#435059]">{detalle}</span>}
      </span>
      {estado ? (
        <span className="flex items-center gap-1.5 text-sm leading-5 text-[#435059]">
          <LuCheck aria-hidden="true" className="size-4 shrink-0 text-[#006A61]" />{estado}
        </span>
      ) : (
        <span
          role="progressbar"
          aria-label={`Progreso de ${etiqueta}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progresoSeguro}
          className="flex h-3.5 w-full overflow-hidden rounded-full bg-[#E7EDFB]"
        >
          <span aria-hidden="true" className="h-full rounded-full bg-[#144BD3] transition-[width] duration-500" style={{ width: `${progresoSeguro}%` }} />
        </span>
      )}
    </Link>
  );
}

function fraseMedicacion(horario: string) {
  const momento = momentoDelDia(horario);
  if (momento === "Mañana") return "antes del desayuno";
  if (momento === "Tarde") return "por la tarde";
  return "luego de la cena";
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
  const tomas = tomasDeHoy(medicamentos);
  const pasosRestantes = pasosHoy === null ? null : Math.max(0, META_PASOS - pasosHoy);
  const progresoPasos = pasosHoy === null ? 0 : (pasosHoy / META_PASOS) * 100;
  const progresoSueno = suenoMinutos === null ? 0 : (suenoMinutos / (8 * 60)) * 100;

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
    <main id="contenido-principal" tabIndex={-1} className="mainBody gap-6">
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
              <LuShieldCheck aria-hidden="true" className="size-9 shrink-0 text-[#0B6D3C]" />
            ) : (
              <LuTriangleAlert aria-hidden="true" className="size-9 shrink-0 text-[#A92323]" />
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
          <p className="sr-only" aria-live="polite">
            {pulsera
              ? `Pulsera conectada. ${pulsera.ultimaSincronizacion ? `Sincronizada ${tiempoDesde(pulsera.ultimaSincronizacion)}` : "Todavía no se sincronizó"}${pulsera.requiereReautenticacion ? ". Hay que volver a conectarla desde Mi cuenta" : ""}.`
              : "No hay una pulsera conectada."}
          </p>
          <p className="sr-only">{incidentes72hs} {incidentes72hs === 1 ? "alerta" : "alertas"} registradas en las últimas 72 horas.</p>
        </section>

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={pedirAyuda}
            disabled={enviando}
            aria-busy={enviando}
            aria-describedby={errorSOS ? "error-sos" : undefined}
            className="flex min-h-20 w-full cursor-pointer items-center justify-center gap-4 rounded-3xl bg-[#A92323] px-4 py-4 text-center text-white shadow-lg shadow-red-900/20 transition-colors hover:bg-[#921D1D] active:bg-[#741717] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#741717] disabled:cursor-wait disabled:opacity-70"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#A92323]">
              <RiAlertFill aria-hidden="true" className="size-7" />
            </span>
            <span className="text-2xl font-bold uppercase leading-tight">{enviando ? "Enviando ayuda…" : "Pedir ayuda"}</span>
          </button>
          {errorSOS && <p id="error-sos" role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{errorSOS}</p>}
        </div>

        <section id="avisos-home" className="w-full" aria-label="Avisos pendientes">
          <AvisosSalud alertas={alertas} onRespondida={(id) => setAlertas((actuales) => actuales.filter((a) => a.id !== id))} />
        </section>

        <Link
          to="../medicamentos"
          className="relative flex w-full min-w-0 flex-col gap-4 rounded-3xl bg-white px-5 py-5 shadow-md transition-colors hover:bg-[#FAFCFF] active:bg-[#F0F5FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
        >
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-2 rounded-l-3xl bg-[#144BD3]" />
          <span className="flex items-center gap-3 pl-1">
            <LuPill aria-hidden="true" className="size-12 shrink-0 rounded-full bg-[#E7EDFB] p-3 text-[#0D328B]" />
            <span className="min-w-0 flex-1">
              <span className="block text-base font-bold uppercase leading-5 tracking-wide text-[#435059]">Tu próxima medicina</span>
              <span className="block text-xl font-bold leading-6">
                {proxima ? `${proxima.medicamento.nombre} ${proxima.medicamento.dosis}` : (tomas.length === 0 ? "Sin medicación para hoy" : "Ya pasaron las tomas de hoy")}
              </span>
            </span>
            <MdChevronRight aria-hidden="true" className="size-6 shrink-0 text-[#73808A]" />
          </span>
          <span className="flex items-center gap-2 rounded-2xl bg-[#E7EDFB] px-4 py-3 text-base font-bold leading-5 text-[#0D328B]">
            <LuClock3 aria-hidden="true" className="size-5 shrink-0" />
            {proxima ? `Hoy a las ${proxima.horario} hs, ${fraseMedicacion(proxima.horario)}` : `${tomas.length} ${tomas.length === 1 ? "toma" : "tomas"} programadas hoy`}
          </span>
        </Link>

        <section className="flex w-full min-w-0 flex-col gap-3.5" aria-labelledby="signos-hoy">
          <h2 id="signos-hoy" className="px-1 text-2xl font-bold leading-7">Mis signos de hoy</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <SignoCard
              etiqueta="Corazón"
              valor={pulso ? String(Math.round(pulso.ultimoValor)) : "—"}
              detalle="lpm"
              estado={pulso ? (alertas.some((alerta) => alerta.estado === "PENDIENTE" && (alerta.tipo === "FC_ELEVADA" || alerta.tipo === "FC_BAJA")) ? "Revisar aviso" : "Lo habitual") : "Sin datos"}
              destino="../signos/pulso"
            />
            <SignoCard
              etiqueta="Oxígeno"
              valor={oxigeno ? String(Math.round(oxigeno.ultimoValor)) : "—"}
              detalle="%"
              estado={oxigeno ? (alertas.some((alerta) => alerta.estado === "PENDIENTE" && alerta.tipo === "SP02_BAJO") ? "Revisar aviso" : "Lo habitual") : "Sin datos"}
              destino="../signos/oxigeno"
            />
            <SignoCard
              etiqueta="Pasos"
              valor={pasosHoy !== null ? pasosHoy.toLocaleString("es-AR") : "—"}
              detalle=""
              progreso={progresoPasos}
              destino="../signos/pasos"
            />
            <SignoCard
              etiqueta="Descanso"
              valor={suenoMinutos !== null ? `${Math.floor(suenoMinutos / 60)} h ${Math.round(suenoMinutos % 60)}` : "—"}
              detalle=""
              progreso={progresoSueno}
              destino="../signos/sueno"
            />
          </div>
          <Link
            to="../signos"
            className="flex min-h-14 w-full cursor-pointer items-center justify-between rounded-2xl border border-[#B7C8F0] bg-[#E7EDFB] px-5 py-3 text-lg font-bold text-[#0D328B] transition-colors hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
          >
            Ver todos mis signos <LuArrowRight aria-hidden="true" className="size-6" />
          </Link>
        </section>

        <section className="flex w-full min-w-0 flex-col gap-3.5 rounded-3xl bg-white p-5 shadow-md" aria-labelledby="ficha-consulta">
          <h2 id="ficha-consulta" className="flex items-center gap-3 text-2xl font-bold leading-7">
            <MdOutlineDescription aria-hidden="true" className="size-6 shrink-0 text-[#0B5FFF]" />
            Mi ficha de consulta
          </h2>
          <div className="flex flex-col gap-2.5">
            <Link to="../salud" className="flex min-h-18 w-full items-center justify-between gap-3 rounded-xl bg-[#E7EDFB] p-3.5 transition-colors hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]">
              <span className="flex min-w-0 items-center gap-3.5">
                <MdOutlineInfo aria-hidden="true" className="size-11 shrink-0 rounded-xl bg-white p-2.5 text-[#0B5FFF]" />
                <span className="text-lg font-bold leading-6">Mi información médica</span>
              </span>
              <MdChevronRight aria-hidden="true" className="size-6 shrink-0 text-[#73808A]" />
            </Link>
            <Link to="../codigo" className="flex min-h-18 w-full items-center justify-between gap-3 rounded-xl bg-[#E7EDFB] p-3.5 transition-colors hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]">
              <span className="flex min-w-0 items-center gap-3.5">
                <LuQrCode aria-hidden="true" className="size-11 shrink-0 rounded-xl bg-white p-2.5 text-[#0B5FFF]" />
                <span className="text-lg font-bold leading-6">Código de emergencia</span>
              </span>
              <MdChevronRight aria-hidden="true" className="size-6 shrink-0 text-[#73808A]" />
            </Link>
            <Link to="../cuidados" className="flex min-h-18 w-full items-center justify-between gap-3 rounded-xl bg-[#E7EDFB] p-3.5 transition-colors hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]">
              <span className="flex min-w-0 items-center gap-3.5">
                <MdOutlineVolunteerActivism aria-hidden="true" className="size-11 shrink-0 rounded-xl bg-white p-2.5 text-[#0B5FFF]" />
                <span className="text-lg font-bold leading-6">Mis voluntades y cuidados</span>
              </span>
              <MdChevronRight aria-hidden="true" className="size-6 shrink-0 text-[#73808A]" />
            </Link>
          </div>
        </section>
      </div>
    </main>
    );
  }
