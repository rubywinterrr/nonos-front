import { useEffect, useState } from "react";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { RiCapsuleFill } from "react-icons/ri";
import {
  LuCalendarCheck,
  LuCircleCheck,
  LuClock,
  LuDroplet,
  LuMoon,
  LuSun,
  LuSunrise,
  LuUtensils,
} from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";
import { medicamentosService, type Medicamento } from "../../services/medicamentosService";
import { tomasDeHoy, proximaToma, momentoDelDia, yaPaso } from "../../utils/tomasDeHoy";
import { obtenerDiaActual } from "../../utils/obtenerFechaActual";

// "Viernes, 24 de octubre"
function fechaDeHoy() {
  const fecha = new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long" });
  return `${obtenerDiaActual()}, ${fecha}`;
}

// ícono según el momento del día de la toma
function iconoDelMomento(momento: string) {
  if (momento === "Mañana") return <LuSunrise aria-hidden="true" className="size-4 shrink-0" />;
  if (momento === "Tarde") return <LuSun aria-hidden="true" className="size-4 shrink-0" />;
  return <LuMoon aria-hidden="true" className="size-4 shrink-0" />;
}

// "Esta mañana", "Esta tarde" o "Esta noche"
function textoCuando(momento: string) {
  if (momento === "Mañana") return "Esta mañana";
  if (momento === "Tarde") return "Esta tarde";
  return "Esta noche";
}

// medicación del adulto: su próxima toma y todas las tomas de hoy, con los datos del back
export default function MedicacionActual() {
  const { usuario } = useAuth();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    const id = usuario.id;

    // trae los medicamentos activos del adulto
    const cargar = async () => {
      try {
        setMedicamentos(await medicamentosService.getMedicamentos(id));
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar tu medicación.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario]);

  const tomas = tomasDeHoy(medicamentos);
  const proxima = proximaToma(tomas);
  const momentoProxima = proxima ? momentoDelDia(proxima.horario) : "";

  return (
    <main className="mainBody">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-8">
        <VueltaAtras titulo="Medicación actual" />

        <p className="text-base font-medium leading-relaxed text-[#424656]">{fechaDeHoy()}</p>

        {cargando && <p className="text-[#424656]">Cargando tu medicación…</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
        {!cargando && !error && tomas.length === 0 && (
          <p className="rounded-2xl bg-white p-4 text-base">Hoy no tenés medicación cargada.</p>
        )}

        {proxima && (
          <section aria-labelledby="proxima-toma" className="flex w-full flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="proxima-toma" className="flex items-center gap-2 text-xl font-bold leading-7">
                <LuClock aria-hidden="true" className="size-5 shrink-0 text-[#AD2B00]" />
                Tu próxima toma
              </h2>
              <span className="rounded-full bg-[#FFDBD2] px-3 py-0.5 text-xs font-bold leading-6 text-[#891E00]">{textoCuando(momentoProxima)}</span>
            </div>

            <article aria-labelledby="medicamento-proximo" className="flex w-full flex-col gap-3.5 rounded-3xl border-2 border-[#B5CFFF] bg-white p-5 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                  <p className="flex max-w-full flex-wrap items-center gap-1.5 rounded-xl bg-[#FFDBD2] px-3 py-1 text-sm font-bold leading-6 text-[#A32600]">
                    {iconoDelMomento(momentoProxima)}
                    <span>{proxima.horario} hs • {momentoProxima}</span>
                  </p>
                  <h3 id="medicamento-proximo" className="pt-1 text-2xl font-bold leading-7 tracking-tight wrap-anywhere">{proxima.medicamento.nombre}</h3>
                  <p className="max-w-full rounded-lg bg-[#E0F0FF] px-3 py-0.5 text-sm font-bold leading-6 text-[#0049CC]">{proxima.medicamento.dosis}</p>
                </div>
                <div aria-hidden="true" className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#E0F0FF]">
                  <RiCapsuleFill className="size-8 text-[#0049CC]" />
                  <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-[#0049CC] shadow-xs">
                    <LuDroplet className="size-4 text-white" />
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-[#F3F8FE] p-3.5">
                <LuUtensils aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#0049CC]" />
                {/* PENDIENTE BACK: no hay indicaciones por remedio ("con un vaso de agua al terminar de cenar");
                  se arma con la dosis y el horario para no dar una indicación equivocada */}
                <p className="min-w-0 text-base leading-6">
                  Tomar <span className="text-[#0049CC]">{proxima.medicamento.dosis}</span> a las {proxima.horario} hs.
                </p>
              </div>
            </article>
          </section>
        )}

        <section aria-labelledby="tomas-de-hoy" className="flex w-full flex-col gap-2 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="tomas-de-hoy" className="flex items-center gap-2 text-xl font-bold leading-7">
              <LuCalendarCheck aria-hidden="true" className="size-5 shrink-0 text-[#0049CC]" />
              Tomas de hoy
            </h2>
            <span className="text-sm font-semibold leading-6 text-[#0049CC]">Horarios habituales</span>
          </div>

          {tomas.map((toma, indice) => {
            const momento = momentoDelDia(toma.horario);
            const paso = yaPaso(toma.horario);
            const idTitulo = `toma-${indice}`;
            return (
              <article key={`${toma.medicamento.id}-${toma.horario}`} aria-labelledby={idTitulo} className="w-full rounded-2xl bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className={`flex items-center gap-1.5 text-sm font-bold uppercase leading-6 tracking-wide ${momento === "Noche" ? "text-[#A32600]" : "text-[#0049CC]"}`}>
                      {iconoDelMomento(momento)}
                      <span>{toma.horario} HS • {momento}</span>
                    </p>
                    <h3 id={idTitulo} className="text-lg font-bold leading-7">{toma.medicamento.nombre} {toma.medicamento.dosis}</h3>
                  </div>
                  {/* ya pasó el horario: tilde azul; todavía no: reloj (el back no registra si se tomó) */}
                  {paso ? (
                    <LuCircleCheck aria-hidden="true" className="size-10 shrink-0 rounded-full bg-[#E0F0FF] p-2.5 text-[#0049CC]" />
                  ) : (
                    <LuClock aria-hidden="true" className="size-10 shrink-0 rounded-full bg-[#FFDBD2] p-2.5 text-[#A32600]" />
                  )}
                </div>
                {toma.medicamento.lowStock && (
                  <p className="mt-1 w-fit rounded-md bg-[#FFDAD6] px-2 py-0.5 text-sm font-bold text-[#93000A]">Quedan pocas</p>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}