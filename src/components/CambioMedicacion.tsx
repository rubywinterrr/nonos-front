import { useState } from "react";
import { LuCheck, LuCirclePlus, LuPause, LuPencil, LuShieldCheck, LuTrash2, LuX } from "react-icons/lu";
import { medicamentosService, type Medicamento } from "../services/medicamentosService";
import type { AdultoMayorVinculado } from "../services/usuariosService";
import calcularEdad from "../utils/calcularEdad";

interface Props {
  adulto: AdultoMayorVinculado;
  medicamentos: Medicamento[];
  // se llama cuando el cambio se guardó bien, para recargar la lista
  onGuardado: () => void;
  onCerrar: () => void;
}

// los 3 tipos de cambio del paso 1
const tipos = [
  { valor: "modificar", titulo: "Modificar dosis u horarios", texto: "Ajustar la cantidad o los horarios de un remedio que ya toma." },
  { valor: "nuevo", titulo: "Nuevo medicamento recetado", texto: "Sumar un remedio nuevo a las tomas diarias." },
  { valor: "suspender", titulo: "Suspender o finalizar", texto: "Dejar de tomar un remedio por indicación médica o porque terminó el tratamiento." },
];

// ícono de cada tipo de cambio
function iconoDelTipo(tipo: string) {
  if (tipo === "modificar") return <LuPencil aria-hidden="true" className="size-4" />;
  if (tipo === "nuevo") return <LuCirclePlus aria-hidden="true" className="size-4" />;
  return <LuPause aria-hidden="true" className="size-4" />;
}

