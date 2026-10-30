import { useEffect, useState } from "react";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService } from "../../services/usuariosService";
import { LuCheck, LuInfo, LuPencil, LuRotateCcw, LuUserRound, LuUsersRound } from "react-icons/lu";

const TEXTO_EVITAR = "Para evitar en una emergencia:";
const TEXTO_ACOMPANANTE = "\n\nQuién quiero que me acompañe:";
const TEXTO_ATENCION = "\n\nCómo prefiero ser atendido:";

const VALOR_DECISION = "Quiero que mi hija Sofía esté presente en todo momento y tome las decisiones de atención si yo no puedo.";
const VALOR_INTERNACION = "Prefiero permanecer en mi domicilio siempre que sea médicamente viable. En caso de requerir traslado, priorizar Sanatorio San Cayetano.";

function armarMedidas(evitar: string, acompanante: string, atencion: string) {
  return `${TEXTO_EVITAR} ${evitar}${TEXTO_ACOMPANANTE} ${acompanante}${TEXTO_ATENCION} ${atencion}`;
}

function separarMedidas(texto: string) {
  const inicioAcompanante = texto.indexOf(TEXTO_ACOMPANANTE);
  const inicioAtencion = texto.indexOf(TEXTO_ATENCION);
  if (!texto.startsWith(TEXTO_EVITAR) || inicioAcompanante === -1 || inicioAtencion === -1) {
    return { evitar: texto, acompanante: "", atencion: "" };
  }

  return {
    evitar: texto.slice(TEXTO_EVITAR.length, inicioAcompanante).trim(),
    acompanante: texto.slice(inicioAcompanante + TEXTO_ACOMPANANTE.length, inicioAtencion).trim(),
    atencion: texto.slice(inicioAtencion + TEXTO_ATENCION.length).trim(),
  };
}

