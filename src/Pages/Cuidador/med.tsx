import VueltaAtras from "../../components/vueltaAtras";
import Header from "../../components/Header";
import { LuCalendarCheck, LuClock, LuHistory, LuInfo, LuUserRoundPen } from "react-icons/lu";
import { MdAddCircleOutline } from "react-icons/md";

// HARDCODEADO: reemplazar con medicamentosService.getMedicamentos(adultoId)
// motivo y detalle todavía no existen en el back (hay que pedirlos o armarlos con horariosDelDia)
const medicamentos = [
  {
    id: "1",
    nombre: "Losartán",
    dosis: "50 mg",
    motivo: "Presión arterial",
    detalle: "1 comprimido por día · Mañana 08:00 hs con desayuno",
  },
  {
    id: "2",
    nombre: "Omeprazol",
    dosis: "20 mg",
    motivo: "Protector gástrico",
    detalle: "1 comprimido diario · En ayunas matutino",
  },
  {
    id: "3",
    nombre: "Atorvastatina",
    dosis: "10 mg",
    motivo: "Control de lípidos",
    detalle: "1 comprimido diario · Noche 21:00 hs",
  },
];

// HARDCODEADO: reemplazar con medicamentosService.getCambiosMedicamento(id)
// el back devuelve el usuarioId de quien hizo el cambio, no el nombre
const historial = [
  {
    id: "1",
    fecha: "23 de Octubre de 2026 · 18:30 hs",
    cambio: "Losartán: incremento de dosis de 25mg a 50mg.",
    autor: "Sofía Gómez según indicación de Dra. Valenzuela",
  },
  {
    id: "2",
    fecha: "15 de Septiembre de 2026 · 11:00 hs",
    cambio: "Suspensión de Ibuprofeno 400mg ocasional por sugerencia gastroenterológica.",
    autor: "Sofía Gómez",
  },
  {
    id: "3",
    fecha: "01 de Julio de 2026 · 09:00 hs",
    cambio: "Inicio de Atorvastatina 10mg noche.",
    autor: "José Perez",
  },
];

// pantalla del familiar: medicación activa del adulto y el historial de cambios
export default function MedFam() {
  return (
    <>
      <main className="mainBody text-[#0E1D28]">
        <Header />
        <VueltaAtras titulo="Medicación actual" compacto />

        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          <section className="flex items-start gap-3 rounded-2xl bg-white/70 p-4">
            <LuInfo aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#424656]" />
            <p className="text-sm leading-relaxed text-[#424656]">
              NONOS no controla si se tomó o no la medicación. Esta lista es una referencia del
              esquema médico indicado y su historial de cambios.
            </p>
          </section>

          {/* HARDCODEADO: fecha y autor del último cambio */}
          <section className="flex items-start gap-3 rounded-2xl bg-white/70 p-4">
            <LuCalendarCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#0B5FFF]" />
            <p className="text-sm font-semibold leading-relaxed">
              Actualizado el 20 de Octubre de 2026 por Sofía Gomez.
            </p>
          </section>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Medicación habitual activa</h2>
            <span className="rounded-full bg-[#84F6E6]/40 px-3 py-1 text-xs font-bold text-[#006A61]">
              {medicamentos.length} activos
            </span>
          </div>

          {medicamentos.map((medicamento) => (
            <article key={medicamento.id} className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold">{medicamento.nombre}</h3>
                  <p className="text-sm font-semibold text-[#006A61]">Dosis: {medicamento.dosis}</p>
                </div>
                <span className="rounded-lg border border-[#006A61]/30 bg-[#84F6E6]/30 px-2.5 py-1 text-xs font-bold text-[#006A61]">
                  {medicamento.motivo}
                </span>
              </div>
              <p className="flex items-start gap-2 text-sm leading-relaxed">
                <LuClock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#0B5FFF]" />
                {medicamento.detalle}
              </p>
            </article>
          ))}
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <LuHistory aria-hidden="true" className="size-5" />
            Historial de modificaciones
          </h2>

          {historial.map((item) => (
            <article key={item.id} className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-xs">
              <p className="text-xs font-semibold text-[#424656]">{item.fecha}</p>
              <p className="text-base font-bold leading-snug">{item.cambio}</p>
              <p className="flex items-start gap-2 text-xs text-[#424656]">
                <LuUserRoundPen aria-hidden="true" className="size-4 shrink-0 text-[#0B5FFF]" />
                {item.autor}
              </p>
            </article>
          ))}

          {/* HARDCODEADO: todavía no hace nada; después abre el formulario para editar la medicación */}
          <button
            type="button"
            className="mt-2 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 py-3 font-semibold text-white shadow-md hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
          >
            <MdAddCircleOutline aria-hidden="true" className="size-5" />
            Registrar cambio en la medicación
          </button>
        </div>
      </main>
    </>
  );
}
