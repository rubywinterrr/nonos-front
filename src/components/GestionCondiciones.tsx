import { useState } from "react";
import { LuCheck, LuPencil, LuPlus, LuTrash2, LuX } from "react-icons/lu";
import { condicionesService, type Condicion } from "../services/condicionesService";
import esAlergia from "../utils/esAlergia";

interface Props {
  adultoId: string;
  condiciones: Condicion[];
  // se llama después de agregar, editar o borrar, para que la pantalla vuelva a cargar
  onCambio: () => void;
  onCerrar: () => void;
}

// editor de las condiciones médicas y alergias del adulto (agregar, editar, borrar).
// Las alergias se marcan con el checkbox "Es una alergia" (esAlergia en el back).
// No está en el Figma: sigue el estilo de las tarjetas de NONOS
export default function GestionCondiciones({ adultoId, condiciones, onCambio, onCerrar }: Props) {
  // "nuevo" = agregando; un id = editando esa condición; null = sin formulario
  const [editando, setEditando] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("");
  const [alergia, setAlergia] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [borrandoId, setBorrandoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // abre el formulario vacío o con los datos de la condición
  const abrirFormulario = (condicion: Condicion | null) => {
    setError(null);
    setBorrandoId(null);
    if (condicion) {
      setEditando(condicion.id);
      setNombre(condicion.nombre);
      setDescripcion(condicion.descripcion ?? "");
      setEstado(condicion.estado ?? "");
      setAlergia(esAlergia(condicion));
    } else {
      setEditando("nuevo");
      setNombre("");
      setDescripcion("");
      setEstado("");
      setAlergia(false);
    }
  };

  // guarda la condición nueva o los cambios
  const guardar = async (evento: React.SubmitEvent) => {
    evento.preventDefault();
    if (!nombre.trim()) {
      setError("Escribí el nombre de la condición.");
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      if (editando === "nuevo") {
        await condicionesService.crearCondicion({
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || undefined,
          estado: estado.trim() || undefined,
          esAlergia: alergia,
          usuarioId: adultoId,
        });
      } else if (editando) {
        await condicionesService.actualizarCondicion(editando, {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          estado: estado.trim(),
          esAlergia: alergia,
        });
      }
      setEditando(null);
      onCambio();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  };

  // borra la condición (después de confirmar)
  const borrar = async (id: string) => {
    setError(null);
    try {
      await condicionesService.eliminarCondicion(id);
      setBorrandoId(null);
      onCambio();
    } catch (err) {
      console.error(err);
      setError("No se pudo borrar.");
    }
  };

  const formulario = (
    <form onSubmit={guardar} className="flex flex-col gap-3 rounded-xl border border-[#B7C8F0] bg-[#E7EDFB] p-4">
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Nombre
        <input
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          placeholder="Ej: Hipertensión o Penicilina"
          className="h-12 rounded-lg border border-[#D7DFE6] bg-white px-3 text-base font-normal focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
        />
      </label>
      <label className="flex min-h-12 cursor-pointer items-center gap-3 text-sm font-semibold">
        <input
          type="checkbox"
          checked={alergia}
          onChange={(evento) => setAlergia(evento.target.checked)}
          className="size-5 cursor-pointer accent-[#1550E0]"
        />
        Es una alergia
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Estado (opcional)
        <input
          value={estado}
          maxLength={50}
          onChange={(evento) => setEstado(evento.target.value)}
          placeholder="Ej: Bajo control"
          className="h-12 rounded-lg border border-[#D7DFE6] bg-white px-3 text-base font-normal focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Detalle (opcional)
        <textarea
          rows={2}
          value={descripcion}
          onChange={(evento) => setDescripcion(evento.target.value)}
          className="rounded-lg border border-[#D7DFE6] bg-white p-3 text-base font-normal focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="submit"
          disabled={guardando}
          className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1550E0] font-semibold text-white hover:bg-[#1245BF] disabled:cursor-wait disabled:opacity-60"
        >
          <LuCheck aria-hidden="true" className="size-4" />
          {guardando ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" onClick={() => setEditando(null)} className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white font-semibold text-[#0D328B] hover:bg-[#D3E0F8]">
          <LuX aria-hidden="true" className="size-4" />
          Cancelar
        </button>
      </div>
    </form>
  );

  return (
    <section aria-labelledby="editar-ficha" className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <h2 id="editar-ficha" className="text-lg font-bold">Alergias y condiciones</h2>
        <button type="button" onClick={onCerrar} className="min-h-11 cursor-pointer rounded-lg bg-[#E7EDFB] px-3 text-sm font-semibold text-[#0D328B] hover:bg-[#D3E0F8]">
          Listo
        </button>
      </div>

      {condiciones.length === 0 && editando !== "nuevo" && <p className="text-sm">No hay nada cargado todavía.</p>}

      {condiciones.map((condicion) => (
        <div key={condicion.id}>
          {editando === condicion.id ? (
            formulario
          ) : (
            <article className="flex flex-col gap-2 rounded-xl border border-[#D7DFE6] p-3">
              <h3 className="font-semibold">{condicion.nombre}</h3>
              {condicion.descripcion && <p className="text-sm text-[#435059]">{condicion.descripcion}</p>}
              {borrandoId === condicion.id ? (
                <div className="flex flex-col gap-2 rounded-lg bg-[#FBE9E9] p-3">
                  <p className="text-sm font-semibold text-[#A92323]">¿Borrar "{condicion.nombre}"?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => borrar(condicion.id)} className="min-h-11 cursor-pointer rounded-lg bg-[#C92A2A] font-semibold text-white hover:bg-[#AF2424]">
                      Sí, borrar
                    </button>
                    <button type="button" onClick={() => setBorrandoId(null)} className="min-h-11 cursor-pointer rounded-lg bg-white font-semibold hover:bg-[#E9EEF2]">
                      No
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => abrirFormulario(condicion)} className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E7EDFB] text-sm font-semibold text-[#0D328B] hover:bg-[#D3E0F8]">
                    <LuPencil aria-hidden="true" className="size-4" />
                    Editar
                  </button>
                  <button type="button" onClick={() => setBorrandoId(condicion.id)} className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FBE9E9] text-sm font-semibold text-[#A92323] hover:bg-[#F5D0D0]">
                    <LuTrash2 aria-hidden="true" className="size-4" />
                    Borrar
                  </button>
                </div>
              )}
            </article>
          )}
        </div>
      ))}

      {editando === "nuevo" && formulario}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

      {editando === null && (
        <button
          type="button"
          onClick={() => abrirFormulario(null)}
          className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#1550E0] bg-[#E7EDFB] font-semibold text-[#1550E0] hover:bg-[#D3E0F8]"
        >
          <LuPlus aria-hidden="true" className="size-5" />
          Agregar alergia o condición
        </button>
      )}
    </section>
  );
}
