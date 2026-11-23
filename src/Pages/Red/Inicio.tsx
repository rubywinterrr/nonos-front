import { useEffect, useRef, useState } from "react";
import InvitacionesPendientes from "../../components/InvitacionesPendientes";
import obtenerFechaActual, { obtenerDiaActual } from "../../utils/obtenerFechaActual";
import { Link } from "react-router-dom";
import { LuActivity, LuHeartPulse, LuWatch } from "react-icons/lu";
import { TbLungs } from "react-icons/tb";
import { RiAlertFill } from "react-icons/ri";
import { useAuth } from "../../hooks/useAuth";
import { alertasService, type Alerta } from "../../services/alertasService";
import { dispositivosService, type Dispositivo } from "../../services/dispositivosService";
import { medicionesService, type ResumenMedicion } from "../../services/medicionesService";
import { medicamentosService, type Medicamento } from "../../services/medicamentosService";
import { usuarioService, type AdultoMayorVinculado, type Vinculo } from "../../services/usuariosService";
import { guardarAdultoSeleccionado, leerAdultoSeleccionado, resolverAdultoVinculado } from "../../utils/adultoQueSeMira";
import calcularEdad from "../../utils/calcularEdad";
import tiempoDesde from "../../utils/tiempoDesde";
import { tomasDeHoy, proximaToma, momentoDelDia, yaPaso } from "../../utils/tomasDeHoy";
import ActivarAvisos from "../../components/ActivarAvisos";
import LinkAvisos from "../../components/LinkAvisos";
import AccesosRed from "../../components/AccesosRed";
import { horasYMinutos } from "../../utils/formatoSignos";
import minutosDespierto from "../../utils/minutosDespierto";
import CartelSOS from "../../components/CartelSOS";
import { MenuInicioRed, ResumenInicioRed } from "./InicioEscritorio";
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
  MdOutlineMedicalInformation,
  MdOutlineMedication,
  MdOutlinePhone,
  MdOutlineSchedule,
  MdOutlineVolunteerActivism,
  MdPerson,
  MdQrCode2,
} from "react-icons/md";

const SETENTA_Y_DOS_HORAS = 72 * 60 * 60 * 1000;

interface DatosAdulto {
  alertas: Alerta[] | null;
  alertas72hs: number | null;
  pulsera: Dispositivo | null;
  resumen: ResumenMedicion[];
  pasosHoy: number | null;
  suenoMinutos: number | null;
  suenoDespierto: number | null;
  medicamentos: Medicamento[] | null;
  tomasDelDia: { hechas: number; total: number } | null;
  vinculos: Vinculo[];
}

const DATOS_VACIOS: DatosAdulto = {
  alertas: null,
  alertas72hs: null,
  pulsera: null,
  resumen: [],
  pasosHoy: null,
  suenoMinutos: null,
  suenoDespierto: null,
  medicamentos: null,
  tomasDelDia: null,
  vinculos: [],
};

// la otra persona para el segundo botón de llamar: alguien de la red del adulto (que no sea yo) con teléfono,
// primero los contactos de emergencia
function otraPersonaParaLlamar(vinculos: Vinculo[], miId: string) {
  const conTelefono = vinculos.filter((v) => v.familiarId !== miId && v.familiar.telefono);
  const deEmergencia = conTelefono.find((v) => v.esContactoEmergencia);
  if (deEmergencia) return deEmergencia;
  if (conTelefono.length > 0) return conTelefono[0];
  return null;
}