export default function MedidasAnticipadas() {
  const { usuario } = useAuth();
  const [idAdulto, setIdAdulto] = useState<string | null>(null);
  const [decision, setDecision] = useState(VALOR_DECISION);
  const [acompanamiento, setAcompanamiento] = useState(VALOR_DECISION);
  const [internacion, setInternacion] = useState(VALOR_INTERNACION);
  const [editandoDecision, setEditandoDecision] = useState(false);
  const [editandoAcompanamiento, setEditandoAcompanamiento] = useState(false);
  const [editandoInternacion, setEditandoInternacion] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario?.id) return;
    let cancelado = false;

    const cargarIndicaciones = async () => {
      setCargando(true);
      setError(null);
      try {
        const adultos = await usuarioService.getAdultosMayoresVinculados(usuario.id);
        const adulto = adultos[0];
        if (!adulto) {
          if (!cancelado) setError("No se encontró un adulto mayor vinculado a esta cuenta.");
          return;
        }

        const datos = await usuarioService.getUsuarioById(adulto.id);
        if (cancelado) return;
        setIdAdulto(adulto.id);
        if (datos.medidasAnticipadas?.trim()) {
          const partes = separarMedidas(datos.medidasAnticipadas);
          setDecision(partes.evitar || VALOR_DECISION);
          setAcompanamiento(partes.acompanante || VALOR_DECISION);
          setInternacion(partes.atencion || VALOR_INTERNACION);
        }
      } catch (err) {
        console.error(err);
        if (!cancelado) setError("No se pudieron cargar las medidas anticipadas.");
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    void cargarIndicaciones();
    return () => { cancelado = true; };
  }, [usuario?.id]);

  const confirmarIndicaciones = async () => {
    if (!idAdulto) {
      setError("No se encontró un adulto vinculado para guardar las indicaciones.");
      return;
    }
    setGuardando(true);
    setError(null);
    setMensaje(null);
    try {
      await usuarioService.editarMedidasAnticipadas(idAdulto, armarMedidas(decision, acompanamiento, internacion));
      setEditandoDecision(false);
      setEditandoAcompanamiento(false);
      setEditandoInternacion(false);
      setMensaje("Las indicaciones se guardaron correctamente.");
    } catch (err) {
      console.error(err);
      setError("No se pudieron guardar las indicaciones. Verificá que tengas permiso para editarlas.");
    } finally {
      setGuardando(false);
    }
  };

  const restablecerIndicaciones = () => {
    setDecision(VALOR_DECISION);
    setAcompanamiento(VALOR_DECISION);
    setInternacion(VALOR_INTERNACION);
    setMensaje(null);
    setError(null);
  };

  return (
    <main className="mainBody gap-4">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Medidas anticipadas" />

        <section aria-label="Información sobre medidas anticipadas" className="flex w-full items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
          <LuInfo aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#4A7FBF]" />
          <p className="text-sm leading-6 text-gray-600">
            Estas medidas fueron registradas por José y consensuadas con la familia para guiar a los médicos y cuidadores en situaciones críticas.
          </p>
        </section>

        {cargando && <p role="status" className="rounded-xl bg-white p-4 text-sm text-gray-600">Cargando las medidas anticipadas...</p>}

        <section aria-label="Medidas anticipadas registradas" className="flex w-full flex-col gap-4">
          <article className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <LuUsersRound aria-hidden="true" className="size-10 shrink-0 rounded-xl border border-gray-200 bg-gray-100 p-2 text-[#4A7FBF]" />
              <h2 className="text-lg font-semibold">Decisiones críticas</h2>
            </div>
            <blockquote className="w-full rounded-r-lg border-l-4 border-[#1550E0] bg-gray-100 p-4 text-base italic leading-6 text-[#16222C]">
              {editandoDecision ? <textarea aria-label="Editar decisiones críticas" value={decision} onChange={(evento) => setDecision(evento.target.value)} className="min-h-25 w-full resize-y bg-transparent not-italic focus:outline-none" /> : `“${decision}”`}
            </blockquote>
            <p className="flex items-start gap-2 text-sm leading-5 text-gray-600">
              <LuUserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>Registrado por Roberto Gómez <span className="font-bold text-[#16222C]">(confirmado por Sofía Gómez)</span>.</span>
            </p>
            <button type="button" aria-pressed={editandoDecision} onClick={() => setEditandoDecision((actual) => !actual)} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E9EEF6] p-3 text-base font-medium text-[#16222C] hover:bg-gray-200 active:border active:border-[#1550E0] active:bg-[#B7C8F0]">
              <LuPencil aria-hidden="true" className="size-4 text-[#1550E0]" />{editandoDecision ? "Finalizar edición" : "Editar indicación"}
            </button>
          </article>

          <article className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <LuUsersRound aria-hidden="true" className="size-10 shrink-0 rounded-xl border border-gray-200 bg-gray-100 p-2 text-[#4A7FBF]" />
              <h2 className="text-lg font-semibold">Decisiones críticas</h2>
            </div>
            <blockquote className="w-full rounded-r-lg border-l-4 border-[#1550E0] bg-gray-100 p-4 text-base italic leading-6 text-[#16222C]">
              {editandoAcompanamiento ? <textarea aria-label="Editar acompañamiento" value={acompanamiento} onChange={(evento) => setAcompanamiento(evento.target.value)} className="min-h-25 w-full resize-y bg-transparent not-italic focus:outline-none" /> : `“${acompanamiento}”`}
            </blockquote>
            <p className="flex items-start gap-2 text-sm leading-5 text-gray-600">
              <LuUserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>Registrado por Roberto Gómez <span className="font-bold text-[#16222C]">(confirmado por Sofía Gómez)</span>.</span>
            </p>
            <button type="button" aria-pressed={editandoAcompanamiento} onClick={() => setEditandoAcompanamiento((actual) => !actual)} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E9EEF6] p-3 text-base font-medium text-[#16222C] hover:bg-gray-200 active:border active:border-[#1550E0] active:bg-[#B7C8F0]">
              <LuPencil aria-hidden="true" className="size-4 text-[#1550E0]" />{editandoAcompanamiento ? "Finalizar edición" : "Editar indicación"}
            </button>
          </article>

          <article className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <LuUsersRound aria-hidden="true" className="size-10 shrink-0 rounded-xl border border-gray-200 bg-gray-100 p-2 text-[#4A7FBF]" />
              <h2 className="text-lg font-semibold">Internación y entorno</h2>
            </div>
            <blockquote className="w-full rounded-r-lg border-l-4 border-[#1550E0] bg-gray-100 p-4 text-base italic leading-6 text-[#16222C]">
              {editandoInternacion ? <textarea aria-label="Editar internación y entorno" value={internacion} onChange={(evento) => setInternacion(evento.target.value)} className="min-h-25 w-full resize-y bg-transparent not-italic focus:outline-none" /> : `“${internacion}”`}
            </blockquote>
            <p className="flex items-start gap-2 text-sm leading-5 text-gray-600">
              <LuUserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>Registrado por Roberto Gómez.</span>
            </p>
            <button type="button" aria-pressed={editandoInternacion} onClick={() => setEditandoInternacion((actual) => !actual)} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E9EEF6] p-3 text-base font-medium text-[#16222C] hover:bg-gray-200 active:border active:border-[#1550E0] active:bg-[#B7C8F0]">
              <LuPencil aria-hidden="true" className="size-4 text-[#1550E0]" />{editandoInternacion ? "Finalizar edición" : "Editar indicación"}
            </button>
          </article>
        </section>

        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {mensaje && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{mensaje}</p>}

        <div className="flex w-full flex-col gap-3">
          <button type="button" onClick={confirmarIndicaciones} disabled={guardando || cargando} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#1550E0] p-4 text-base font-bold text-white shadow-sm hover:bg-[#1245BF] active:bg-[#0F389D] disabled:cursor-not-allowed disabled:opacity-50">
            <LuCheck aria-hidden="true" className="size-4" />{guardando ? "Guardando..." : "Confirmar mis indicaciones"}
          </button>
          <button type="button" onClick={restablecerIndicaciones} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white p-4 text-sm font-semibold text-[#16222C] hover:bg-gray-100 active:border-[#1550E0] active:bg-[#B7C8F0]">
            <LuRotateCcw aria-hidden="true" className="size-4 text-[#1550E0]" />Restablecer a valores por defecto
          </button>
        </div>
      </div>
    </main>
  );
}
