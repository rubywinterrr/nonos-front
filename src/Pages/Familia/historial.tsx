import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import TarjetaHistorial, { type CategoriaHistorial } from "../../components/TarjetaHistorial";
import { useAuth } from "../../hooks/useAuth";
import { LuInfo, LuPlus } from "react-icons/lu";
import { LuX } from "react-icons/lu";

type Filtro = "todos" | CategoriaHistorial;
interface RegistroHistorial {
  fecha: string;
  hora: string;
  tipo: string;
  detalle: string;
  autor: string;
  categoria: CategoriaHistorial;
}

export default function Historial() {
  const { usuario } = useAuth();
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const nombreUsuario = usuario?.nombreCompleto || "Sofía Gómez";
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [cerrandoDialogo, setCerrandoDialogo] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState<CategoriaHistorial>("episodios");
  const [nuevoDetalle, setNuevoDetalle] = useState("");
  const [registros, setRegistros] = useState<RegistroHistorial[]>([
    { fecha: "Hoy, 24 de Octubre", hora: "14:15 hs", tipo: "Episodio resuelto", detalle: "Pulsación de botón de emergencia. Atendido de inmediato en domicilio por cuidadora María. Presión controlada: normal.", autor: "Sistema NONOS", categoria: "episodios" },
    { fecha: "Ayer, 23 de Octubre", hora: "18:30 hs", tipo: "Cambio médico", detalle: "Ajuste de dosis en Losartán: pasa de 25mg a 50mg por la mañana tras control mensual.", autor: "José Perez", categoria: "medicacion" },
    { fecha: "20 de Octubre", hora: "10:00 hs", tipo: "Consulta médica", detalle: "Acompañamiento a consulta en consultorio de cabecera con Dr. Esteban Martínez. Laboratorio de rutina solicitado para noviembre.", autor: "Sofía Gómez (Hija)", categoria: "visitas" },
    { fecha: "18 de Octubre", hora: "13:00 hs", tipo: "Observación", detalle: "Refirió molestia leve en rodilla derecha al caminar. Se le colocó rodillera elástica recomendada por traumatólogo.", autor: "María Rodríguez (Cuidadora)", categoria: "visitas" },
  ]);

  const abrirDialogo = () => {
    setCerrandoDialogo(false);
    setDialogoAbierto(true);
    dialogoRef.current?.showModal();
  };

  const cerrarDialogo = () => {
    if (!dialogoRef.current?.open || cerrandoDialogo) return;
    setCerrandoDialogo(true);
  };

  const finalizarCierre = () => {
    dialogoRef.current?.close();
    setCerrandoDialogo(false);
    setDialogoAbierto(false);
  };

  useEffect(() => {
    if (!dialogoAbierto) return;
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflowOriginal; };
  }, [dialogoAbierto]);

  const registrarCambio = () => {
    if (!nuevoDetalle.trim()) return;
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString("es-AR", { day: "numeric", month: "long" });
    const hora = `${ahora.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })} hs`;
    const tipo = nuevoTipo === "episodios" ? "Episodio" : nuevoTipo === "medicacion" ? "Cambio médico" : "Visita / consulta";
    setRegistros((actuales) => [{ fecha: `Hoy, ${fecha}`, hora, tipo, detalle: nuevoDetalle.trim(), autor: nombreUsuario, categoria: nuevoTipo }, ...actuales]);
    setNuevoDetalle("");
    cerrarDialogo();
  };

  const filtros: { valor: Filtro; texto: string }[] = [
    { valor: "todos", texto: "Todos" },
    { valor: "episodios", texto: "Episodios" },
    { valor: "medicacion", texto: "Medicación" },
    { valor: "visitas", texto: "Visitas / Consultas" },
  ];
  const registrosVisibles = registros.filter((registro) => filtro === "todos" || registro.categoria === filtro);

  return (
    <>
      <main className="mainBody gap-4">
        <Header />
        <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
          <VueltaAtras titulo="Historial de cuidados" compacto />
          <section aria-label="Descripción del historial" className="flex flex-col gap-2">
            <p className="text-sm font-semibold leading-5 text-[#435059]">Registro de acontecimientos relevantes</p>
            <div className="flex items-start gap-4 rounded-xl bg-white p-4">
              <LuInfo aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#435059]" />
              <p className="text-sm leading-5 text-[#435059]">Bitácora cronológica con episodios importantes, cambios médicos, visitas y situaciones que hayan afectado el cuidado de José Perez.</p>
            </div>
          </section>

          <div role="group" aria-label="Filtrar historial" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2 py-1">
              {filtros.map((opcion) => <button key={opcion.valor} type="button" aria-pressed={filtro === opcion.valor} onClick={() => setFiltro(opcion.valor)} className={`h-10 cursor-pointer whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors hover:bg-[#B7C8F0] active:bg-[#0F389D] active:text-white ${filtro === opcion.valor ? "bg-[#1550E0] text-white hover:bg-[#1245BF]" : "bg-white text-[#16222C]"}`}>{opcion.texto}</button>)}
            </div>
          </div>

          <section aria-label="Acontecimientos registrados" className="flex flex-col gap-4">
            {registrosVisibles.map((registro, indice) => <TarjetaHistorial key={`${registro.fecha}-${registro.hora}-${indice}`} {...registro} />)}
            {registrosVisibles.length === 0 && <p className="rounded-xl bg-white p-5 text-center text-sm text-[#435059]">No hay registros en esta categoría.</p>}
          </section>

          <button type="button" onClick={abrirDialogo} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#B7C8F0] bg-[#1550E0] px-4 text-base font-semibold text-white shadow-sm hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"><LuPlus aria-hidden="true" className="size-5" />Registrar cambio</button>
        </div>
      </main>

      <dialog
        ref={dialogoRef}
        onCancel={(evento) => { evento.preventDefault(); cerrarDialogo(); }}
        onClick={(evento) => { if (evento.target === evento.currentTarget) cerrarDialogo(); }}
        onAnimationEnd={(evento) => { if (cerrandoDialogo && evento.animationName === "popup-bajar") finalizarCierre(); }}
        aria-labelledby="titulo-nuevo-registro"
        className={`fixed inset-0 m-auto max-h-90/100 w-93/100 max-w-lg overflow-hidden rounded-3xl border-0 bg-white p-0 text-[#16222C] shadow-2xl backdrop:bg-[#16222C]/55 ${cerrandoDialogo ? "animate-[popup-bajar_200ms_ease-in_forwards]" : "animate-[popup-subir_250ms_ease-out]"}`}
      >
        <section role="document" className="flex max-h-90/100 flex-col gap-4 overflow-x-hidden overflow-y-auto rounded-3xl bg-white p-5">
          <div className="flex items-center justify-between gap-3"><h2 id="titulo-nuevo-registro" className="text-xl font-bold">Registrar acontecimiento</h2><button type="button" aria-label="Cerrar" onClick={cerrarDialogo} className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#E7EDFB] text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0]"><LuX aria-hidden="true" className="size-5" /></button></div>
          <label htmlFor="tipo-nuevo-registro" className="text-sm font-semibold">Tipo de acontecimiento</label>
          <select id="tipo-nuevo-registro" value={nuevoTipo} onChange={(evento) => setNuevoTipo(evento.target.value as CategoriaHistorial)} className="-mt-3 h-12 rounded-xl border border-[#D7DFE6] bg-[#F6F8FA] px-3 text-sm"><option value="episodios">Episodio</option><option value="medicacion">Cambio médico</option><option value="visitas">Visita / consulta</option></select>
          <label htmlFor="detalle-nuevo-registro" className="text-sm font-semibold">¿Qué ocurrió?</label>
          <textarea id="detalle-nuevo-registro" rows={4} value={nuevoDetalle} onChange={(evento) => setNuevoDetalle(evento.target.value)} placeholder="Escribí el acontecimiento" className="-mt-3 rounded-xl border border-[#D7DFE6] bg-[#F6F8FA] p-3 text-sm leading-5 focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]" />
          <p className="text-sm text-[#435059]">Se registrará con tu nombre ({nombreUsuario}) y la fecha y hora actuales.</p>
          <button type="button" disabled={!nuevoDetalle.trim()} onClick={registrarCambio} className="min-h-12 cursor-pointer rounded-xl bg-[#1550E0] px-4 font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D] disabled:cursor-not-allowed disabled:opacity-50">Guardar registro</button>
        </section>
      </dialog>
    </>
  );
}