// formulario en 2 pasos para registrar un cambio en la medicación del adulto:
// paso 1 elegir qué tipo de cambio, paso 2 completar el detalle
export default function CambioMedicacion({ adulto, medicamentos, onGuardado, onCerrar }: Props) {
  const [tipo, setTipo] = useState("modificar");
  const [medicamentoId, setMedicamentoId] = useState(medicamentos.length > 0 ? medicamentos[0].id : "");
  const [nombre, setNombre] = useState("");
  const [dosis, setDosis] = useState(medicamentos.length > 0 ? medicamentos[0].dosis : "");
  const [horarios, setHorarios] = useState<string[]>(medicamentos.length > 0 ? medicamentos[0].horariosDelDia : ["08:00"]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // al elegir otro remedio, el formulario arranca con su dosis y sus horarios actuales
  const elegirMedicamento = (id: string) => {
    setMedicamentoId(id);
    const elegido = medicamentos.find((m) => m.id === id);
    if (elegido) {
      setDosis(elegido.dosis);
      setHorarios(elegido.horariosDelDia);
    }
  };

  // al cambiar de tipo se limpian o se cargan los campos que correspondan
  const elegirTipo = (nuevoTipo: string) => {
    setTipo(nuevoTipo);
    setError(null);
    if (nuevoTipo === "nuevo") {
      setNombre("");
      setDosis("");
      setHorarios(["08:00"]);
    } else {
      elegirMedicamento(medicamentoId);
    }
  };

  // cambia un horario de la lista (posición i)
  const cambiarHorario = (i: number, valor: string) => {
    setHorarios(horarios.map((h, j) => (j === i ? valor : h)));
  };

  // guarda el cambio según el tipo elegido
  const guardar = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    if (tipo !== "suspender" && dosis.trim() === "") {
      setError("Completá la dosis.");
      return;
    }
    if (tipo !== "suspender" && horarios.length === 0) {
      setError("Agregá al menos un horario.");
      return;
    }
    if (tipo === "nuevo" && nombre.trim() === "") {
      setError("Completá el nombre del medicamento.");
      return;
    }

    setGuardando(true);
    try {
      if (tipo === "nuevo") {
        await medicamentosService.crearMedicamento({
          nombre: nombre.trim(),
          dosis: dosis.trim(),
          horariosDelDia: horarios,
          usuarioId: adulto.id,
        });
      } else if (tipo === "modificar") {
        // este endpoint además guarda el cambio en el historial, con quién lo hizo y cuándo
        await medicamentosService.actualizarMedicamentoConHistorial(medicamentoId, adulto.id, {
          dosis: dosis.trim(),
          horariosDelDia: horarios,
        });
      } else {
        await medicamentosService.eliminarMedicamento(medicamentoId);
      }
      onGuardado();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo guardar el cambio. Probá de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const necesitaElegirRemedio = tipo !== "nuevo";
  const elegido = medicamentos.find((m) => m.id === medicamentoId);

  return (
    <form onSubmit={guardar} className="flex w-full flex-col gap-4 rounded-3xl bg-white p-5 shadow-lg" aria-labelledby="titulo-cambio">
      <div className="flex items-center justify-between gap-2">
        <h2 id="titulo-cambio" className="text-xl font-bold">Cambio en la medicación</h2>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#EBF5FF] hover:bg-[#DCEBFA]"
        >
          <LuX aria-hidden="true" className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[#D4E4F3] p-3">
        <div>
          <p className="w-fit rounded-full bg-[#E0F0FF] px-2 py-0.5 text-[0.65rem] font-bold uppercase text-[#0049CC]">Paciente asignado</p>
          <p className="font-bold">{adulto.nombreCompleto}</p>
          {adulto.fechaNacimiento && <p className="text-sm text-[#424656]">{calcularEdad(adulto.fechaNacimiento)} años</p>}
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 flex w-full items-center justify-between font-bold">
          Tipo de cambio <span className="text-sm font-normal text-[#424656]">Paso 1 de 2</span>
        </legend>
        {tipos.map((opcion) => (
          <label
            key={opcion.valor}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 ${
              tipo === opcion.valor ? "border-[#1550E0] bg-[#EBF5FF]" : "border-[#D4E4F3] bg-white hover:bg-[#F5F9FF]"
            }`}
          >
            <input
              type="radio"
              name="tipo-cambio"
              value={opcion.valor}
              checked={tipo === opcion.valor}
              onChange={() => elegirTipo(opcion.valor)}
              disabled={opcion.valor !== "nuevo" && medicamentos.length === 0}
              className="sr-only"
            />
            <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${tipo === opcion.valor ? "bg-[#1550E0] text-white" : "bg-[#EBF5FF] text-[#424656]"}`}>
              {tipo === opcion.valor ? <LuCheck aria-hidden="true" className="size-4" /> : iconoDelTipo(opcion.valor)}
            </span>
            <span>
              <span className={`block font-bold ${tipo === opcion.valor ? "text-[#1550E0]" : ""}`}>{opcion.titulo}</span>
              <span className="block text-sm text-[#424656]">{opcion.texto}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-3">
        <p className="flex items-center justify-between font-bold">
          Detalle <span className="text-sm font-normal text-[#424656]">Paso 2 de 2</span>
        </p>

        {necesitaElegirRemedio && (
          <div className="flex flex-col gap-1">
            <label htmlFor="medicamento" className="text-sm font-semibold">Medicamento</label>
            <select
              id="medicamento"
              value={medicamentoId}
              onChange={(e) => elegirMedicamento(e.target.value)}
              className="min-h-12 rounded-xl border border-[#B9C6D5] bg-white px-3"
            >
              {medicamentos.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre} — {m.dosis}</option>
              ))}
            </select>
          </div>
        )}

        {tipo === "nuevo" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="nombre-medicamento" className="text-sm font-semibold">Nombre del medicamento</label>
            <input
              id="nombre-medicamento"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Atorvastatina"
              className="min-h-12 rounded-xl border border-[#B9C6D5] px-3"
            />
          </div>
        )}

        {tipo !== "suspender" && (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="dosis" className="text-sm font-semibold">Dosis</label>
              <input
                id="dosis"
                value={dosis}
                onChange={(e) => setDosis(e.target.value)}
                placeholder="Ej: 50 mg, 1 comprimido"
                className="min-h-12 rounded-xl border border-[#B9C6D5] px-3"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Horarios del día</p>
              {horarios.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={h}
                    onChange={(e) => cambiarHorario(i, e.target.value)}
                    aria-label={`Horario ${i + 1}`}
                    className="min-h-12 flex-1 rounded-xl border border-[#B9C6D5] px-3"
                  />
                  {horarios.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setHorarios(horarios.filter((_, j) => j !== i))}
                      aria-label={`Quitar horario ${i + 1}`}
                      className="flex size-12 cursor-pointer items-center justify-center rounded-xl bg-[#FFDAD6] text-[#93000A] hover:bg-[#FFC4BD]"
                    >
                      <LuTrash2 aria-hidden="true" className="size-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setHorarios([...horarios, "20:00"])}
                className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#EBF5FF] font-semibold text-[#1550E0] hover:bg-[#DCEBFA]"
              >
                <LuCirclePlus aria-hidden="true" className="size-4" />
                Agregar horario
              </button>
            </div>
          </>
        )}

        {tipo === "suspender" && elegido && (
          <p className="rounded-xl bg-[#FFDAD6] p-3 text-sm text-[#93000A]">
            Se va a dejar de mostrar <strong>{elegido.nombre}</strong> en las tomas diarias de {adulto.nombreCompleto.split(" ")[0]}.
          </p>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-[#1550E0]/20 bg-[#EBF5FF] p-3">
        <LuShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#1550E0]" />
        <p className="text-sm">
          Los cambios de dosis y horarios quedan guardados en el historial de la medicación, con tu nombre y la fecha.
        </p>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

      <button
        type="submit"
        disabled={guardando}
        className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white shadow-md hover:bg-[#1245BF] active:bg-[#0F389D] disabled:cursor-wait disabled:opacity-70"
      >
        <LuCheck aria-hidden="true" className="size-5" />
        {guardando ? "Guardando…" : "Guardar cambio en la medicación"}
      </button>
      <button
        type="button"
        onClick={onCerrar}
        className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#1550E0]/30 bg-[#EBF5FF] px-4 font-semibold hover:bg-[#DCEBFA]"
      >
        <LuX aria-hidden="true" className="size-5" />
        Descartar
      </button>
    </form>
  );
}
