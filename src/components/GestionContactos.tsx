import { useState } from "react";
import { LuCheck, LuPencil, LuPhone, LuPlus, LuTrash2, LuX } from "react-icons/lu";
import { contactosService, type Contacto } from "../services/contactosService";

interface Props {
  adultoId: string;
  nombreAdulto: string;
  contactos: Contacto[];
  // se llama después de agregar, editar o borrar, para que la pantalla vuelva a cargar la lista
  onCambio: () => void;
}

// lista de los contactos agendados del adulto, para que el familiar o cuidador los agregue, edite o borre.
// No está en el Figma: sigue el estilo de las tarjetas de Contactos
export default function GestionContactos({ adultoId, nombreAdulto, contactos, onCambio }: Props) {
  // "nuevo" = formulario para agregar; un id = editando ese contacto; null = sin formulario
  const [editando, setEditando] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [borrandoId, setBorrandoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // abre el formulario vacío (agregar) o con los datos del contacto (editar)
  const abrirFormulario = (contacto: Contacto | null) => {
    setError(null);
    setBorrandoId(null);
    if (contacto) {
      setEditando(contacto.id);
      setNombre(contacto.nombre);
      setTelefono(contacto.telefono);
    } else {
      setEditando("nuevo");
      setNombre("");
      setTelefono("");
    }
  };

  // guarda el contacto nuevo o los cambios
  const guardar = async (evento: React.SubmitEvent) => {
    evento.preventDefault();
    if (!nombre.trim() || !telefono.trim()) {
      setError("Completá el nombre y el teléfono.");
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      if (editando === "nuevo") {
        await contactosService.crearContacto({ nombre: nombre.trim(), telefono: telefono.trim(), usuarioId: adultoId });
      } else if (editando) {
        await contactosService.actualizarContacto(editando, { nombre: nombre.trim(), telefono: telefono.trim() });
      }
      setEditando(null);
      onCambio();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo guardar el contacto.");
    } finally {
      setGuardando(false);
    }
  };

  // borra el contacto (después de confirmar)
  const borrar = async (id: string) => {
    setError(null);
    try {
      await contactosService.eliminarContacto(id);
      setBorrandoId(null);
      onCambio();
    } catch (err) {
      console.error(err);
      setError("No se pudo borrar el contacto.");
    }
  };

  const formulario = (
    <form onSubmit={guardar} className="flex flex-col gap-3 rounded-xl border border-[#B7C8F0] bg-[#E7EDFB] p-4">
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Nombre
        <input
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          placeholder="Ej: Vecina Rosa"
          className="h-12 rounded-lg border border-[#D7DFE6] bg-white px-3 text-base font-normal focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Teléfono
        <input
          type="tel"
          value={telefono}
          onChange={(evento) => setTelefono(evento.target.value)}
          placeholder="Ej: +54 9 11 4490-2211"
          className="h-12 rounded-lg border border-[#D7DFE6] bg-white px-3 text-base font-normal focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="submit"
          disabled={guardando}
          className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1550E0] font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D] disabled:cursor-wait disabled:opacity-60"
        >
          <LuCheck aria-hidden="true" className="size-4" />
          {guardando ? "Guardando…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={() => setEditando(null)}
          className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white font-semibold text-[#0D328B] hover:bg-[#D3E0F8]"
        >
          <LuX aria-hidden="true" className="size-4" />
          Cancelar
        </button>
      </div>
    </form>
  );

  return (
    <section aria-labelledby="contactos-agendados" className="flex w-full flex-col gap-4">
      <div>
        <h2 id="contactos-agendados" className="text-lg font-semibold leading-6">Contactos agendados</h2>
        <p className="text-sm leading-5 text-[#435059]">Los contactos que {nombreAdulto.split(" ")[0]} ve en su app. Podés agregarlos o corregirlos.</p>
      </div>

      {contactos.length === 0 && editando !== "nuevo" && (
        <p className="rounded-xl bg-white p-4 text-sm">Todavía no tiene contactos agendados.</p>
      )}

      {contactos.map((contacto) => (
        <div key={contacto.id}>
          {editando === contacto.id ? (
            formulario
          ) : (
            <article className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold leading-6">{contacto.nombre}</h3>
                  <p className="text-base">{contacto.telefono}</p>
                </div>
                <a
                  href={`tel:${contacto.telefono}`}
                  aria-label={`Llamar a ${contacto.nombre}`}
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#1550E0] text-white hover:bg-[#1245BF]"
                >
                  <LuPhone aria-hidden="true" className="size-5" />
                </a>
              </div>
              {borrandoId === contacto.id ? (
                <div className="flex flex-col gap-2 rounded-lg bg-[#FBE9E9] p-3">
                  <p className="text-sm font-semibold text-[#A92323]">¿Borrar a {contacto.nombre} de los contactos?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => borrar(contacto.id)} className="min-h-11 cursor-pointer rounded-lg bg-[#C92A2A] font-semibold text-white hover:bg-[#AF2424]">
                      Sí, borrar
                    </button>
                    <button type="button" onClick={() => setBorrandoId(null)} className="min-h-11 cursor-pointer rounded-lg bg-white font-semibold hover:bg-[#E9EEF2]">
                      No
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => abrirFormulario(contacto)}
                    className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E7EDFB] text-sm font-semibold text-[#0D328B] hover:bg-[#D3E0F8]"
                  >
                    <LuPencil aria-hidden="true" className="size-4" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setBorrandoId(contacto.id)}
                    className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FBE9E9] text-sm font-semibold text-[#A92323] hover:bg-[#F5D0D0]"
                  >
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
          Agregar contacto
        </button>
      )}
    </section>
  );
}
