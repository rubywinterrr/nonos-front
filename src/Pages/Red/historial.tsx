import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import TarjetaHistorial, { type CategoriaHistorial } from "../../components/TarjetaHistorial";
import { useAuth } from "../../hooks/useAuth";
import {
  LuActivity,
  LuCalendarDays,
  LuCheck,
  LuClipboardList,
  LuInfo,
  LuMic,
  LuPill,
  LuPlus,
  LuShieldAlert,
  LuUserRound,
  LuUsersRound,
  LuX,
} from "react-icons/lu";

interface AlternativaDictado {
  transcript: string;
}

interface ResultadoDictado {
  isFinal: boolean;
  0: AlternativaDictado;
}

interface EventoDictado {
  resultIndex: number;
  results: ArrayLike<ResultadoDictado>;
}

interface ReconocimientoVoz {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((evento: EventoDictado) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type VentanaConDictado = Window & {
  SpeechRecognition?: new () => ReconocimientoVoz;
  webkitSpeechRecognition?: new () => ReconocimientoVoz;
};

const obtenerFechaHoraLocalParaInput = () => {
  const fecha = new Date();
  fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());
  return fecha.toISOString().slice(0, 16);
};

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
  const reconocimientoRef = useRef<ReconocimientoVoz | null>(null);
  const nombreUsuario = usuario?.nombreCompleto || "Sofía Gómez";
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [cerrandoDialogo, setCerrandoDialogo] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState<CategoriaHistorial>("episodios");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("Observación cotidiana");
  const [nuevoDetalle, setNuevoDetalle] = useState("");
  const [momentoSuceso, setMomentoSuceso] = useState(obtenerFechaHoraLocalParaInput);
  const [dictando, setDictando] = useState(false);
  const [errorDictado, setErrorDictado] = useState("");
  const [prioritaria, setPrioritaria] = useState(false);
  const [registros, setRegistros] = useState<RegistroHistorial[]>([
    { fecha: "Hoy, 24 de Octubre", hora: "14:15 hs", tipo: "Episodio resuelto", detalle: "Pulsación de botón de emergencia. Atendido de inmediato en domicilio por cuidadora María. Oxígeno en sangre: 97 %, dentro de parámetros habituales.", autor: "Sistema NONOS", categoria: "episodios" },
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
    reconocimientoRef.current?.stop();
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

  useEffect(() => () => reconocimientoRef.current?.stop(), []);

  const alternarDictado = () => {
    if (dictando) {
      reconocimientoRef.current?.stop();
      return;
    }

    const ventana = window as VentanaConDictado;
    const SpeechRecognition = ventana.SpeechRecognition || ventana.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorDictado("Este navegador no permite dictado por voz.");
      return;
    }

    const reconocimiento = new SpeechRecognition();
    reconocimiento.lang = "es-AR";
    reconocimiento.continuous = true;
    reconocimiento.interimResults = false;
    reconocimiento.onresult = (evento) => {
      const texto = Array.from({ length: evento.results.length - evento.resultIndex }, (_, indice) => evento.results[evento.resultIndex + indice])
        .filter((resultado) => resultado.isFinal)
        .map((resultado) => resultado[0].transcript.trim())
        .filter(Boolean)
        .join(" ");
      if (!texto) return;

      setNuevoDetalle((actual) => `${actual}${actual && !actual.endsWith(" ") ? " " : ""}${texto}`.slice(0, 400));
      setErrorDictado("");
    };
    reconocimiento.onerror = () => {
      setDictando(false);
      setErrorDictado("No se pudo acceder al micrófono.");
    };
    reconocimiento.onend = () => {
      reconocimientoRef.current = null;
      setDictando(false);
    };

    try {
      reconocimientoRef.current = reconocimiento;
      reconocimiento.start();
      setErrorDictado("");
      setDictando(true);
    } catch {
      reconocimientoRef.current = null;
      setErrorDictado("No se pudo iniciar el dictado por voz.");
    }
  };

  const registrarCambio = () => {
    if (!nuevoDetalle.trim()) return;
    const fechaSuceso = new Date(momentoSuceso);
    if (Number.isNaN(fechaSuceso.getTime())) return;
    const ahora = new Date();
    const mismoDia = fechaSuceso.toDateString() === ahora.toDateString();
    const fecha = fechaSuceso.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: fechaSuceso.getFullYear() === ahora.getFullYear() ? undefined : "numeric" });
    const hora = `${fechaSuceso.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })} hs`;
    const categoria: CategoriaHistorial = tipoSeleccionado === "Episodio/Incidente"
      ? "episodios"
      : tipoSeleccionado === "Cambio medicación"
        ? "medicacion"
        : tipoSeleccionado === "Visita familiar" || tipoSeleccionado === "Observación cotidiana"
          ? "visitas"
          : nuevoTipo;
    const tipo = prioritaria && tipoSeleccionado === "Observación cotidiana" ? "Observación prioritaria" : tipoSeleccionado;
    setRegistros((actuales) => [{ fecha: `${mismoDia ? "Hoy, " : ""}${fecha}`, hora, tipo, detalle: nuevoDetalle.trim(), autor: nombreUsuario, categoria }, ...actuales]);
    setNuevoDetalle("");
    setMomentoSuceso(obtenerFechaHoraLocalParaInput());
    setPrioritaria(false);
    reconocimientoRef.current?.stop();
    cerrarDialogo();
  };

  const fechaHoraSeleccionada = new Date(momentoSuceso);
  const fechaHoraTexto = Number.isNaN(fechaHoraSeleccionada.getTime())
    ? "Seleccioná la fecha y hora"
    : `${fechaHoraSeleccionada.toLocaleDateString("es-AR", { day: "numeric", month: "long" })} · ${fechaHoraSeleccionada.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })} hs`;

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
        onAnimationEnd={(evento) => { if (evento.target === evento.currentTarget && cerrandoDialogo && evento.animationName === "popup-bajar") finalizarCierre(); }}
        aria-labelledby="titulo-nuevo-registro"
        className="fixed top-auto bottom-0 left-1/2 z-70 m-0 h-90/100 max-h-dvh w-93/100 max-w-lg -translate-x-1/2 overflow-hidden rounded-t-3xl border-0 bg-white p-0 text-[#16222C] shadow-2xl backdrop:bg-[#B7C8F0]/70"
      >
        <section
          role="document"
          onAnimationEnd={(evento) => { if (cerrandoDialogo && evento.animationName === "popup-bajar") finalizarCierre(); }}
          className={`flex h-full flex-col ${cerrandoDialogo ? "animate-[popup-bajar_250ms_ease-in_forwards]" : "animate-[popup-subir_300ms_ease-out]"}`}
        >
          <div className="shrink-0 px-4 pt-3">
            <button type="button" aria-label="Cerrar" onClick={cerrarDialogo} className="mx-auto block h-6 w-full cursor-pointer" >
              <span className="mx-auto block h-1.5 w-12 rounded-full bg-[#B7C8F0]" />
            </button>
            <div className="flex h-16 items-center justify-between gap-2">
              <h2 id="titulo-nuevo-registro" className="text-xl font-bold tracking-tight sm:text-2xl">Registrar observación</h2>
              <button type="button" aria-label="Cerrar" onClick={cerrarDialogo} className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#E7EDFB] text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0]"><LuX aria-hidden="true" className="size-5" /></button>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto px-4 pb-6">
            <div className="flex items-center gap-3 rounded-2xl border border-[#D7DFE6] bg-[#F6F8FA] p-4 shadow-xs">
              <img src="/jose-perez-contactos.jpeg" alt="" className="size-12 shrink-0 rounded-full object-cover" />
              <div className="min-w-0">
                <span className="mb-1 inline-flex rounded-full bg-[#E7EDFB] px-2 py-0.5 text-xs font-bold uppercase text-[#0D328B]">Paciente asignado</span>
                <h3 className="font-bold leading-5">José Pérez</h3>
                <p className="text-sm font-semibold leading-5 text-[#435059]">Papá · 78 años</p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl bg-white py-3">
              <fieldset>
                <legend className="mb-2 text-xs font-bold uppercase tracking-wide">Tipo de evento <span className="text-amber-700">*</span></legend>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" aria-pressed={tipoSeleccionado === "Observación cotidiana"} onClick={() => { setTipoSeleccionado("Observación cotidiana"); setNuevoTipo("visitas"); }} className={`flex min-h-12 cursor-pointer items-center justify-center gap-1 rounded-xl border p-2 text-xs font-semibold transition-colors hover:bg-[#D3E0F8] active:bg-[#B7C8F0] ${tipoSeleccionado === "Observación cotidiana" ? "border-[#1550E0] bg-[#1550E0] text-white hover:bg-[#1245BF]" : "border-[#7E8C97] bg-[#E9EEF2] text-[#16222C]"}`}>
                    <LuClipboardList aria-hidden="true" className="size-4 shrink-0" />Observación cotidiana
                  </button>
                  <button type="button" aria-pressed={tipoSeleccionado === "Episodio/Incidente"} onClick={() => { setTipoSeleccionado("Episodio/Incidente"); setNuevoTipo("episodios"); }} className={`flex min-h-12 cursor-pointer items-center justify-center gap-1 rounded-xl border p-2 text-xs font-semibold transition-colors hover:bg-[#D3E0F8] active:bg-[#B7C8F0] ${tipoSeleccionado === "Episodio/Incidente" ? "border-[#1550E0] bg-[#1550E0] text-white hover:bg-[#1245BF]" : "border-[#7E8C97] bg-[#E9EEF2] text-[#16222C]"}`}>
                    <LuActivity aria-hidden="true" className="size-4 shrink-0" />Episodio/Incidente
                  </button>
                  <button type="button" aria-pressed={tipoSeleccionado === "Visita familiar"} onClick={() => { setTipoSeleccionado("Visita familiar"); setNuevoTipo("visitas"); }} className={`flex min-h-12 cursor-pointer items-center justify-center gap-1 rounded-xl border p-2 text-xs font-semibold transition-colors hover:bg-[#D3E0F8] active:bg-[#B7C8F0] ${tipoSeleccionado === "Visita familiar" ? "border-[#1550E0] bg-[#1550E0] text-white hover:bg-[#1245BF]" : "border-[#7E8C97] bg-[#E9EEF2] text-[#16222C]"}`}>
                    <LuUsersRound aria-hidden="true" className="size-4 shrink-0" />Visita familiar
                  </button>
                  <button type="button" aria-pressed={tipoSeleccionado === "Cambio medicación"} onClick={() => { setTipoSeleccionado("Cambio medicación"); setNuevoTipo("medicacion"); }} className={`flex min-h-12 cursor-pointer items-center justify-center gap-1 rounded-xl border p-2 text-xs font-semibold transition-colors hover:bg-[#D3E0F8] active:bg-[#B7C8F0] ${tipoSeleccionado === "Cambio medicación" ? "border-[#1550E0] bg-[#1550E0] text-white hover:bg-[#1245BF]" : "border-[#7E8C97] bg-[#E9EEF2] text-[#16222C]"}`}>
                    <LuPill aria-hidden="true" className="size-4 shrink-0" />Cambio medicación
                  </button>
                </div>
              </fieldset>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="detalle-nuevo-registro" className="text-xs font-bold uppercase tracking-wide">¿Qué ocurrió o qué observaste?</label>
                  <span aria-live="polite" className="shrink-0 text-xs text-[#1550E0]">{nuevoDetalle.length} / 400</span>
                </div>
                <div className="relative">
                  <textarea id="detalle-nuevo-registro" maxLength={400} rows={5} value={nuevoDetalle} onChange={(evento) => setNuevoDetalle(evento.target.value)} placeholder="Describí brevemente el estado de ánimo, molestias, alimentación o novedades de la jornada..." className="w-full resize-y rounded-xl border border-[#7E8C97] bg-[#F6F8FA] p-3 pr-12 text-sm leading-5 placeholder:text-[#435059] focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]" />
                  <button type="button" aria-label={dictando ? "Detener dictado" : "Dictar por voz"} aria-pressed={dictando} onClick={alternarDictado} className={`absolute bottom-3 right-3 flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#B7C8F0] hover:bg-[#E7EDFB] active:bg-[#D3E0F8] ${dictando ? "bg-[#1550E0] text-white" : "bg-white text-[#1550E0]"}`}><LuMic aria-hidden="true" className="size-4" /></button>
                </div>
                {dictando && <p role="status" className="text-xs font-semibold text-[#1550E0]">Escuchando… Tocá el micrófono para detener.</p>}
                {errorDictado && <p role="status" className="text-xs text-red-700">{errorDictado}</p>}
              </div>
            </div>

            <section aria-label="Momento del suceso" className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide">Momento del suceso</h3>
              <label htmlFor="momento-suceso" className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#7E8C97] bg-[#F6F8FA] p-3 focus-within:border-[#1550E0] focus-within:ring-2 focus-within:ring-[#B7C8F0]">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E7EDFB] text-[#1550E0]"><LuCalendarDays aria-hidden="true" className="size-4" /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold">{fechaHoraTexto}</span><span className="block text-xs text-[#1550E0]">Zona horaria local</span></span>
                <input id="momento-suceso" type="datetime-local" required value={momentoSuceso} onChange={(evento) => setMomentoSuceso(evento.target.value)} aria-label="Seleccionar fecha y hora del suceso" className="min-w-0 max-w-40 cursor-pointer rounded-lg border border-[#B7C8F0] bg-[#E7EDFB] px-2 py-2 text-xs font-bold text-[#0D328B] focus:outline-none" />
              </label>
            </section>

            <section aria-label="Registrado por" className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide">Registrado por</h3>
              <div className="flex min-h-11 items-center gap-3 rounded-xl border border-[#D7DFE6] bg-[#F6F8FA] px-3">
                <LuUserRound aria-hidden="true" className="size-7 shrink-0 rounded-lg bg-[#E7EDFB] p-1.5 text-[#1550E0]" />
                <span className="text-xs font-bold">{nombreUsuario}</span>
              </div>
              <p className="flex items-start gap-2 rounded-xl border border-[#B7C8F0] bg-[#E7EDFB] p-3 text-xs leading-4"><span className="mt-1 size-2 shrink-0 rounded-full bg-green-700" />Turno activo · Sincronizado en tiempo real con familiares</p>
            </section>

            <button type="button" role="switch" aria-checked={prioritaria} onClick={() => setPrioritaria((actual) => !actual)} className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#7E8C97] bg-[#E9EEF2] p-3 text-left hover:bg-[#D3E0F8] active:bg-[#B7C8F0]">
              <span className="flex min-w-0 items-center gap-3"><LuShieldAlert aria-hidden="true" className="size-9 shrink-0 rounded-xl bg-[#E7EDFB] p-2 text-[#1550E0]" /><span><span className="block text-xs font-bold">Marcar como observación prioritaria</span><span className="block text-xs leading-4 text-[#1550E0]">Notificará de inmediato a familiares.</span></span></span>
              <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${prioritaria ? "bg-[#1550E0]" : "bg-[#B7C8F0]"}`}><span className={`absolute top-0.5 size-5 rounded-full border border-[#B7C8F0] bg-white transition-transform ${prioritaria ? "translate-x-5" : "left-0.5"}`} />
              </span>
            </button>

            <div className="flex flex-col gap-3 pt-1">
              <button type="button" disabled={!nuevoDetalle.trim()} onClick={registrarCambio} className="flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 text-base font-semibold text-white shadow-sm hover:bg-[#1245BF] active:bg-[#0F389D] disabled:cursor-not-allowed disabled:opacity-50"><LuCheck aria-hidden="true" className="size-4" />Guardar observación</button>
              <button type="button" onClick={cerrarDialogo} className="flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#B7C8F0] bg-[#E7EDFB] px-4 text-base font-semibold text-[#0D328B] hover:bg-[#D3E0F8] active:border-[#1550E0] active:bg-[#B7C8F0]"><LuX aria-hidden="true" className="size-4" />Descartar</button>
            </div>
          </div>
        </section>
      </dialog>
    </>
  );
}
