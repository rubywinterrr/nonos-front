import { useEffect, useState } from "react";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { LuCheck, LuPencil, LuPlus, LuStickyNote, LuTrash2, LuX } from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";
import { notasService, type Nota } from "../../services/notasService";
import { usuarioService, type AdultoMayorVinculado, type Vinculo } from "../../services/usuariosService";
import { buscarAdultoSeleccionado } from "../../utils/adultoQueSeMira";
import { diaYHora } from "../../utils/formatoSignos";

// notas compartidas entre la red sobre el adulto que se mira (ej: "Hoy comió poco").
// Todos los de la red las leen; solo quien escribió una la puede editar o borrar.
// No está en el Figma: sigue el estilo de NONOS
export default function NotasRed() {
  const { usuario } = useAuth();
  const [adulto, setAdulto] = useState<AdultoMayorVinculado | null>(null);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // "nueva" = escribiendo una nota; un id = editando esa nota; null = sin formulario
  const [editando, setEditando] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [borrandoId, setBorrandoId] = useState<string | null>(null);
  // se suma 1 después de cada cambio, para volver a cargar
  const [recargar, setRecargar] = useState(0);

  useEffect(() => {
    if (!usuario) return;
    const miId = usuario.id;

    // trae el adulto, sus notas y su red (para el nombre de quien escribió cada nota)
    const cargar = async () => {
      try {
        const elegido = await buscarAdultoSeleccionado(miId);
        setAdulto(elegido);
        if (!elegido) return;
        const lista = await notasService.getNotas(elegido.id);
        // de la más nueva a la más vieja
        lista.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotas(lista);
        setVinculos(await usuarioService.getVinculos(elegido.id));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las notas.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario, recargar]);

  // nombre de quien escribió la nota
  const nombreDelAutor = (autorId: string) => {
    if (usuario && autorId === usuario.id) return "Vos";
    const deLaRed = vinculos.find((v) => v.familiarId === autorId);
    if (deLaRed) return deLaRed.familiar.nombreCompleto;
    return "Alguien de la red";
  };

  // abre el formulario vacío o con la nota a editar
  const abrirFormulario = (nota: Nota | null) => {
    setError(null);
    setBorrandoId(null);
    if (nota) {
      setEditando(nota.id);
      setTitulo(nota.titulo);
      setContenido(nota.contenido);
    } else {
      setEditando("nueva");
      setTitulo("");
      setContenido("");
    }
  };

  // guarda la nota nueva o los cambios
  const guardar = async (evento: React.SubmitEvent) => {
    evento.preventDefault();
    if (!adulto || !titulo.trim() || !contenido.trim()) {
      setError("Completá el título y la nota.");
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      if (editando === "nueva") {
        await notasService.crearNota({ titulo: titulo.trim(), contenido: contenido.trim(), usuarioId: adulto.id });
      } else if (editando) {
        await notasService.actualizarNota(editando, { titulo: titulo.trim(), contenido: contenido.trim() });
      }
      setEditando(null);
      setRecargar(recargar + 1);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo guardar la nota.");
    } finally {
      setGuardando(false);
    }
  };

  // borra una nota propia (después de confirmar)
  const borrar = async (id: string) => {
    setError(null);
    try {
      await notasService.eliminarNota(id);
      setBorrandoId(null);
      setRecargar(recargar + 1);
    } catch (err) {
      console.error(err);
      setError("No se pudo borrar la nota.");
    }
  };

  const formulario = (
    <form onSubmit={guardar} className="flex flex-col gap-3 rounded-2xl border border-[#B7C8F0] bg-white p-4 shadow-xs">
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Título
        <input
          value={titulo}
          maxLength={100}
          onChange={(evento) => setTitulo(evento.target.value)}
          placeholder="Ej: Comida del mediodía"
          className="h-12 rounded-lg border border-[#D7DFE6] bg-[#F6F8FA] px-3 text-base font-normal focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Nota
        <textarea
          rows={4}
          value={contenido}
          onChange={(evento) => setContenido(evento.target.value)}
          className="rounded-lg border border-[#D7DFE6] bg-[#F6F8FA] p-3 text-base font-normal focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button type="submit" disabled={guardando} className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1550E0] font-semibold text-white hover:bg-[#1245BF] disabled:cursor-wait disabled:opacity-60">
          <LuCheck aria-hidden="true" className="size-4" />
          {guardando ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" onClick={() => setEditando(null)} className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E7EDFB] font-semibold text-[#0D328B] hover:bg-[#D3E0F8]">
          <LuX aria-hidden="true" className="size-4" />
          Cancelar
        </button>
      </div>
    </form>
  );

  return (
    <main className="mainBody gap-4 text-[#0E1D28]">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Notas de la red" compacto />

        {adulto && (
          <p className="text-sm text-[#424656]">
            Notas sobre {adulto.nombreCompleto} que ve toda su red. Usalas para avisar cosas del día a día.
          </p>
        )}

        {cargando && <p className="text-center text-[#424656]">Cargando notas…</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
        {!cargando && !adulto && !error && (
          <p className="rounded-2xl bg-white p-4 text-sm">Todavía no estás vinculado a ningún adulto mayor.</p>
        )}

        {adulto && editando === null && (
          <button
            type="button"
            onClick={() => abrirFormulario(null)}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] font-semibold text-white shadow-sm hover:bg-[#1245BF] active:bg-[#0F389D]"
          >
            <LuPlus aria-hidden="true" className="size-5" />
            Escribir una nota
          </button>
        )}
        {editando === "nueva" && formulario}

        {!cargando && adulto && notas.length === 0 && editando !== "nueva" && (
          <p className="rounded-2xl bg-white p-4 text-sm">Todavía no hay notas.</p>
        )}

        <ul className="flex flex-col gap-3">
          {notas.map((nota) => {
            const esMia = usuario !== null && nota.cuidadorId === usuario.id;
            if (editando === nota.id) return <li key={nota.id}>{formulario}</li>;
            return (
              <li key={nota.id} className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-xs">
                <h2 className="flex items-center gap-2 font-bold">
                  <LuStickyNote aria-hidden="true" className="size-5 shrink-0 text-[#1550E0]" />
                  {nota.titulo}
                </h2>
                <p className="whitespace-pre-line text-base leading-relaxed">{nota.contenido}</p>
                <p className="text-xs text-[#424656]">
                  {nombreDelAutor(nota.cuidadorId)} · {diaYHora(nota.createdAt)}
                </p>
                {esMia && borrandoId !== nota.id && (
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => abrirFormulario(nota)} className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E7EDFB] text-sm font-semibold text-[#0D328B] hover:bg-[#D3E0F8]">
                      <LuPencil aria-hidden="true" className="size-4" />
                      Editar
                    </button>
                    <button type="button" onClick={() => setBorrandoId(nota.id)} className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FBE9E9] text-sm font-semibold text-[#A92323] hover:bg-[#F5D0D0]">
                      <LuTrash2 aria-hidden="true" className="size-4" />
                      Borrar
                    </button>
                  </div>
                )}
                {esMia && borrandoId === nota.id && (
                  <div className="flex flex-col gap-2 rounded-lg bg-[#FBE9E9] p-3">
                    <p className="text-sm font-semibold text-[#A92323]">¿Borrar esta nota?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => borrar(nota.id)} className="min-h-11 cursor-pointer rounded-lg bg-[#C92A2A] font-semibold text-white hover:bg-[#AF2424]">Sí, borrar</button>
                      <button type="button" onClick={() => setBorrandoId(null)} className="min-h-11 cursor-pointer rounded-lg bg-white font-semibold hover:bg-[#E9EEF2]">No</button>
                    </div>
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
