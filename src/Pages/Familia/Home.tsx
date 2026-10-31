import { useEffect, useState } from "react";
import Header from "../../components/Header";
import InvitacionesPendientes from "../../components/InvitacionesPendientes";
import obtenerFechaActual, { obtenerDiaActual } from "../../utils/obtenerFechaActual";
import { Link } from "react-router-dom";
import { LuActivity, LuWatch } from "react-icons/lu";
import { TbLungs } from "react-icons/tb";
import { RiAlertFill } from "react-icons/ri";
import { useAuth } from "../../hooks/useAuth";
import { alertasService, type Alerta } from "../../services/alertasService";
import { dispositivosService, type Dispositivo } from "../../services/dispositivosService";
import { medicionesService, type ResumenMedicion } from "../../services/medicionesService";
import { medicamentosService, type Medicamento } from "../../services/medicamentosService";
import { usuarioService, type AdultoMayorVinculado, type Vinculo } from "../../services/usuariosService";
import { buscarAdultoSeleccionado } from "../../utils/adultoQueSeMira";
import calcularEdad from "../../utils/calcularEdad";
import tiempoDesde from "../../utils/tiempoDesde";
import { tomasDeHoy, proximaToma, momentoDelDia, yaPaso } from "../../utils/tomasDeHoy";
import { horasYMinutos } from "../../utils/formatoSignos";
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
  MdShield,
  MdWbSunny,
} from "react-icons/md";

const SETENTA_Y_DOS_HORAS = 72 * 60 * 60 * 1000;

// la otra persona para el segundo botón de llamar: alguien de la red del adulto (que no sea yo) con teléfono,
// primero los contactos de emergencia
function otraPersonaParaLlamar(vinculos: Vinculo[], miId: string) {
  const conTelefono = vinculos.filter((v) => v.familiarId !== miId && v.familiar.telefono);
  const deEmergencia = conTelefono.find((v) => v.esContactoEmergencia);
  if (deEmergencia) return deEmergencia;
  if (conTelefono.length > 0) return conTelefono[0];
  return null;
}

