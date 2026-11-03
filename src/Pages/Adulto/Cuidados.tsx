import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { IoMdHeart } from "react-icons/io";
import { MdLock, MdCheck, MdOutlineEdit, MdOutlinePeopleAlt } from "react-icons/md";
import { LuCirclePlus, LuX } from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService } from "../../services/usuariosService";

// El back guarda las tres medidas anticipadas en un solo texto.
const TITULO_EVITAR = "Para evitar en una emergencia:";
const TITULO_ACOMPANANTE = "\n\nQuién quiero que me acompañe:";
const TITULO_ATENCION = "\n\nCómo prefiero ser atendido:";

function armarTexto(evitar: string, acompanante: string, atencion: string) {
  return `${TITULO_EVITAR} ${evitar}${TITULO_ACOMPANANTE} ${acompanante}${TITULO_ATENCION} ${atencion}`;
}

function separarTexto(texto: string) {
  const inicioAcompanante = texto.indexOf(TITULO_ACOMPANANTE);
  const inicioAtencion = texto.indexOf(TITULO_ATENCION);
  if (!texto.startsWith(TITULO_EVITAR) || inicioAcompanante === -1 || inicioAtencion === -1) {
    return { evitar: texto, acompanante: "", atencion: "" };
  }
  return {
    evitar: texto.slice(TITULO_EVITAR.length, inicioAcompanante).trim(),
    acompanante: texto.slice(inicioAcompanante + TITULO_ACOMPANANTE.length, inicioAtencion).trim(),
    atencion: texto.slice(inicioAtencion + TITULO_ATENCION.length).trim(),
  };
}

type CampoIndicacion = "evitar" | "acompanante" | "atencion" | "extra";
type DatosIndicacion = { titulo: string; placeholder: string; valor: string };

const PLACEHOLDER_EVITAR = 'Ej.: “En caso de que me internen, no quiero que me ingresen un tubo”.';
const PLACEHOLDER_ACOMPANANTE = "Escribí quién querés que te acompañe.";
const PLACEHOLDER_ATENCION = "Escribí cómo preferís que te atiendan.";
const PLACEHOLDER_EXTRA = 'Ej.: “Prefiero que me hablen fuerte” o “No me gusta el café”.';

function TarjetaIndicacion({ titulo, valor, onEditar }: { titulo: string; valor: string; onEditar: () => void }) {
  return (
    <article className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex w-full items-center justify-start gap-3">
        <MdOutlinePeopleAlt aria-hidden="true" className="size-12 rounded-xl border border-gray-200 bg-white p-2 text-4xl text-[#4A7FBF]" />
        <h2 className="max-w-80/100 text-lg font-semibold">{titulo}</h2>
      </div>
      <p className="min-h-12 whitespace-pre-wrap text-[#435059]">
        {valor.trim() ? `“${valor}”` : <span className="text-gray-400">Todavía no agregaste una indicación.</span>}
      </p>
      <button
        type="button"
        onClick={onEditar}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#E9EEF6] p-4 text-lg font-medium hover:bg-gray-200 active:bg-gray-300"
      >
        <MdOutlineEdit aria-hidden="true" className="text-2xl" />
        Editar indicación
      </button>
    </article>
  );
}

