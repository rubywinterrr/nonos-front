import { useState } from "react";
import VueltaAtras from "../../components/vueltaAtras";
import Header from "../../components/Header";
import {
  LuCalendarDays,
  LuCircleCheck,
  LuCirclePlus,
  LuDiamond,
  LuEye,
  LuInfo,
  LuLink,
  LuListChecks,
  LuNotebookPen,
  LuSquarePlus,
  LuStethoscope,
  LuUserRound,
  LuWatch,
} from "react-icons/lu";

// HARDCODEADO: reemplazar con eventosHistorialService.getHistorial(adultoId)
// el back todavía no guarda "tipo" ni el nombre de quien lo registró (solo authorId)
const eventos = [
  {
    id: "1",
    tipo: "episodio",
    dia: "Hoy, 24 de Octubre",
    hora: "14:15 hs",
    descripcion:
      "Pulsación de botón de emergencia. Atendido de inmediato en domicilio por cuidadora María. Oxígeno en sangre: 97 %, dentro de parámetros habituales.",
    registradoPor: "Sistema NONOS",
  },
  {
    id: "2",
    tipo: "medicacion",
    dia: "Ayer, 23 de Octubre",
    hora: "18:30 hs",
    descripcion: "Ajuste de dosis en Losartán: pasa de 25mg a 50mg por la mañana tras control mensual.",
    registradoPor: "José Perez",
  },
  {
    id: "3",
    tipo: "visita",
    dia: "20 de Octubre",
    hora: "10:00 hs",
    descripcion:
      "Acompañamiento a consulta en consultorio de cabecera con Dr. Esteban Martínez. Laboratorio de rutina solicitado para noviembre.",
    registradoPor: "Sofía Gómez (Hija)",
  },
  {
    id: "4",
    tipo: "observacion",
    dia: "18 de Octubre",
    hora: "13:00 hs",
    descripcion:
      "Refirió molestia leve en rodilla derecha al caminar. Se le colocó rodillera elástica recomendada por traumatólogo.",
    registradoPor: "María Rodríguez (Cuidadora)",
  },
];

// botones para filtrar el historial: el valor tiene que coincidir con el "tipo" de cada evento
const filtros = [
  { valor: "todos", texto: "Todos" },
  { valor: "episodio", texto: "Episodios" },
  { valor: "medicacion", texto: "Medicación" },
  { valor: "visita", texto: "Visitas" },
  { valor: "observacion", texto: "Observaciones" },
];

// devuelve la etiqueta y los íconos que corresponden a cada tipo de evento
function datosDelTipo(tipo: string) {
  if (tipo === "episodio") {
    return { etiqueta: "EPISODIO RESUELTO", icono: <LuDiamond />, iconoEtiqueta: <LuCircleCheck /> };
  }
  if (tipo === "medicacion") {
    return { etiqueta: "CAMBIO MÉDICO", icono: <LuLink />, iconoEtiqueta: <LuListChecks /> };
  }
  if (tipo === "visita") {
    return { etiqueta: "CONSULTA MÉDICA", icono: <LuSquarePlus />, iconoEtiqueta: <LuCalendarDays /> };
  }
  return { etiqueta: "OBSERVACIÓN", icono: <LuEye />, iconoEtiqueta: <LuNotebookPen /> };
}

// elige el ícono de "Registrado por" según quién lo cargó
function iconoAutor(tipo: string) {
  if (tipo === "episodio") return <LuWatch aria-hidden="true" className="size-4 shrink-0" />;
  if (tipo === "medicacion") return <LuStethoscope aria-hidden="true" className="size-4 shrink-0" />;
  return <LuUserRound aria-hidden="true" className="size-4 shrink-0" />;
}

// pantalla del familiar/cuidador: bitácora de lo que le pasó al adulto, con filtros por tipo
export default function Historial() {
  const [filtro, setFiltro] = useState("todos");

  // si el filtro es "todos" se muestran todos; si no, solo los de ese tipo
  const eventosFiltrados = eventos.filter((evento) => filtro === "todos" || evento.tipo === filtro);

  return (
    <>
      <main className="mainBody text-[#0E1D28]">
        <Header />
        <div className="flex w-full flex-col gap-2">
          <VueltaAtras titulo="Historial de cuidados" compacto />
          <p className="text-sm font-semibold text-[#424656]">Registro de acontecimientos relevantes</p>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          <section className="flex items-start gap-3 rounded-2xl bg-white/70 p-4">
            <LuInfo aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#424656]" />
            <p className="text-sm leading-relaxed text-[#424656]">
              Bitácora cronológica con episodios importantes, cambios médicos, visitas y situaciones que
              hayan afectado el cuidado de José Perez.
            </p>
          </section>

          <div role="group" aria-label="Filtrar historial" className="flex gap-2 overflow-x-auto pb-1">
            {filtros.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                aria-pressed={filtro === opcion.valor}
                onClick={() => setFiltro(opcion.valor)}
                className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF] ${
                  filtro === opcion.valor
                    ? "bg-[#1550E0] text-white"
                    : "bg-white/70 text-[#0E1D28] hover:bg-white active:bg-[#DCEBFA]"
                }`}
              >
                {opcion.texto}
              </button>
            ))}
          </div>

          {eventosFiltrados.length === 0 && (
            <p className="text-center text-[#424656]">No hay registros de este tipo.</p>
          )}

          {eventosFiltrados.map((evento) => {
            const datos = datosDelTipo(evento.tipo);
            return (
              <article key={evento.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EBF5FF] text-base">
                      {datos.icono}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{evento.dia}</p>
                      <p className="text-xs text-[#424656]">{evento.hora}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-md bg-[#EBF5FF] px-2 py-1 text-xs font-bold text-[#424656]">
                    <span aria-hidden="true">{datos.iconoEtiqueta}</span>
                    {datos.etiqueta}
                  </span>
                </div>

                <div className="flex flex-col gap-2 rounded-xl bg-[#EBF5FF] p-3">
                  <p className="text-xs text-[#424656]">¿Qué ocurrió?</p>
                  <p className="text-sm leading-relaxed">{evento.descripcion}</p>
                </div>

                <p className="flex items-center gap-2 text-xs text-[#424656]">
                  {iconoAutor(evento.tipo)}
                  Registrado por: {evento.registradoPor}
                </p>
              </article>
            );
          })}

          {/* HARDCODEADO: todavía no hace nada; después abre el formulario de eventosHistorialService.crearEvento */}
          <button
            type="button"
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white shadow-md hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
          >
            <LuCirclePlus aria-hidden="true" className="size-5 shrink-0" />
            Registrar nueva observación
          </button>
        </div>
      </main>
    </>
  );
}