// Inicio de la red: muestra los datos del adulto seleccionado.
export default function InicioRed() {
  const { usuario } = useAuth();
  const usuarioId = usuario?.id;
  const esCuidador = usuario?.rol === "CUIDADOR";
  const [adultos, setAdultos] = useState<AdultoMayorVinculado[]>([]);
  const [adultoElegido, setAdultoElegido] = useState(() => leerAdultoSeleccionado(usuarioId));
  const [datos, setDatos] = useState<{ adultoId: string; valores: DatosAdulto } | null>(null);
  const [cargando, setCargando] = useState(true);
  // se suma 1 cuando se acepta una invitación, para volver a cargar todo
  const [recargar, setRecargar] = useState(0);
  const selectorAdultos = useRef<HTMLDetailsElement>(null);

  const adulto = resolverAdultoVinculado(adultos, adultoElegido);
  const adultoId = adulto?.id;

  function elegirAdulto(id: string) {
    if (!usuarioId) return;
    guardarAdultoSeleccionado(usuarioId, id);
    setAdultoElegido(id);
  }

  function abrirSelectorAdultos() {
    const selector = selectorAdultos.current;
    if (!selector) return;
    selector.open = true;
    selector.querySelector("summary")?.focus();
  }

  useEffect(() => {
    if (!usuarioId) return;
    let activo = true;
    const cargarAdultos = async () => {
      try {
        const vinculados = await usuarioService.getAdultosMayoresVinculados(usuarioId);
        if (activo) setAdultos(vinculados);
      } catch (err) {
        console.error(err);
      } finally {
        if (activo) setCargando(false);
      }
    };
    void cargarAdultos();
    const intervalo = setInterval(cargarAdultos, 60 * 1000);
    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, [usuarioId, recargar]);

  useEffect(() => {
    if (!adultoId) return;
    let activo = true;
    let consultando = false;

    const cargarParte = async (consulta: Promise<Partial<DatosAdulto>>) => {
      try {
        const parte = await consulta;
        if (!activo) return;
        setDatos((anteriores) => ({
          adultoId,
          valores: {
            ...(anteriores?.adultoId === adultoId ? anteriores.valores : DATOS_VACIOS),
            ...parte,
          },
        }));
      } catch (err) {
        console.error(err);
      }
    };

    const cargar = async () => {
      if (consultando) return;
      consultando = true;
      const inicioDelDia = new Date();
      inicioDelDia.setHours(0, 0, 0, 0);
      const ahora = Date.now();
      const hace24hs = new Date(ahora - 24 * 60 * 60 * 1000);

      await Promise.all([
        cargarParte(alertasService.getAlertas(adultoId).then((alertas) => ({
          alertas,
          alertas72hs: alertas.filter((alerta) => ahora - new Date(alerta.createdAt).getTime() <= SETENTA_Y_DOS_HORAS).length,
        }))),
        cargarParte(dispositivosService.getDispositivos(adultoId).then((dispositivos) => ({
          pulsera: dispositivos.find((dispositivo) => dispositivo.tipo === "FITBIT_AIR") ?? null,
        }))),
        cargarParte(medicionesService.getResumen(adultoId).then((resumen) => ({ resumen }))),
        cargarParte(medicionesService.getMediciones(adultoId, "PASOS", inicioDelDia.toISOString()).then((pasos) => ({
          pasosHoy: pasos.reduce((total, medicion) => total + medicion.valor, 0),
        }))),
        cargarParte(medicionesService.getMediciones(adultoId, "SUENO", hace24hs.toISOString()).then(([sueno]) => ({
          suenoMinutos: sueno?.valor ?? null,
          suenoDespierto: sueno ? minutosDespierto(sueno) : null,
        }))),
        cargarParte(medicamentosService.getMedicamentos(adultoId).then((medicamentos) => ({ medicamentos }))),
        cargarParte(medicamentosService.getTomasDelDia(adultoId).then((tomasDelDia) => ({ tomasDelDia }))),
        cargarParte(usuarioService.getVinculos(adultoId).then((vinculos) => ({ vinculos }))),
      ]);
      consultando = false;
    };

    void cargar();
    const intervalo = setInterval(cargar, 60 * 1000);
    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, [adultoId, recargar]);

  // ---------- datos calculados ----------
  const datosAdulto = datos && datos.adultoId === adultoId ? datos.valores : DATOS_VACIOS;
  const { alertas, alertas72hs, pulsera, resumen, pasosHoy, suenoMinutos, suenoDespierto, medicamentos, tomasDelDia, vinculos } = datosAdulto;
  const nombre = usuario ? usuario.nombreCompleto.trim().split(" ")[0] : "";
  const pendientes = alertas?.filter((a) => a.estado === "PENDIENTE") ?? [];
  const hayAlertaPendiente = pendientes.some((a) => a.categoria === "CRITICO");
  const pulso = resumen.find((r) => r.tipo === "FRECUENCIA_CARDIACA");
  const oxigeno = resumen.find((r) => r.tipo === "SPO2");
  const tomas = tomasDeHoy(medicamentos ?? []);
  const proxima = proximaToma(tomas);
  const tomasRutina = tomasDelDia ?? (medicamentos !== null ? {
    hechas: tomas.filter((toma) => yaPaso(toma.horario)).length,
    total: tomas.length,
  } : null);
  const otraPersona = usuario ? otraPersonaParaLlamar(vinculos, usuario.id) : null;
  const estadoPulsera = pulsera?.requiereReautenticacion
    ? "Pulsera por reconectar"
    : pulsera ? "Pulsera conectada" : "Sin pulsera conectada";

  let textoSincronizado = "Todavía no se sincronizó";
  if (pulsera?.ultimaSincronizacion) textoSincronizado = `Sincronizado ${tiempoDesde(pulsera.ultimaSincronizacion)}`;
  if (pulsera?.requiereReautenticacion) textoSincronizado = "Hay que volver a conectarla desde la cuenta del adulto";

  return (
    <main id="contenido-principal" tabIndex={-1} className="mainBody">
      <div className="contents lg:block lg:min-h-dvh lg:w-full lg:pl-(--ancho-menu-inicio) lg:[--ancho-menu-inicio:--spacing(52)] xl:[--ancho-menu-inicio:--spacing(64)] 2xl:[--ancho-menu-inicio:--spacing(72)]">
        <MenuInicioRed
          usuario={usuario}
          adulto={adulto}
          adultos={adultos}
          cargando={cargando}
          estadoPulsera={estadoPulsera}
          selector={selectorAdultos}
          abrirSelector={abrirSelectorAdultos}
          elegirAdulto={elegirAdulto}
        />
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-32 pt-6 lg:max-w-none lg:gap-5 lg:p-6 lg:text-[#16222c] xl:p-8 2xl:gap-6 2xl:p-14">
          <div className="flex flex-col gap-0.5 lg:pr-28">
            <h1 className="text-2xl font-bold leading-9 tracking-tight lg:text-4xl lg:leading-tight">Hola, {nombre}</h1>
            <p className="text-base leading-relaxed text-[#424656] lg:order-first lg:text-sm lg:font-bold lg:tracking-wide lg:text-[#1550e0] lg:uppercase">{obtenerFechaActual()}</p>
            {adulto && <p className="hidden text-base text-[#54646f] lg:block">Un resumen de cómo está {adulto.nombreCompleto.trim().split(/\s+/)[0]} hoy.</p>}
          </div>

          {/* agregado: cartel si el adulto apretó SOS y sigue pendiente */}
          {adulto && alertas && <CartelSOS nombreAdulto={adulto.nombreCompleto} alertas={alertas} />}
          <InvitacionesPendientes onAceptada={() => setRecargar((anterior) => anterior + 1)} />
          {/* agregado (no está en el Figma): activar los avisos push y ver los recibidos */}
          <ActivarAvisos />

          {cargando && <p role="status" className="text-center text-[#424656] lg:hidden">Cargando…</p>}
          {!cargando && !adulto && (
            <p className="rounded-2xl bg-white p-4 text-base lg:hidden">Todavía no estás vinculado a ningún adulto mayor.</p>
          )}

          <ResumenInicioRed
            adulto={adulto}
            abrirSelector={adultos.length > 1 ? abrirSelectorAdultos : undefined}
            estadoPulsera={estadoPulsera}
            sincronizacion={pulsera ? textoSincronizado : undefined}
            estadoAlerta={hayAlertaPendiente ? "pendiente" : alertas ? "estable" : "sin-datos"}
            alertas72hs={alertas72hs}
            pulso={pulso ? Math.round(pulso.ultimoValor) : null}
            oxigeno={oxigeno ? Math.round(oxigeno.ultimoValor) : null}
            detalleOxigeno={oxigeno ? `Medido ${tiempoDesde(oxigeno.ultimaMedicion)}` : undefined}
            pasos={pasosHoy}
            descanso={suenoMinutos !== null ? horasYMinutos(suenoMinutos) : null}
            detalleDescanso={suenoDespierto === null ? undefined : suenoDespierto === 0 ? "Sin interrupciones" : `Despierto ${horasYMinutos(suenoDespierto)}`}
            proxima={proxima}
            tomas={tomasRutina}
            estadoMedicacion={medicamentos === null ? "Sin datos de medicación" : tomas.length === 0 ? "Sin medicación para hoy" : "Ya pasaron las tomas de hoy"}
            contacto={otraPersona?.familiar.telefono ? { nombre: otraPersona.familiar.nombreCompleto, telefono: otraPersona.familiar.telefono } : null}
          />

          {adulto && (
            <>
              <section className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs lg:hidden" aria-labelledby="persona-vinculada">
                <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-3">
                  <div className="flex items-center gap-3">
                    {adulto.fotoUrl ? (
                      <img src={adulto.fotoUrl} alt="" className="size-12 shrink-0 rounded-full bg-[#D4E4F3] object-cover" />
                    ) : (
                      <MdPerson aria-hidden="true" className="size-12 shrink-0 rounded-full bg-[#D4E4F3] p-2 text-[#424656]" />
                    )}
                    <div>
                      <h2 id="persona-vinculada" className="text-lg font-bold leading-snug sm:text-xl">{adulto.nombreCompleto}</h2>
                      {/* PENDIENTE BACK: falta un campo con qué es el adulto para el familiar ("Papá") para mostrar como en el diseño.
                          El parentesco del vínculo es el familiar visto desde el adulto ("Hijo"), así que acá va solo la edad */}
                      {adulto.fechaNacimiento && (
                        <p className="text-sm font-semibold leading-normal tracking-wide text-[#424656]">
                          {calcularEdad(adulto.fechaNacimiento)} años
                        </p>
                      )}
                    </div>
                  </div>
                  {hayAlertaPendiente ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#FFDBD2] px-2 py-1 text-xs font-bold leading-normal tracking-wide text-[#AD2B00] sm:px-2.5">
                      <RiAlertFill aria-hidden="true" className="size-4 shrink-0 text-[#AD2B00]" />
                      ALERTA PENDIENTE
                    </span>
                  ) : (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#84F6E6]/40 px-2 py-1 text-xs font-bold leading-normal tracking-wide text-[#006A61] sm:px-2.5">
                      <MdCheckCircleOutline aria-hidden="true" className="size-4 shrink-0 text-[#006A61]" />
                      TODO EN ORDEN
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
                      <span className="flex items-center gap-1.5 rounded-md bg-white px-2 py-0.5 text-sm font-bold leading-normal tracking-wide text-[#006A61]">
                        <span className="size-2.5 rounded-full bg-[#006A61]" aria-hidden="true" />
                        En vivo
                      </span>
                    )}
                  </div>
                  {pulsera && <p className="text-xs leading-relaxed text-[#424656]">{textoSincronizado}</p>}
                </div>

                <div className="grid w-full grid-cols-2 gap-3.5">
                  {adulto.telefono && (
                    <a href={`tel:${adulto.telefono}`} className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-[#EBF5FF] px-1.5 py-2 text-sm font-semibold leading-5 text-[#0B5FFF] sm:px-2 sm:text-base cursor-pointer hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
                      <MdOutlinePhone aria-hidden="true" className="size-4 shrink-0 text-[#0B5FFF]" />
                      <span>Llamar a {adulto.nombreCompleto.split(" ")[0]}</span>
                    </a>
                  )}
                  {otraPersona && (
                    <a href={`tel:${otraPersona.familiar.telefono}`} className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-[#EBF5FF] px-1.5 py-2 text-sm font-semibold leading-5 text-[#0B5FFF] sm:px-2 sm:text-base cursor-pointer hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
                      <MdOutlinePhone aria-hidden="true" className="size-4 shrink-0 text-[#0B5FFF]" />
                      <span>Llamar a {otraPersona.familiar.nombreCompleto.split(" ")[0]}</span>
                    </a>
                  )}
                </div>
              </section>

              <section className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs lg:hidden" aria-labelledby="supervision-medica">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
                  <h2 id="supervision-medica" className="flex items-center gap-2 text-lg font-bold leading-normal sm:text-xl">
                    <LuActivity aria-hidden="true" className="size-6 shrink-0 text-[#0049CC]" />
                    Supervisión Médica
                  </h2>
                  {hayAlertaPendiente ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#FFDBD2] px-2.5 py-1 text-xs font-bold leading-normal tracking-wider text-[#AD2B00]">
                      <RiAlertFill aria-hidden="true" className="size-4 shrink-0 text-[#AD2B00]" />
                      REVISAR
                    </span>
                  ) : (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#84F6E6]/40 px-2.5 py-1 text-xs font-bold leading-normal tracking-wider text-[#006A61]">
                      <MdOutlineHealthAndSafety aria-hidden="true" className="size-4 shrink-0 text-[#006A61]" />
                      ESTABLE
                    </span>
                  )}
                </div>

                <dl className="grid grid-cols-2 gap-2 pt-1">
                  <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
                    <dt className="flex items-center justify-between gap-1">
                      <span className="text-xs leading-relaxed text-[#424656]">Pulso</span>
                      <MdFavorite aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#FFDBD2] text-[#AD2B00]" />
                    </dt>
                    <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-relaxed">{pulso ? Math.round(pulso.ultimoValor) : "—"}
                      <span className="text-sm font-semibold leading-normal tracking-wide text-[#424656]">lpm</span>
                    </dd>
                    <dd className="flex items-center gap-1 text-xs leading-normal font-semibold text-[#006A61]">
                      <MdCheck aria-hidden="true" className="size-3 shrink-0" />
                      <span>Reposo (60-100)</span>
                    </dd>
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
                    <dt className="flex items-center justify-between gap-1">
                      <span className="text-xs leading-relaxed text-[#424656]">Oxígeno</span>
                      {esCuidador ? (
                        <LuHeartPulse aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#DAEAF9] text-[#0B5FFF]" />
                      ) : (
                        <TbLungs aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#DAEAF9] text-[#0B5FFF]" />
                      )}
                    </dt>
                    <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-relaxed">{oxigeno ? `${Math.round(oxigeno.ultimoValor)}%` : "—"}
                    </dd>
                    <dd className="flex items-center gap-1 text-xs leading-normal text-[#424656]">
                      <MdOutlineSchedule aria-hidden="true" className="size-3 shrink-0" />
                      <span>{esCuidador ? "Normal (95-100%)" : oxigeno ? `Medido ${tiempoDesde(oxigeno.ultimaMedicion)}` : "Sin datos de hoy"}</span>
                    </dd>
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
                    <dt className="flex items-center justify-between gap-1">
                      <span className="text-xs leading-relaxed text-[#424656]">Movilidad</span>
                      <MdDirectionsWalk aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#84F6E6]/40 text-[#006A61]" />
                    </dt>
                    <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-relaxed">{pasosHoy !== null ? pasosHoy.toLocaleString("es-AR") : "—"}
                      <span className="text-sm font-semibold leading-normal tracking-wide text-[#424656]">pasos</span>
                    </dd>
                    {/* PENDIENTE BACK: no hay dato de en qué momento caminó; el diseño mostraba "Paseo matutino" */}
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
                    <dt className="flex items-center justify-between gap-1">
                      <span className="text-xs leading-relaxed text-[#424656]">Descanso</span>
                      <MdOutlineBedtime aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#DBE1FF] text-[#0B5FFF]" />
                    </dt>
                    <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-relaxed">{suenoMinutos !== null ? horasYMinutos(suenoMinutos) : "—"}
                    </dd>
                    {/* sale de las etapas del sueño (metadata.etapas); si la pulsera no las mandó, no se muestra nada */}
                    {suenoMinutos !== null && suenoDespierto === 0 && (
                      <dd className="flex items-center gap-1 text-xs leading-normal font-semibold text-[#006A61]">
                        <MdCheck aria-hidden="true" className="size-3 shrink-0" />
                        <span>Sin interrupciones</span>
                      </dd>
                    )}
                    {suenoMinutos !== null && suenoDespierto !== null && suenoDespierto > 0 && (
                      <dd className="flex items-center gap-1 text-xs leading-normal text-[#424656]">
                        <MdOutlineBedtime aria-hidden="true" className="size-3 shrink-0" />
                        <span>Despierto {horasYMinutos(suenoDespierto)}</span>
                      </dd>
                    )}
                  </div>
                </dl>

                <Link to="../signos" className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#EBF5FF] px-4 py-2.5 text-lg font-bold leading-6 tracking-normal text-[#0049CC] cursor-pointer hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
                  Ver signos específicos
                  <MdArrowForward aria-hidden="true" className="size-4 shrink-0 text-[#0049CC]" />
                </Link>
              </section>

              <section className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs lg:hidden" aria-labelledby="rutina-hoy">
                <div className="flex items-center justify-between gap-2">
                  <h2 id="rutina-hoy" className="flex items-center gap-2 text-xl font-bold leading-normal">
                    <MdOutlineCalendarToday aria-hidden="true" className="size-5 shrink-0 text-[#0B5FFF]" />
                    Rutina de hoy
                  </h2>
                  <span className="text-sm font-semibold leading-normal tracking-wide text-[#424656]">{obtenerDiaActual()}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-3 rounded-xl bg-[#EBF5FF] p-3 sm:p-3.5">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <MdOutlineMedication aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-white p-3 text-[#0B5FFF] shadow-xs" />
                    <div>
                      {proxima ? (
                        <>
                          <h3 className="text-base font-bold leading-relaxed">{proxima.medicamento.nombre} {proxima.medicamento.dosis}</h3>
                          <p className="text-xs leading-relaxed text-[#424656]">Próxima: {proxima.horario} hs ({momentoDelDia(proxima.horario)})</p>
                        </>
                      ) : (
                        <h3 className="text-base font-bold leading-relaxed">{tomas.length === 0 ? "Sin medicación para hoy" : "Ya pasaron las tomas de hoy"}</h3>
                      )}
                    </div>
                  </div>
                  {/* cuenta los horarios que ya pasaron: el back no registra si la toma se hizo */}
                  {tomasDelDia && tomasDelDia.total > 0 && (
                    <span className="shrink-0 rounded-full bg-[#84F6E6]/40 px-2 py-1 text-xs font-bold leading-normal text-[#006A61] sm:px-2.5">{tomasDelDia.hechas} de {tomasDelDia.total} tomas</span>
                  )}
                </div>

                <p className="text-sm font-semibold leading-normal text-[#424656]">{alertas72hs ?? 0} {alertas72hs === 1 ? "alerta" : "alertas"} en las últimas 72 hs</p>
              </section>
            </>
          )}

          <section className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs lg:hidden" aria-labelledby="ficha-consulta">
            <h2 id="ficha-consulta" className="flex items-center gap-2 text-xl font-bold leading-normal">
              <MdOutlineDescription aria-hidden="true" className="size-5 shrink-0 text-[#0B5FFF]" />
              Ficha de consulta
            </h2>
            <p className="text-sm font-semibold leading-normal tracking-wide text-[#424656]">Para guardia / SAME</p>
            <div className="flex flex-col gap-2">
              <Link to={"../info/adulto"} type="button" className="flex w-full items-center justify-between gap-3 rounded-xl p-3.5 text-left bg-[#EBF5FF] cursor-pointer hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
                <span className="flex min-w-0 items-center gap-3">
                  <MdOutlineInfo aria-hidden="true" className="size-10 shrink-0 rounded-xl p-2.5 bg-[#D4E4F3] text-[#0B5FFF]" />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-base font-bold leading-relaxed">Información del adulto</span>
                    <span className="text-xs leading-relaxed text-[#424656]">Tocá para consultar los datos</span>
                  </span>
                </span>
                <MdChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#B9C6D5]" />
              </Link>
              {esCuidador && (
                <Link to={"../adultos-a-cargo"} className="flex w-full items-center justify-between gap-3 rounded-xl p-3.5 text-left bg-[#EBF5FF] cursor-pointer hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
                  <span className="flex min-w-0 items-center gap-3">
                    <MdPerson aria-hidden="true" className="size-10 shrink-0 rounded-xl p-2.5 bg-[#D4E4F3] text-[#0B5FFF]" />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-base font-bold leading-relaxed">Adultos mayores a cargo</span>
                      <span className="text-xs leading-relaxed text-[#424656]">Tocá para consultar los datos</span>
                    </span>
                  </span>
                  <MdChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#B9C6D5]" />
                </Link>
              )}
              <Link to={"../historial/adulto"} type="button" className="flex w-full items-center justify-between gap-3 rounded-xl p-3.5 text-left bg-[#EBF5FF] cursor-pointer hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
                <span className="flex min-w-0 items-center gap-3">
                  <MdOutlineVolunteerActivism aria-hidden="true" className="size-10 shrink-0 rounded-xl p-2.5 bg-[#D4E4F3] text-[#0B5FFF]" />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-base font-bold leading-relaxed">Historial de cuidados</span>
                    <span className="text-xs leading-relaxed text-[#424656]">Tocá para consultar los datos</span>
                  </span>
                </span>
                <MdChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#B9C6D5]" />
              </Link>
              <Link to={"../codigo-emergencia"} type="button" className="flex w-full items-center justify-between gap-3 rounded-xl p-3.5 text-left bg-[#EBF5FF] cursor-pointer hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
                <span className="flex min-w-0 items-center gap-3">
                  <MdQrCode2 aria-hidden="true" className="size-10 shrink-0 rounded-xl p-2.5 bg-[#FFDBD2] text-[#AD2B00]" />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-base font-bold leading-relaxed">Código de emergencia</span>
                    <span className="text-xs leading-relaxed text-[#424656]">Tocá para consultar los datos</span>
                  </span>
                </span>
                <MdChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#B9C6D5]" />
              </Link>
              <Link to={"../medidas-anticipadas"} type="button" className="flex w-full items-center justify-between gap-3 rounded-xl p-3.5 text-left bg-[#EBF5FF] cursor-pointer hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
                <span className="flex min-w-0 items-center gap-3">
                  <MdOutlineMedicalInformation aria-hidden="true" className="size-10 shrink-0 rounded-xl p-2.5 bg-[#D4E4F3] text-[#0B5FFF]" />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-base font-bold leading-relaxed">Medidas anticipadas</span>
                    <span className="text-xs leading-relaxed text-[#424656]">Tocá para consultar los datos</span>
                  </span>
                </span>
                <MdChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#B9C6D5]" />
              </Link>
            </div>
          </section>

          {/* agregado (no está en el Figma): avisos recibidos, alertas y notas de la red */}
          <div className="contents lg:grid lg:grid-cols-3 lg:gap-4 2xl:gap-6">
            <LinkAvisos />
            <AccesosRed pendientesAdulto={pendientes.length} />
          </div>
        </div>
      </div>
    </main>
  );
}