export default function Cuidados() {
  const { usuario } = useAuth();
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const [evitar, setEvitar] = useState("");
  const [acompanante, setAcompanante] = useState("");
  const [atencion, setAtencion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [indicacionesExtra, setIndicacionesExtra] = useState("");
  const [mostrarExtra, setMostrarExtra] = useState(false);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [cerrandoDialogo, setCerrandoDialogo] = useState(false);
  const [campoActivo, setCampoActivo] = useState<CampoIndicacion | null>(null);
  const [borrador, setBorrador] = useState("");
  const [errorDialogo, setErrorDialogo] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await usuarioService.getUsuarioById(usuario.id);
        const partes = separarTexto(data.medidasAnticipadas ?? "");
        setEvitar(partes.evitar);
        setAcompanante(partes.acompanante);
        setAtencion(partes.atencion);
        const extra = data.indicacionesCuidado ?? "";
        setIndicacionesExtra(extra);
        if (extra) setMostrarExtra(true);
      } catch (err) {
        console.error(err);
        setError("Hubo un error al cargar tus indicaciones");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [usuario]);

  const cerrarDialogo = () => {
    if (!dialogoRef.current?.open || cerrandoDialogo) return;
    setCerrandoDialogo(true);
  };

  const finalizarCierreDialogo = () => {
    dialogoRef.current?.close();
    setCerrandoDialogo(false);
    setDialogoAbierto(false);
    setCampoActivo(null);
    setErrorDialogo(null);
  };

  useEffect(() => {
    if (!dialogoAbierto) return;
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialogoRef.current?.open) dialogoRef.current?.showModal();
    return () => {
      document.body.style.overflow = overflowOriginal;
    };
  }, [dialogoAbierto]);

  const datosDeCampo = (campo: CampoIndicacion): DatosIndicacion => {
    switch (campo) {
      case "evitar": return { titulo: "¿Algo para evitar por si ocurre un caso de emergencia?", placeholder: PLACEHOLDER_EVITAR, valor: evitar };
      case "acompanante": return { titulo: "¿Quién querés que te acompañe?", placeholder: PLACEHOLDER_ACOMPANANTE, valor: acompanante };
      case "atencion": return { titulo: "¿Cómo preferís ser atendido?", placeholder: PLACEHOLDER_ATENCION, valor: atencion };
      case "extra": return { titulo: "Otras indicaciones para quien te cuida", placeholder: PLACEHOLDER_EXTRA, valor: indicacionesExtra };
    }
  };

  const abrirDialogo = (campo: CampoIndicacion) => {
    const datos = datosDeCampo(campo);
    setCampoActivo(campo);
    setBorrador(datos.valor);
    setErrorDialogo(null);
    setCerrandoDialogo(false);
    setDialogoAbierto(true);
  };

  const guardarIndicacion = async () => {
    if (!usuario || !campoActivo) return;
    setGuardando(true);
    setErrorDialogo(null);
    try {
      if (campoActivo === "extra") {
        if (borrador.length > 5000) {
          setErrorDialogo("La indicación es muy larga. Probá acortarla un poco.");
          return;
        }
        await usuarioService.editarIndicacionesCuidado(usuario.id, borrador);
        setIndicacionesExtra(borrador);
        setMostrarExtra(true);
      } else {
        const nuevoEvitar = campoActivo === "evitar" ? borrador : evitar;
        const nuevoAcompanante = campoActivo === "acompanante" ? borrador : acompanante;
        const nuevoAtencion = campoActivo === "atencion" ? borrador : atencion;
        const texto = armarTexto(nuevoEvitar, nuevoAcompanante, nuevoAtencion);
        if (texto.length > 5000) {
          setErrorDialogo("Tus indicaciones son muy largas. Probá acortarlas un poco.");
          return;
        }
        await usuarioService.editarMedidasAnticipadas(usuario.id, texto);
        setEvitar(nuevoEvitar);
        setAcompanante(nuevoAcompanante);
        setAtencion(nuevoAtencion);
      }
      setMensaje("La indicación se guardó correctamente.");
      cerrarDialogo();
    } catch (err) {
      console.error(err);
      setErrorDialogo("No se pudo guardar la indicación. Probá de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const handleConfirmar = async () => {
    if (!usuario) return;
    setGuardando(true);
    setError(null);
    setMensaje(null);
    try {
      const texto = armarTexto(evitar, acompanante, atencion);
      if (texto.length > 5000 || indicacionesExtra.length > 5000) {
        setError("Tus indicaciones son muy largas. Probá acortarlas un poco.");
        return;
      }
      await usuarioService.editarMedidasAnticipadas(usuario.id, texto);
      await usuarioService.editarIndicacionesCuidado(usuario.id, indicacionesExtra);
      setMensaje("Tus indicaciones se guardaron correctamente.");
    } catch (err) {
      console.error(err);
      setError("No se pudieron guardar tus indicaciones");
    } finally {
      setGuardando(false);
    }
  };

  const campoActual = campoActivo ? datosDeCampo(campoActivo) : null;

  return (
    <>
      <main className="mainBody">
        <Header />
        <VueltaAtras titulo="Mis voluntades y cuidados" />
        <section className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-5 rounded-2xl border border-gray-200 bg-gray-100 p-5 pr-0">
            <div className="flex w-full items-start justify-start gap-3">
              <IoMdHeart aria-hidden="true" className="size-12 rounded-xl border border-gray-200 bg-white p-2 text-[#4A7FBF]" />
              <div className="flex max-w-75/100 flex-col items-start justify-start">
                <h1 className="text-lg font-semibold">Mis deseos en caso de emergencia</h1>
                <h2 className="text-[#4A7FBF]">Medidas anticipadas de atención</h2>
              </div>
            </div>
            <p className="pr-5 text-gray-500">
              Aquí podés dejar indicaciones simples para que tu familia y el equipo médico sepan qué preferís en caso de emergencia. Podés modificarlas o actualizarlas cuando quieras.
            </p>
          </div>
          {loading && <p>Cargando tus indicaciones...</p>}
          <TarjetaIndicacion titulo="¿Algo para evitar por si ocurre un caso de emergencia?" valor={evitar} onEditar={() => abrirDialogo("evitar")} />
          <TarjetaIndicacion titulo="¿Quién querés que te acompañe?" valor={acompanante} onEditar={() => abrirDialogo("acompanante")} />
          <TarjetaIndicacion titulo="¿Cómo preferís ser atendido?" valor={atencion} onEditar={() => abrirDialogo("atencion")} />
          {mostrarExtra ? (
            <TarjetaIndicacion titulo="Otras indicaciones para quien te cuida" valor={indicacionesExtra} onEditar={() => abrirDialogo("extra")} />
          ) : (
            <button
              type="button"
              onClick={() => abrirDialogo("extra")}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-3 border-dashed border-gray-300 bg-white p-5 text-lg hover:bg-zinc-100 active:bg-zinc-200"
            >
              <LuCirclePlus aria-hidden="true" className="text-2xl text-[#4A7FBF]" />Agregar otra indicación o deseo
            </button>
          )}
        </section>
        <div className="flex w-full gap-4 rounded-2xl border border-gray-200 bg-zinc-100 p-5">
          <MdLock aria-hidden="true" className="size-12 rounded-lg border border-gray-200 bg-white p-2.5 text-[#4A7FBF]" />
          <p className="max-w-75/100">
            Tu familia puede ver estas indicaciones desde su aplicación autorizada para respetarlas y comunicarlas ante cualquier atención médica.
          </p>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {mensaje && <p className="text-green-700">{mensaje}</p>}
        <button
          type="button"
          onClick={handleConfirmar}
          disabled={guardando || loading}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-black p-5 text-lg text-white hover:bg-black/90 active:bg-black/75 disabled:opacity-50"
        >
          <MdCheck aria-hidden="true" className="text-2xl text-white" />
          {guardando ? "Guardando..." : "Confirmar mis indicaciones"}
        </button>
      </main>

      <dialog
        ref={dialogoRef}
        onCancel={(event) => { event.preventDefault(); cerrarDialogo(); }}
        onClick={(event) => { if (event.target === event.currentTarget) cerrarDialogo(); }}
        onAnimationEnd={(event) => { if (cerrandoDialogo && event.animationName === "popup-bajar") finalizarCierreDialogo(); }}
        aria-labelledby="titulo-dialogo-indicacion"
        className={`fixed top-auto bottom-0 left-1/2 z-70 m-0 h-auto max-h-90/100 w-93/100 max-w-lg -translate-x-1/2 overflow-hidden rounded-t-3xl border-0 bg-white p-0 text-[#16222C] shadow-2xl backdrop:bg-[#B7C8F0]/70 ${cerrandoDialogo ? "animate-[popup-bajar_250ms_ease-in_forwards]" : "animate-[popup-subir_300ms_ease-out]"}`}
      >
        <section role="document" className="flex max-h-90/100 flex-col overflow-y-auto rounded-t-3xl">
          <div className="shrink-0 px-5 pb-4 pt-3">
            <button
              type="button"
              aria-label="Cerrar diálogo"
              onClick={cerrarDialogo}
              className="mx-auto mb-3 block h-1.5 w-12 cursor-pointer rounded-full bg-[#D7DFE6] hover:bg-[#B7C8F0] active:bg-[#8EA9D4]"
            />
            <div className="flex items-center justify-between gap-3 border-b border-[#D7DFE6] pb-3">
              <h2 id="titulo-dialogo-indicacion" className="text-lg font-bold leading-6">
                {campoActivo === "extra" ? "AGREGAR INDICACIÓN" : "EDITAR INDICACIÓN"}
              </h2>
              <button
                type="button"
                aria-label="Cerrar diálogo"
                onClick={cerrarDialogo}
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#E7EDFB] text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0]"
              >
                <LuX aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>
          {campoActual && (
            <div className="flex flex-col gap-4 px-5 pb-6">
              <label htmlFor="texto-indicacion" className="text-base font-semibold leading-6">
                {campoActual.titulo}
              </label>
              <textarea
                id="texto-indicacion"
                autoFocus
                value={borrador}
                onChange={(event) => setBorrador(event.target.value)}
                placeholder={campoActual.placeholder}
                maxLength={5000}
                rows={5}
                className="min-h-32 w-full resize-y rounded-xl border border-[#B7C8F0] bg-white p-4 text-base outline-none placeholder:text-[#77848F] focus:border-[#1550E0] focus:ring-2 focus:ring-[#B7C8F0]"
              />
              {errorDialogo && <p role="alert" className="text-sm text-red-600">{errorDialogo}</p>}
              <button
                type="button"
                disabled={guardando}
                onClick={guardarIndicacion}
                className="w-full cursor-pointer rounded-xl bg-[#1550E0] px-5 py-4 text-base font-semibold text-white hover:bg-[#1245C6] active:bg-[#0D328B] disabled:cursor-wait disabled:opacity-60"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                onClick={cerrarDialogo}
                className="w-full cursor-pointer rounded-xl border border-[#D7DFE6] bg-white px-5 py-3 text-base font-semibold text-[#16222C] hover:bg-[#F6F8FA] active:bg-[#E7EDFB]"
              >
                Cancelar
              </button>
            </div>
          )}
        </section>
      </dialog>
    </>
  );
}
