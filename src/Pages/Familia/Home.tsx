import Header from "../../components/Header";
import { Link } from "react-router-dom";
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

const signosVitales = [
  {
    titulo: "Pulso",
    valor: "72",
    unidad: "lpm",
    icono: MdFavorite,
    estiloIcono: "bg-[#FFDBD2] text-[#AD2B00]",
    detalle: "Reposo (60-100)",
    iconoDetalle: MdCheck,
    normal: true,
  },
  {
    titulo: "Presión",
    valor: "120/80",
    icono: LuHeartPulse,
    estiloIcono: "bg-[#DAEAF9] text-[#0B5FFF]",
    detalle: "Control 14:00 hs",
    iconoDetalle: MdOutlineSchedule,
  },
  {
    titulo: "Movilidad",
    valor: "2.450",
    unidad: "pasos",
    icono: MdDirectionsWalk,
    estiloIcono: "bg-[#84F6E6]/40 text-[#006A61]",
    detalle: "Paseo matutino",
    iconoDetalle: MdWbSunny,
  },
  {
    titulo: "Descanso",
    valor: "7h 45m",
    icono: MdOutlineBedtime,
    estiloIcono: "bg-[#DBE1FF] text-[#0B5FFF]",
    detalle: "Sin interrupciones",
    iconoDetalle: MdCheck,
    normal: true,
  },
];

const fichasConsulta = [
  { titulo: "Información del adulto", icono: MdOutlineInfo },
  { titulo: "Historial de cuidados", icono: MdOutlineVolunteerActivism },
  { titulo: "Código de emergencia", icono: MdQrCode2, emergencia: true },
  { titulo: "Medidas anticipadas", icono: MdOutlineMedicalInformation },
];

const tarjeta = "flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs";
const foco = "cursor-pointer hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]";

