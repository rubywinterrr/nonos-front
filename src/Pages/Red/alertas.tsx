import { useEffect, useState } from "react";
import VueltaAtras from "../../components/vueltaAtras";
import { LuCheck, LuMessageSquareText, LuSiren, LuTriangleAlert } from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";
import { alertasService, type Alerta, type Feedback, type TipoAlerta } from "../../services/alertasService";
import type { AdultoMayorVinculado } from "../../services/usuariosService";
import { buscarAdultoSeleccionado } from "../../utils/adultoQueSeMira";
import { diaYHora } from "../../utils/formatoSignos";

// nombre de cada tipo de alerta para mostrar
function textoTipo(tipo: TipoAlerta) {
  if (tipo === "SOS_DIRECTO") return "Pidió ayuda";
  if (tipo === "FC_ELEVADA") return "Pulso alto";
  if (tipo === "FC_BAJA") return "Pulso bajo";
  if (tipo === "SP02_BAJO") return "Oxígeno bajo";
  if (tipo === "MEDICACION_STOCK_BAJO") return "Quedan pocas pastillas";
  if (tipo === "CAMBIO_DE_RUTINA") return "Cambio en la rutina";
  // el back no guarda quién entró: solo cuándo
  if (tipo === "QR_ESCANEADO") return "Acceso con el código de emergencia";
  return "Logro";
}

// texto y colores del estado
function datosDelEstado(alerta: Alerta) {
  if (alerta.estado === "PENDIENTE") return { texto: "Pendiente", clases: "bg-[#FFDBD2] text-[#AD2B00]" };
  if (alerta.estado === "RESUELTA") return { texto: "Resuelta", clases: "bg-[#E8FAF1] text-[#0B4C2B]" };
  return { texto: "Cancelada", clases: "bg-[#E9EEF2] text-[#435059]" };
}

