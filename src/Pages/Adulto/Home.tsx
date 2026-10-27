import { useState } from "react";
import Header from "../../components/Header";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { alertasService } from "../../services/alertasService";
import { RiAlertFill } from "react-icons/ri";
import { LuActivity, LuHeartPulse, LuWatch } from "react-icons/lu";
import {
  MdArrowForward,
  MdCheck,
  MdCheckCircleOutline,
  MdChevronRight,
  MdDirectionsWalk,
  MdFavorite,
  MdNotificationsActive,
  MdOutlineBedtime,
  MdOutlineCalendarToday,
  MdOutlineDescription,
  MdOutlineHealthAndSafety,
  MdOutlineInfo,
  MdOutlineMedication,
  MdOutlinePeopleAlt,
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

export default function Home() {
  const { usuario } = useAuth();
  const nombre = usuario?.nombreCompleto?.trim().split(/\s+/)[0];
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState<boolean>(false);
  const [errorSOS, setErrorSOS] = useState<string | null>(null);

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
                  ROL · {usuario?.fechaNacimiento
                    ? `${calcularEdad(usuario.fechaNacimiento)} años`
                    : "Sin dato de edad"}
                </p>
              </div>
            </div>
            <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#84F6E6]/40 px-2.5 py-1 text-xs font-bold uppercase leading-normal tracking-wide text-[#006A61]">
              <MdCheckCircleOutline aria-hidden="true" className="size-4 shrink-0" />
              TODO EN ORDEN
            </span>
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-[#EBF5FF] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-base leading-relaxed">
                <LuWatch aria-hidden="true" className="size-4 shrink-0 text-[#006A61]" />
                Pulsera conectada
              </p>
              <span className="flex items-center gap-1.5 rounded-md bg-white px-2 py-0.5 text-sm font-bold text-[#006A61]">
                <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-[#006A61]" />
                En vivo
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#424656]">Sincronizado hace 3 min</p>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <button type="button" className="flex min-h-14 min-w-0 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold leading-5 text-[#0B5FFF] bg-[#EBF5FF] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
              <MdOutlinePhone aria-hidden="true" className="size-4 shrink-0 text-[#0B5FFF]" />
              <span>Llamar a Sofía</span>
            </button>
            <button type="button" className="flex min-h-14 min-w-0 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold leading-5 text-[#0B5FFF] bg-[#EBF5FF] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
              <MdOutlinePhone aria-hidden="true" className="size-4 shrink-0 text-[#0B5FFF]" />
              <span>Llamar a María</span>
            </button>
          </div>
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

        <section className="flex w-full min-w-0 flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="supervision-medica">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="supervision-medica" className="flex items-center gap-2 text-lg font-bold leading-normal sm:text-xl">
              <LuActivity aria-hidden="true" className="size-6 shrink-0 text-[#0049CC]" />
              Supervisión Médica
            </h2>
            <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#84F6E6]/40 px-2.5 py-1 text-xs font-bold uppercase leading-normal tracking-wide text-[#006A61]">
              <MdCheckCircleOutline aria-hidden="true" className="size-4 shrink-0" />
              ESTABLE
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
              <dt className="flex items-center justify-between gap-1">
                <span className="text-xs leading-normal text-[#424656]">Pulso</span>
                <MdFavorite aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#FFDBD2] text-[#AD2B00]" />
              </dt>
              <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-tight">72
                <span className="text-sm font-semibold leading-normal text-[#424656]">lpm</span>
              </dd>
              <dd className="flex items-center gap-1 text-xs leading-normal font-semibold text-[#006A61]">
                <MdCheck aria-hidden="true" className="size-3 shrink-0" />
                <span>Reposo (60-100)</span>
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
              <dt className="flex items-center justify-between gap-1">
                <span className="text-xs leading-normal text-[#424656]">Presión</span>
                <LuHeartPulse aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#DAEAF9] text-[#0B5FFF]" />
              </dt>
              <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-tight">120/80
              </dd>
              <dd className="flex items-center gap-1 text-xs leading-normal text-[#424656]">
                <MdOutlineSchedule aria-hidden="true" className="size-3 shrink-0" />
                <span>Control 14:00 hs</span>
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
              <dt className="flex items-center justify-between gap-1">
                <span className="text-xs leading-normal text-[#424656]">Movilidad</span>
                <MdDirectionsWalk aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#84F6E6]/40 text-[#006A61]" />
              </dt>
              <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-tight">2.450
                <span className="text-sm font-semibold leading-normal text-[#424656]">pasos</span>
              </dd>
              <dd className="flex items-center gap-1 text-xs leading-normal text-[#424656]">
                <MdWbSunny aria-hidden="true" className="size-3 shrink-0" />
                <span>Paseo matutino</span>
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
              <dt className="flex items-center justify-between gap-1">
                <span className="text-xs leading-normal text-[#424656]">Descanso</span>
                <MdOutlineBedtime aria-hidden="true" className="size-8 shrink-0 rounded-full p-2 bg-[#DBE1FF] text-[#0B5FFF]" />
              </dt>
              <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-tight">7h 45m
              </dd>
              <dd className="flex items-center gap-1 text-xs leading-normal font-semibold text-[#006A61]">
                <MdCheck aria-hidden="true" className="size-3 shrink-0" />
                <span>Sin interrupciones</span>
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
                <h3 className="text-base font-bold leading-relaxed">Losartán 50mg</h3>
                <p className="text-xs leading-relaxed text-[#424656]">Próxima: 21:00 hs (Cena)</p>
              </div>
            </div>
            <span className="rounded-full px-2.5 py-1 text-xs font-bold bg-[#84F6E6]/40 text-[#006A61]">2 de 3 tomas</span>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-[#EBF5FF] p-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <MdOutlineHealthAndSafety aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-[#84F6E6]/40 p-2.5 text-[#006A61]" />
              <div className="min-w-0">
                <h3 className="text-base font-bold leading-relaxed">Incidentes y caídas</h3>
                <p className="text-xs leading-relaxed text-[#424656]">0 alertas en las últimas 72 hs</p>
              </div>
            </div>
            <MdCheck aria-hidden="true" className="size-7 shrink-0 rounded-full bg-white p-1.5 text-[#006A61]" />
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
            <button type="button" className="flex w-full items-center justify-between gap-3 rounded-xl p-3.5 text-left bg-[#EBF5FF] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
              <span className="flex min-w-0 items-center gap-3">
                <MdNotificationsActive aria-hidden="true" className="size-10 shrink-0 rounded-xl p-2.5 bg-[#D4E4F3] text-[#0B5FFF]" />
                <span className="flex min-w-0 flex-col">
                  <span className="text-base font-bold leading-relaxed">Estado de alerta</span>
                  <span className="text-xs leading-relaxed text-[#424656]">Tocá para consultar los datos</span>
                </span>
              </span>
              <MdChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#B9C6D5]" />
            </button>
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
            <button type="button" className="flex w-full items-center justify-between gap-3 rounded-xl p-3.5 text-left bg-[#EBF5FF] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]">
              <span className="flex min-w-0 items-center gap-3">
                <MdOutlinePeopleAlt aria-hidden="true" className="size-10 shrink-0 rounded-xl p-2.5 bg-[#D4E4F3] text-[#0B5FFF]" />
                <span className="flex min-w-0 flex-col">
                  <span className="text-base font-bold leading-relaxed">Administrar vínculo</span>
                  <span className="text-xs leading-relaxed text-[#424656]">Tocá para consultar los datos</span>
                </span>
              </span>
              <MdChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#B9C6D5]" />
            </button>
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