// inicio del familiar: el estado del adulto que está mirando, con los datos del back
export default function HomeFamilia() {
  const { usuario } = useAuth();
  const [adulto, setAdulto] = useState<AdultoMayorVinculado | null>(null);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [alertas72hs, setAlertas72hs] = useState(0);
  const [pulsera, setPulsera] = useState<Dispositivo | null>(null);
  const [resumen, setResumen] = useState<ResumenMedicion[]>([]);
  const [pasosHoy, setPasosHoy] = useState<number | null>(null);
  const [suenoMinutos, setSuenoMinutos] = useState<number | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [cargando, setCargando] = useState(true);
  // se suma 1 cuando se acepta una invitación, para volver a cargar todo
  const [recargar, setRecargar] = useState(0);

  useEffect(() => {
    if (!usuario) return;
    const miId = usuario.id;

    // trae todo lo del adulto que se está mirando; si falla una parte, las demás se muestran igual
    const cargar = async () => {
      let elegido: AdultoMayorVinculado | null = null;
      try {
        elegido = await buscarAdultoSeleccionado(miId);
      } catch (err) {
        console.error(err);
      }
      setAdulto(elegido);
      setCargando(false);
      if (!elegido) return;
      const id = elegido.id;

      try {
        const data = await alertasService.getAlertas(id);
        setAlertas(data);
        // cuántas alertas hubo en las últimas 72 hs
        const ahora = Date.now();
        setAlertas72hs(data.filter((a) => ahora - new Date(a.createdAt).getTime() <= SETENTA_Y_DOS_HORAS).length);
      } catch (err) {
        console.error(err);
      }

      try {
        const dispositivos = await dispositivosService.getDispositivos(id);
        setPulsera(dispositivos.find((d) => d.tipo === "FITBIT_AIR") ?? null);
      } catch (err) {
        console.error(err);
      }

      try {
        setResumen(await medicionesService.getResumen(id));
        const inicioDelDia = new Date();
        inicioDelDia.setHours(0, 0, 0, 0);
        const pasos = await medicionesService.getMediciones(id, "PASOS", inicioDelDia.toISOString());
        let total = 0;
        for (const medicion of pasos) total += medicion.valor;
        setPasosHoy(total);
        const hace24hs = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const sueno = await medicionesService.getMediciones(id, "SUENO", hace24hs.toISOString());
        setSuenoMinutos(sueno.length > 0 ? sueno[0].valor : null);
      } catch (err) {
        console.error(err);
      }

      try {
        setMedicamentos(await medicamentosService.getMedicamentos(id));
      } catch (err) {
        console.error(err);
      }

      try {
        setVinculos(await usuarioService.getVinculos(id));
      } catch (err) {
        console.error(err);
      }
    };

    cargar();
    // cada 1 minuto se actualiza (la pulsera la sincroniza el adulto o el back)
    const intervalo = setInterval(cargar, 60 * 1000);
    return () => clearInterval(intervalo);
  }, [usuario, recargar]);

  // ---------- datos calculados ----------
  const nombre = usuario ? usuario.nombreCompleto.trim().split(" ")[0] : "";
  const hayAlertaPendiente = alertas.some((a) => a.estado === "PENDIENTE" && a.categoria === "CRITICO");
  const pulso = resumen.find((r) => r.tipo === "FRECUENCIA_CARDIACA");
  const oxigeno = resumen.find((r) => r.tipo === "SPO2");
  const tomas = tomasDeHoy(medicamentos);
  const proxima = proximaToma(tomas);
  const tomasQueYaPasaron = tomas.filter((t) => yaPaso(t.horario)).length;
  const otraPersona = usuario ? otraPersonaParaLlamar(vinculos, usuario.id) : null;

  let textoSincronizado = "Todavía no se sincronizó";
  if (pulsera?.ultimaSincronizacion) textoSincronizado = `Sincronizado ${tiempoDesde(pulsera.ultimaSincronizacion)}`;
  if (pulsera?.requiereReautenticacion) textoSincronizado = "Hay que volver a conectarla desde la cuenta del adulto";

  return (
    <main className="mainBody">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-32 pt-6">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold leading-9 tracking-tight">Hola, {nombre}</h1>
          <p className="text-base leading-relaxed text-[#424656]">{obtenerFechaActual()}</p>
        </div>

        <InvitacionesPendientes onAceptada={() => setRecargar(recargar + 1)} />

        {cargando && <p className="text-center text-[#424656]">Cargando…</p>}
        {!cargando && !adulto && (
          <p className="rounded-2xl bg-white p-4 text-base">Todavía no estás vinculado a ningún adulto mayor.</p>
        )}

        {adulto && (
          <>
            <section className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="persona-vinculada">
              <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-3">
                <div className="flex items-center gap-3">
                  {adulto.fotoUrl ? (
                    <img src={adulto.fotoUrl} alt="" className="size-12 shrink-0 rounded-full bg-[#D4E4F3] object-cover" />
                  ) : (
                    <MdPerson aria-hidden="true" className="size-12 shrink-0 rounded-full bg-[#D4E4F3] p-2 text-[#424656]" />
                  )}
                  <div>
                    <h2 id="persona-vinculada" className="text-lg font-bold leading-snug sm:text-xl">{adulto.nombreCompleto}</h2>
                    {/* PENDIENTE BACK: el vínculo no guarda el parentesco, por ahora "Papá" queda fijo */}
                    <p className="text-sm font-semibold leading-normal tracking-wide text-[#424656]">
                      Papá{adulto.fechaNacimiento && ` · ${calcularEdad(adulto.fechaNacimiento)} años`}
                    </p>
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

            <section className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="supervision-medica">
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
                    <TbLungs aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#DAEAF9] text-[#0B5FFF]" />
                  </dt>
                  <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-relaxed">{oxigeno ? `${Math.round(oxigeno.ultimoValor)}%` : "—"}
                  </dd>
                  <dd className="flex items-center gap-1 text-xs leading-normal text-[#424656]">
                    <MdOutlineSchedule aria-hidden="true" className="size-3 shrink-0" />
                    <span>{oxigeno ? `Medido ${tiempoDesde(oxigeno.ultimaMedicion)}` : "Sin datos de hoy"}</span>
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
                  <dd className="flex items-center gap-1 text-xs leading-normal text-[#424656]">
                    <MdWbSunny aria-hidden="true" className="size-3 shrink-0" />
                    {/* PENDIENTE BACK: no hay dato de en qué momento caminó, queda el texto del Figma */}
                    <span>Paseo matutino</span>
                  </dd>
                </div>
                <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
                  <dt className="flex items-center justify-between gap-1">
                    <span className="text-xs leading-relaxed text-[#424656]">Descanso</span>
                    <MdOutlineBedtime aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#DBE1FF] text-[#0B5FFF]" />
                  </dt>
                  <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-relaxed">{suenoMinutos !== null ? horasYMinutos(suenoMinutos) : "—"}
                  </dd>
                  {/* PENDIENTE BACK: el sueño llega como un total de minutos, sin interrupciones; queda el texto del Figma */}
                  <dd className="flex items-center gap-1 text-xs leading-normal font-semibold text-[#006A61]">
                    <MdCheck aria-hidden="true" className="size-3 shrink-0" />
                    <span>Sin interrupciones</span>
                  </dd>
                </div>
              </dl>

              <Link to="../signos" className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#EBF5FF] px-4 py-2.5 text-lg font-bold leading-6 tracking-normal text-[#0049CC] cursor-pointer hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
                Ver signos específicos
                <MdArrowForward aria-hidden="true" className="size-4 shrink-0 text-[#0049CC]" />
              </Link>
            </section>

            <section className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="rutina-hoy">
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
                {tomas.length > 0 && (
                  <span className="shrink-0 rounded-full bg-[#84F6E6]/40 px-2 py-1 text-xs font-bold leading-normal text-[#006A61] sm:px-2.5">{tomasQueYaPasaron} de {tomas.length} tomas</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl bg-[#EBF5FF] p-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <MdShield aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-[#84F6E6]/40 p-2.5 text-[#006A61]" />
                  <div>
                    <h3 className="text-base font-bold leading-relaxed">Incidentes y caídas</h3>
                    <p className="text-xs leading-relaxed text-[#424656]">{alertas72hs} {alertas72hs === 1 ? "alerta" : "alertas"} en las últimas 72 hs</p>
                  </div>
                </div>
                {alertas72hs === 0 && (
                  <MdCheck aria-hidden="true" className="size-7 shrink-0 rounded-full bg-white p-1.5 text-[#006A61] shadow-xs" />
                )}
              </div>
            </section>
          </>
        )}

        <section className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="ficha-consulta">
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
      </div>
    </main>
  );
}