// pantalla del familiar/cuidador: las alertas del adulto que mira, para marcarlas como resueltas
// y dejar un comentario de qué pasó. No está en el Figma: sigue el estilo de NONOS
export default function AlertasRed() {
  const { usuario } = useAuth();
  const [adulto, setAdulto] = useState<AdultoMayorVinculado | null>(null);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [soloPendientes, setSoloPendientes] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // se suma 1 después de resolver una alerta, para volver a traerlas
  const [recargar, setRecargar] = useState(0);
  // la alerta que tiene abierto el formulario de comentario
  const [comentando, setComentando] = useState<string | null>(null);
  const [comentario, setComentario] = useState("");
  const [fueReal, setFueReal] = useState(true);
  // comentarios ya cargados de cada alerta (se piden al tocar "Ver comentarios")
  const [comentarios, setComentarios] = useState<Record<string, Feedback[]>>({});
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    const miId = usuario.id;

    // trae el adulto que se mira y sus alertas
    const cargar = async () => {
      try {
        const elegido = await buscarAdultoSeleccionado(miId);
        setAdulto(elegido);
        if (!elegido) return;
        setAlertas(await alertasService.getAlertas(elegido.id));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las alertas.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario, recargar]);

  // marca la alerta como resuelta
  const resolver = async (id: string) => {
    setError(null);
    setMensaje(null);
    try {
      await alertasService.confirmarAlerta(id, true);
      setMensaje("La alerta quedó resuelta.");
      setRecargar(recargar + 1);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo resolver la alerta.");
    }
  };

  // guarda el comentario de qué pasó con la alerta
  const guardarComentario = async (alertaId: string) => {
    if (!comentario.trim()) {
      setError("Escribí qué pasó antes de guardar.");
      return;
    }
    setError(null);
    try {
      await alertasService.crearFeedback(alertaId, comentario.trim(), fueReal);
      setComentando(null);
      setComentario("");
      setMensaje("Tu comentario quedó guardado.");
      verComentarios(alertaId);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo guardar el comentario.");
    }
  };

  // trae los comentarios que ya tiene una alerta
  const verComentarios = async (alertaId: string) => {
    try {
      const lista = await alertasService.getFeedback(alertaId);
      setComentarios({ ...comentarios, [alertaId]: lista });
    } catch (err) {
      console.error(err);
      setComentarios({ ...comentarios, [alertaId]: [] });
    }
  };

  const visibles = soloPendientes ? alertas.filter((a) => a.estado === "PENDIENTE") : alertas;
  const pendientes = alertas.filter((a) => a.estado === "PENDIENTE").length;

  return (
    <main id="contenido-principal" tabIndex={-1} className="mainBody gap-4 text-[#0E1D28]">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Alertas" compacto />

        {adulto && (
          <p className="text-sm text-[#424656]">
            Alertas de {adulto.nombreCompleto}. Marcá como resueltas las que ya se atendieron y contá qué pasó.
          </p>
        )}

        <div role="group" aria-label="Filtrar alertas" className="grid grid-cols-2 gap-1 rounded-xl bg-white/70 p-1">
          <button
            type="button"
            aria-pressed={soloPendientes}
            onClick={() => setSoloPendientes(true)}
            className={`min-h-11 cursor-pointer rounded-lg font-semibold ${soloPendientes ? "bg-[#1550E0] text-white" : "hover:bg-white"}`}
          >
            Pendientes ({pendientes})
          </button>
          <button
            type="button"
            aria-pressed={!soloPendientes}
            onClick={() => setSoloPendientes(false)}
            className={`min-h-11 cursor-pointer rounded-lg font-semibold ${!soloPendientes ? "bg-[#1550E0] text-white" : "hover:bg-white"}`}
          >
            Todas ({alertas.length})
          </button>
        </div>

        {cargando && <p role="status" className="text-center text-[#424656]">Cargando alertas…</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
        {mensaje && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{mensaje}</p>}
        {!cargando && !adulto && !error && (
          <p className="rounded-2xl bg-white p-4 text-sm">Todavía no estás vinculado a ningún adulto mayor.</p>
        )}
        {!cargando && adulto && visibles.length === 0 && (
          <p className="rounded-2xl bg-white p-4 text-sm">{soloPendientes ? "No hay alertas pendientes." : "Todavía no hubo alertas."}</p>
        )}

        <ul className="flex flex-col gap-3">
          {visibles.map((alerta) => {
            const estado = datosDelEstado(alerta);
            const lista = comentarios[alerta.id];
            return (
              <li key={alerta.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="flex items-center gap-2 font-bold">
                    {alerta.categoria === "CRITICO" ? (
                      <LuSiren aria-hidden="true" className="size-8 shrink-0 rounded-lg bg-[#FFDBD2] p-1.5 text-[#AD2B00]" />
                    ) : (
                      <LuTriangleAlert aria-hidden="true" className="size-8 shrink-0 rounded-lg bg-[#E0F0FF] p-1.5 text-[#0B5FFF]" />
                    )}
                    {textoTipo(alerta.tipo)}
                  </h2>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${estado.clases}`}>{estado.texto}</span>
                </div>
                <p className="text-sm leading-relaxed text-[#424656]">{alerta.descripcion}</p>
                <p className="text-xs text-[#424656]">{diaYHora(alerta.createdAt)}</p>

                {alerta.estado === "PENDIENTE" && (
                  <button
                    type="button"
                    onClick={() => resolver(alerta.id)}
                    className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1550E0] font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D]"
                  >
                    <LuCheck aria-hidden="true" className="size-4" />
                    Marcar como resuelta
                  </button>
                )}

                {lista && lista.length > 0 && (
                  <ul className="flex flex-col gap-2 rounded-lg bg-[#EBF5FF] p-3">
                    {lista.map((fb) => (
                      <li key={fb.id} className="text-sm">
                        <span className="font-semibold">{fb.autor ? fb.autor.nombreCompleto : "Alguien de la red"}:</span>{" "}
                        {fb.comentario} <span className="text-[#424656]">({fb.fueEmergenciaReal ? "fue real" : "falsa alarma"})</span>
                      </li>
                    ))}
                  </ul>
                )}
                {lista && lista.length === 0 && <p className="text-sm text-[#424656]">Todavía no hay comentarios.</p>}

                {comentando === alerta.id ? (
                  <div className="flex flex-col gap-2 rounded-lg border border-[#B7C8F0] bg-[#EBF5FF] p-3">
                    <label className="flex flex-col gap-1 text-sm font-semibold">
                      ¿Qué pasó?
                      <textarea
                        rows={3}
                        value={comentario}
                        onChange={(evento) => setComentario(evento.target.value)}
                        className="rounded-lg border border-[#D7DFE6] bg-white p-2 text-base font-normal focus:border-[#1550E0] focus:outline-none"
                      />
                    </label>
                    <div role="group" aria-label="¿Fue una emergencia real?" className="grid grid-cols-2 gap-2">
                      <button type="button" aria-pressed={fueReal} onClick={() => setFueReal(true)} className={`min-h-11 cursor-pointer rounded-lg text-sm font-semibold ${fueReal ? "bg-[#1550E0] text-white" : "bg-white"}`}>
                        Fue real
                      </button>
                      <button type="button" aria-pressed={!fueReal} onClick={() => setFueReal(false)} className={`min-h-11 cursor-pointer rounded-lg text-sm font-semibold ${!fueReal ? "bg-[#1550E0] text-white" : "bg-white"}`}>
                        Falsa alarma
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => guardarComentario(alerta.id)} className="min-h-11 cursor-pointer rounded-lg bg-[#1550E0] font-semibold text-white hover:bg-[#1245BF]">
                        Guardar
                      </button>
                      <button type="button" onClick={() => setComentando(null)} className="min-h-11 cursor-pointer rounded-lg bg-white font-semibold hover:bg-[#E9EEF2]">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {/* el back guarda un solo comentario por alerta: si ya hay uno, no se ofrece escribir otro */}
                    {!(lista && lista.length > 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          setComentando(alerta.id);
                          setComentario("");
                          setFueReal(true);
                        }}
                        className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#EBF5FF] text-sm font-semibold text-[#0049CC] hover:bg-[#DCEBFA]"
                      >
                        <LuMessageSquareText aria-hidden="true" className="size-4" />
                        Contar qué pasó
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => verComentarios(alerta.id)}
                      className="min-h-11 cursor-pointer rounded-lg bg-[#EBF5FF] text-sm font-semibold text-[#0049CC] hover:bg-[#DCEBFA]"
                    >
                      Ver comentarios
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
