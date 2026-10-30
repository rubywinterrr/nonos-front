import VueltaAtras from "../../components/vueltaAtras";
import Header from "../../components/Header";
import { LuBrain, LuCircleCheck, LuPersonStanding, LuTriangleAlert, LuUsers, LuClipboardList } from "react-icons/lu";

// HARDCODEADO: reemplazar con los datos del adulto (usuariosService) y su grupo sanguíneo / cobertura
const datosPersonales = [
  { titulo: "Documento (DNI)", valor: "7.642.119", aclaracion: "" },
  { titulo: "Nacimiento", valor: "12/05/1946", aclaracion: "" },
  { titulo: "Grupo y Factor", valor: "0 Positivo (0+)", aclaracion: "" },
  { titulo: "Domicilio particular", valor: "Av. Rivadavia 4820, Caballito, CABA", aclaracion: "" },
  { titulo: "Cobertura médica", valor: "PAMI (N° 1502938492)", aclaracion: "Plan Médico de Cabecera asignado" },
];

// HARDCODEADO: reemplazar con condicionesService.getCondiciones(adultoId)
// el back todavía no tiene el estado de cada condición (Bajo control, Asistencia, Preservado)
const condiciones = [
  {
    id: "1",
    nombre: "Hipertensión arterial",
    estado: "Bajo control",
    descripcion: "Diagnosticada y bajo tratamiento farmacológico diario.",
    icono: <LuCircleCheck />,
  },
  {
    id: "2",
    nombre: "Movilidad reducida leve",
    estado: "Asistencia",
    descripcion: "Usa bastón canadiense para traslados y paseos fuera del hogar.",
    icono: <LuPersonStanding />,
  },
  {
    id: "3",
    nombre: "Estado cognitivo estable",
    estado: "Preservado",
    descripcion: "No presenta deterioro cognitivo severo ni desorientación temporal.",
    icono: <LuBrain />,
  },
];

// HARDCODEADO: reemplazar con los vínculos del adulto
const personas = [
  { id: "1", nombre: "Sofía Gómez", detalle: "Hija · Contacto prioritario" },
  { id: "2", nombre: "María Rodríguez", detalle: "Cuidadora · Lun a Vie 8:00 a 14:00" },
  { id: "3", nombre: "Dr. Esteban Martínez", detalle: "Médico cabecera · Consultorio San Cayetano" },
];

// pantalla del cuidador: ficha con los datos médicos del adulto, para mostrar en una guardia
export default function InfoAdultoCuidador() {
  return (
    <>
      <main className="mainBody text-[#0E1D28]">
        <Header />
        <VueltaAtras titulo="Información del adulto" compacto />

        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="nombre-adulto">
            <div className="flex items-center gap-3">
              <img src="/jose-perez-contactos.jpeg" alt="" className="size-16 shrink-0 rounded-xl bg-[#D4E4F3] object-cover" />
              <div>
                <h2 id="nombre-adulto" className="text-xl font-bold">José Pérez</h2>
                <p className="text-sm text-[#424656]">Papá · 78 años</p>
              </div>
            </div>

            <dl className="flex flex-col divide-y divide-[#D4E4F3] rounded-xl bg-[#EBF5FF]">
              {datosPersonales.map((dato) => (
                <div key={dato.titulo} className="flex flex-col gap-0.5 px-3 py-2.5">
                  <dt className="text-xs text-[#424656]">{dato.titulo}</dt>
                  <dd className="font-bold">{dato.valor}</dd>
                  {dato.aclaracion && <dd className="text-xs text-[#424656]">{dato.aclaracion}</dd>}
                </div>
              ))}
            </dl>
          </section>

          {/* HARDCODEADO: después sale de las condiciones marcadas como alergia */}
          <section className="flex flex-col gap-3 rounded-2xl border border-[#BA1A1A]/40 bg-[#FFDAD6]/60 p-4" aria-labelledby="alergia">
            <div className="flex items-center gap-3">
              <LuTriangleAlert aria-hidden="true" className="size-6 shrink-0 text-[#BA1A1A]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#BA1A1A]">Registro crítico</p>
                <h2 id="alergia" className="text-lg font-bold text-[#93000A]">¡ALERGIA CONFIRMADA!</h2>
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-[#BA1A1A]/40 bg-white p-3 text-[#93000A]">
              <p className="font-bold">Alergia severa a la Penicilina y derivados betalactámicos.</p>
              <p className="text-sm">No administrar sin autorización explícita de su médico de cabecera.</p>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl bg-white/70 p-4" aria-labelledby="condiciones">
            <div className="flex items-center justify-between gap-2">
              <h2 id="condiciones" className="flex items-center gap-2 text-lg font-bold">
                <LuClipboardList aria-hidden="true" className="size-8 shrink-0 rounded-lg bg-white p-1.5 text-[#1550E0]" />
                Condiciones Médicas
              </h2>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold">{condiciones.length} activas</span>
            </div>

            {condiciones.map((condicion) => (
              <article key={condicion.id} className="flex items-start gap-3 rounded-xl bg-white p-3">
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EBF5FF] text-lg text-[#1550E0]">
                  {condicion.icono}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-bold">{condicion.nombre}</h3>
                    <span className="rounded-md bg-[#84F6E6]/30 px-2 py-0.5 text-xs font-bold text-[#006A61]">
                      {condicion.estado}
                    </span>
                  </div>
                  <p className="text-sm text-[#424656]">{condicion.descripcion}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="flex flex-col gap-3 rounded-2xl bg-white/70 p-4" aria-labelledby="red-personas">
            <h2 id="red-personas" className="flex items-center gap-2 text-lg font-bold">
              <LuUsers aria-hidden="true" className="size-8 shrink-0 rounded-lg bg-white p-1.5 text-[#1550E0]" />
              Red de Personas Vinculadas
            </h2>
            <ul className="flex flex-col gap-2">
              {personas.map((persona) => (
                <li key={persona.id} className="rounded-xl bg-white p-3">
                  <p className="font-bold">{persona.nombre}</p>
                  <p className="text-sm text-[#424656]">{persona.detalle}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