// Maqueta estática: los datos son de ejemplo y los botones no tienen acciones.
export default function HomeFamilia() {
  return (
    <main className="mainBody">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-32 pt-6">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold leading-9 tracking-tight">Hola, Sofía</h1>
          <p className="text-base leading-relaxed text-[#424656]">Viernes, 24 de Octubre · 16:40 hs</p>
        </div>

        <section className={tarjeta} aria-labelledby="persona-vinculada">
          <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-3">
            <div className="flex items-center gap-3">
              <MdPerson aria-hidden="true" className="size-12 shrink-0 rounded-full bg-[#D4E4F3] p-2 text-[#424656]" />
              <div>
                <h2 id="persona-vinculada" className="text-lg font-bold leading-snug sm:text-xl">José Pérez</h2>
                <p className="text-sm font-semibold leading-normal tracking-wide text-[#424656]">Papá · 78 años</p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#84F6E6]/40 px-2 py-1 text-xs font-bold leading-normal tracking-wide text-[#006A61] sm:px-2.5">
              <MdCheckCircleOutline aria-hidden="true" className="size-4 shrink-0 text-[#006A61]" />
              TODO EN ORDEN
            </span>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-[#EBF5FF] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-base leading-relaxed">
                <LuWatch aria-hidden="true" className="size-4 shrink-0 text-[#006A61]" />
                Pulsera conectada
              </p>
              <span className="flex items-center gap-1.5 rounded-md bg-white px-2 py-0.5 text-sm font-bold leading-normal tracking-wide text-[#006A61]">
                <span className="size-2.5 rounded-full bg-[#006A61]" aria-hidden="true" />
                En vivo
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#424656]">Sincronizado hace 3 min</p>
          </div>

          <div className="grid w-full grid-cols-2 gap-3.5">
            {["Papá", "María"].map((nombre) => (
              <button key={nombre} type="button" className={`flex min-h-14 items-center justify-center gap-2 rounded-lg bg-[#EBF5FF] px-1.5 py-2 text-sm font-semibold leading-5 text-[#0B5FFF] sm:px-2 sm:text-base ${foco}`}>
                <MdOutlinePhone aria-hidden="true" className="size-4 shrink-0 text-[#0B5FFF]" />
                <span>Llamar a {nombre}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={tarjeta} aria-labelledby="supervision-medica">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
            <h2 id="supervision-medica" className="flex items-center gap-2 text-lg font-bold leading-normal sm:text-xl">
              <LuActivity aria-hidden="true" className="size-6 shrink-0 text-[#0049CC]" />
              Supervisión Médica
            </h2>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#84F6E6]/40 px-2.5 py-1 text-xs font-bold leading-normal tracking-wider text-[#006A61]">
              <MdOutlineHealthAndSafety aria-hidden="true" className="size-4 shrink-0 text-[#006A61]" />
              ESTABLE
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-2 pt-1">
            {signosVitales.map(({ icono: Icono, iconoDetalle: IconoDetalle, ...signo }) => (
              <div key={signo.titulo} className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-[#EBF5FF] p-3.5">
                <dt className="flex items-center justify-between gap-1">
                  <span className="text-xs leading-relaxed text-[#424656]">{signo.titulo}</span>
                  <Icono aria-hidden="true" className={`size-8 shrink-0 rounded-full p-2 ${signo.estiloIcono}`} />
                </dt>
                <dd className="flex flex-wrap items-baseline gap-x-1 text-2xl font-bold leading-relaxed">
                  {signo.valor}
                  {signo.unidad && <span className="text-sm font-semibold leading-normal tracking-wide text-[#424656]">{signo.unidad}</span>}
                </dd>
                <dd className={`flex items-center gap-1 text-xs leading-normal ${signo.normal ? "font-semibold text-[#006A61]" : "text-[#424656]"}`}>
                  <IconoDetalle aria-hidden="true" className="size-3 shrink-0" />
                  <span>{signo.detalle}</span>
                </dd>
              </div>
            ))}
          </dl>

          <Link to={"../signos"} className={`flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#EBF5FF] px-4 py-2.5 text-lg font-bold leading-6 tracking-normal text-[#0049CC] ${foco}`}>
            Ver signos específicos
            <MdArrowForward aria-hidden="true" className="size-4 shrink-0 text-[#0049CC]" />
          </Link>
        </section>

        <section className={tarjeta} aria-labelledby="rutina-hoy">
          <div className="flex items-center justify-between gap-2">
            <h2 id="rutina-hoy" className="flex items-center gap-2 text-xl font-bold leading-normal">
              <MdOutlineCalendarToday aria-hidden="true" className="size-5 shrink-0 text-[#0B5FFF]" />
              Rutina de hoy
            </h2>
            <span className="text-sm font-semibold leading-normal tracking-wide text-[#424656]">Viernes</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-3 rounded-xl bg-[#EBF5FF] p-3 sm:p-3.5">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <MdOutlineMedication aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-white p-3 text-[#0B5FFF] shadow-xs" />
              <div>
                <h3 className="text-base font-bold leading-relaxed">Losartán 50mg</h3>
                <p className="text-xs leading-relaxed text-[#424656]">Próxima: 21:00 hs (Cena)</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-[#84F6E6]/40 px-2 py-1 text-xs font-bold leading-normal text-[#006A61] sm:px-2.5">2 de 3 tomas</span>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-xl bg-[#EBF5FF] p-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <MdShield aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-[#84F6E6]/40 p-2.5 text-[#006A61]" />
              <div>
                <h3 className="text-base font-bold leading-relaxed">Incidentes y caídas</h3>
                <p className="text-xs leading-relaxed text-[#424656]">0 alertas en las últimas 72 hs</p>
              </div>
            </div>
            <MdCheck aria-hidden="true" className="size-7 shrink-0 rounded-full bg-white p-1.5 text-[#006A61] shadow-xs" />
          </div>
        </section>

        <section className={tarjeta} aria-labelledby="ficha-consulta">
          <h2 id="ficha-consulta" className="flex items-center gap-2 text-xl font-bold leading-normal">
            <MdOutlineDescription aria-hidden="true" className="size-5 shrink-0 text-[#0B5FFF]" />
            Ficha de consulta
          </h2>
          <p className="text-sm font-semibold leading-normal tracking-wide text-[#424656]">Para guardia / SAME</p>
          <div className="flex flex-col gap-2">
            {fichasConsulta.map(({ icono: Icono, ...ficha }) => (
              <button key={ficha.titulo} type="button" className={`flex w-full items-center justify-between gap-3 rounded-xl bg-[#EBF5FF] p-3.5 text-left ${foco}`}>
                <span className="flex min-w-0 items-center gap-3">
                  <Icono aria-hidden="true" className={`size-10 shrink-0 rounded-xl p-2.5 ${ficha.emergencia ? "bg-[#FFDBD2] text-[#AD2B00]" : "bg-[#D4E4F3] text-[#0B5FFF]"}`} />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-base font-bold leading-relaxed">{ficha.titulo}</span>
                    <span className="text-xs leading-relaxed text-[#424656]">Tocá para consultar los datos</span>
                  </span>
                </span>
                <MdChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#B9C6D5]" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
