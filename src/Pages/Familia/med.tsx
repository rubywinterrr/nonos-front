import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import MedicamentoHabitual from "../../components/MedicamentoHabitual";
import RegistroMedicacion from "../../components/RegistroMedicacion";
import { useAuth } from "../../hooks/useAuth";
import {
  LuCalendarDays,
  LuCheck,
  LuClipboardList,
  LuInfo,
  LuPlus,
  LuX,
} from "react-icons/lu";

interface Registro {
  fecha: string;
  detalle: string;
  autor: string;
}

export default function MedFam() {
  const { usuario } = useAuth();
  const dialogoCambio = useRef<HTMLDialogElement>(null);
  const nombreUsuario = usuario?.nombreCompleto || "Sofía Gómez";
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [cerrandoDialogo, setCerrandoDialogo] = useState(false);
  const [tipoCambio, setTipoCambio] = useState("");
  const [medicamento, setMedicamento] = useState("");
  const [detalle, setDetalle] = useState("");
  const [profesional, setProfesional] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [registros, setRegistros] = useState<Registro[]>([
    {
      fecha: "23 de Octubre de 2026 · 18:30 hs",
      detalle: "Losartán: incremento de dosis de 25mg a 50mg.",
      autor: "Sofía Gómez según indicación de Dra. Valenzuela",
    },
    {
      fecha: "15 de Septiembre de 2026 · 11:00 hs",
      detalle:
        "Suspensión de Ibuprofeno 400mg ocasional por sugerencia gastroenterológica.",
      autor: "Sofía Gómez",
    },
    {
      fecha: "01 de Julio de 2026 · 09:00 hs",
      detalle: "Inicio de Atorvastatina 10mg noche.",
      autor: "José Perez",
    },
  ]);

  const abrirDialogo = () => {
    setCerrandoDialogo(false);
    setTipoCambio("");
    setMedicamento("");
    setDetalle("");
    setProfesional("");
    setFechaInicio("");
    setDialogoAbierto(true);
    dialogoCambio.current?.showModal();
  };

  const cerrarDialogo = () => {
    if (!dialogoCambio.current?.open || cerrandoDialogo) return;
    setCerrandoDialogo(true);
  };

  const finalizarCierreDialogo = () => {
    dialogoCambio.current?.close();
    setCerrandoDialogo(false);
    setDialogoAbierto(false);
  };

  useEffect(() => {
    if (!dialogoAbierto) return;
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflowOriginal;
    };
  }, [dialogoAbierto]);

  const registrarCambio = () => {
    if (!tipoCambio || !medicamento || !detalle.trim() || !profesional.trim() || !fechaInicio) return;
    const nuevaFecha = new Date(`${fechaInicio}T12:00:00`).toLocaleDateString(
      "es-AR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    );
    const cambioDescrito = detalle.trim();
    setRegistros((actuales) => [
      {
        fecha: `${nuevaFecha} · ${new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })} hs`,
        detalle: `${medicamento.split(" — ")[0]}: ${cambioDescrito}`,
        autor: `${nombreUsuario} según indicación de ${profesional}`,
      },
      ...actuales,
    ]);
    cerrarDialogo();
  };

  return (
    <>
      <main className="mainBody gap-4">
        <Header />
        <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
          <VueltaAtras titulo="Medicación actual" compacto />

          <div className="flex items-start gap-4 rounded-xl bg-white p-4">
            <LuInfo
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[#1550E0]"
            />
            <p className="text-sm leading-5">
              NONOS no controla si se tomó o no la medicación. Esta lista es una
              referencia del esquema médico indicado y su historial de cambios.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5">
            <LuCalendarDays
              aria-hidden="true"
              className="size-4 shrink-0 text-[#435059]"
            />
            <p>Actualizado el 20 de Octubre de 2026 por {nombreUsuario}.</p>
          </div>

          <section
            aria-labelledby="medicacion-habitual"
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h2
                id="medicacion-habitual"
                className="text-lg font-semibold leading-6"
              >
                Medicación habitual activa
              </h2>
              <span className="shrink-0 rounded-full border border-[#BAEDD3] bg-[#E8FAF1] px-2 py-1 text-sm font-semibold leading-5 text-[#0B4C2B]">
                3 activos
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <MedicamentoHabitual
                nombre="Losartán"
                dosis="50 mg"
                categoria="Presión arterial"
                pauta="1 comprimido por día · Mañana 08:00 hs con desayuno"
              />
              <MedicamentoHabitual
                nombre="Omeprazol"
                dosis="20 mg"
                categoria="Protector gástrico"
                pauta="1 comprimido diario · En ayunas matutino"
              />
              <MedicamentoHabitual
                nombre="Atorvastatina"
                dosis="10 mg"
                categoria="Control de lípidos"
                pauta="1 comprimido diario · Noche 21:00 hs"
              />
            </div>
          </section>

          <section
            aria-labelledby="historial-modificaciones"
            className="flex flex-col gap-4"
          >
            <h2
              id="historial-modificaciones"
              className="flex items-center gap-2 text-lg font-semibold leading-6"
            >
              <LuClipboardList
                aria-hidden="true"
                className="size-5 text-[#1550E0]"
              />
              Historial de modificaciones
            </h2>
            <div className="flex flex-col gap-4">
              {registros.map((registro, indice) => (
                <RegistroMedicacion
                  key={`${registro.fecha}-${indice}`}
                  fecha={registro.fecha}
                  detalle={registro.detalle}
                  autor={registro.autor}
                />
              ))}
            </div>
          </section>

          <button
            type="button"
            onClick={abrirDialogo}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#B7C8F0] bg-[#1550E0] px-4 text-base font-semibold text-white shadow-sm hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
          >
            <LuPlus aria-hidden="true" className="size-5" />
            Registrar cambio en la medicación
          </button>
        </div>
      </main>

      <dialog
        ref={dialogoCambio}
        onCancel={(event) => {
          event.preventDefault();
          cerrarDialogo();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) cerrarDialogo();
        }}
        onAnimationEnd={(event) => {
          if (cerrandoDialogo && event.animationName === "popup-bajar")
            finalizarCierreDialogo();
        }}
        aria-labelledby="titulo-cambio-medicacion"
        className={`fixed top-auto bottom-0 left-1/2 z-70 m-0 h-90/100 max-h-dvh w-93/100 max-w-lg -translate-x-1/2 overflow-hidden rounded-t-3xl border-0 bg-white p-0 text-[#16222C] shadow-2xl backdrop:bg-[#B7C8F0]/70 ${cerrandoDialogo ? "animate-[popup-bajar_250ms_ease-in_forwards]" : "animate-[popup-subir_300ms_ease-out]"}`}
      >
        <section
          role="document"
          className="flex h-full flex-col overflow-hidden rounded-t-3xl"
        >
          <div className="shrink-0 px-4 pt-3">
            <button
              type="button"
              aria-label="Cerrar diálogo"
              onClick={cerrarDialogo}
              className="mx-auto mb-3 block h-1.5 w-12 cursor-pointer rounded-full bg-[#D7DFE6] hover:bg-[#B7C8F0] active:bg-[#8EA9D4]"
            />
            <div className="flex min-h-14 items-center justify-between gap-3 border-b border-[#D7DFE6] pb-3">
              <h2
                id="titulo-cambio-medicacion"
                className="text-xl font-semibold leading-7"
              >
                Cambio en la medicación
              </h2>
              <button
                type="button"
                aria-label="Cerrar diálogo"
                onClick={cerrarDialogo}
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#E7EDFB] text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0]"
              >
                <LuX className="size-5" />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-5 pt-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[#D7DFE6] bg-[#F6F8FA] p-4 shadow-xs">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#E7EDFB] text-lg font-bold text-[#1550E0]">
                JP
              </div>
              <div>
                <span className="rounded-full bg-[#E7EDFB] px-2 py-1 text-xs font-bold uppercase text-[#0D328B]">
                  Paciente asignado
                </span>
                <p className="mt-1 font-bold">José Pérez</p>
                <p className="text-sm font-semibold text-[#435059]">
                  Papá · 78 años
                </p>
              </div>
            </div>

            <fieldset className="mt-5 space-y-2">
              <legend className="mb-2 flex w-full items-center justify-between text-base font-semibold">
                Tipo de modificación médica{" "}
                <span className="text-sm text-[#435059]">Paso 1 de 2</span>
              </legend>
              <label className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 hover:bg-[#DCEAF9] active:bg-[#C5D9F4] ${tipoCambio === "Modificar dosis o frecuencia" ? "border-[#1550E0] bg-[#EAF4FE]" : "border-transparent bg-[#F6F8FA]"}`}>
                <input
                  type="radio"
                  name="tipo-cambio"
                  required
                  checked={tipoCambio === "Modificar dosis o frecuencia"}
                  onChange={() => setTipoCambio("Modificar dosis o frecuencia")}
                  className="mt-1 size-5 accent-[#1550E0]"
                />
                <span>
                  <strong className="block leading-6">
                    Modificar dosis o frecuencia
                  </strong>
                  <span className="mt-1 block text-sm leading-5 text-[#435059]">
                    Ajustar cantidad, horario o presentación actual (ej.
                    Losartán 50mg).
                  </span>
                </span>
              </label>
              <label className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 hover:bg-[#DCEAF9] active:bg-[#C5D9F4] ${tipoCambio === "Nuevo medicamento recetado" ? "border-[#1550E0] bg-[#EAF4FE]" : "border-transparent bg-[#F6F8FA]"}`}>
                <input
                  type="radio"
                  name="tipo-cambio"
                  required
                  checked={tipoCambio === "Nuevo medicamento recetado"}
                  onChange={() => setTipoCambio("Nuevo medicamento recetado")}
                  className="mt-1 size-5 accent-[#1550E0]"
                />
                <span>
                  <strong className="block leading-6">
                    Nuevo medicamento recetado
                  </strong>
                  <span className="mt-1 block text-sm leading-5 text-[#435059]">
                    Incorporar un fármaco nuevo al cronograma diario.
                  </span>
                </span>
              </label>
              <label className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 hover:bg-[#DCEAF9] active:bg-[#C5D9F4] ${tipoCambio === "Suspender o finalizar toma" ? "border-[#1550E0] bg-[#EAF4FE]" : "border-transparent bg-[#F6F8FA]"}`}>
                <input
                  type="radio"
                  name="tipo-cambio"
                  required
                  checked={tipoCambio === "Suspender o finalizar toma"}
                  onChange={() => setTipoCambio("Suspender o finalizar toma")}
                  className="mt-1 size-5 accent-[#1550E0]"
                />
                <span>
                  <strong className="block leading-6">
                    Suspender o finalizar toma
                  </strong>
                  <span className="mt-1 block text-sm leading-5 text-[#435059]">
                    Pausar por indicación médica o dar por terminado el
                    tratamiento.
                  </span>
                </span>
              </label>
            </fieldset>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-base font-semibold">
                <h3>Detalle de la prescripción</h3>
                <span className="text-sm text-[#435059]">Paso 2 de 2</span>
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold"
                  htmlFor="medicamento-cambio"
                >
                  Medicamento a modificar
                </label>
                <select
                  id="medicamento-cambio"
                  required
                  value={medicamento}
                  onChange={(event) => setMedicamento(event.target.value)}
                  className="h-14 w-full rounded-xl border border-[#D7DFE6] bg-[#F6F8FA] px-4 text-sm focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
                >
                  <option value="" disabled>Seleccioná un medicamento</option>
                  <option value="Losartán 50mg — Presión arterial">Losartán 50mg — Presión arterial</option>
                  <option value="Omeprazol 20mg — Protector gástrico">Omeprazol 20mg — Protector gástrico</option>
                  <option value="Atorvastatina 10mg — Control de lípidos">Atorvastatina 10mg — Control de lípidos</option>
                  <option value="Nuevo medicamento">Nuevo medicamento</option>
                </select>
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold"
                  htmlFor="detalle-cambio"
                >
                  Nueva dosis y pauta horaria
                </label>
                <textarea
                  id="detalle-cambio"
                  placeholder="Ej.: Tomar 1 comprimido por la mañana y 1/2 por la noche (21:00 hs)."
                  required
                  rows={3}
                  value={detalle}
                  onChange={(event) => setDetalle(event.target.value)}
                  className="w-full rounded-xl border border-[#D7DFE6] bg-[#F6F8FA] p-3 text-sm leading-5 focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold"
                  htmlFor="profesional-cambio"
                >
                  Profesional que autorizó el ajuste
                </label>
                <input
                  id="profesional-cambio"
                  placeholder="Ej.: Dra. Valenzuela (cardióloga)"
                  required
                  value={profesional}
                  onChange={(event) => setProfesional(event.target.value)}
                  className="h-14 w-full rounded-xl border border-[#D7DFE6] bg-[#F6F8FA] px-4 text-sm focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold"
                  htmlFor="fecha-cambio"
                >
                  Comienzo de la nueva indicación
                </label>
                <input
                  id="fecha-cambio"
                  type="date"
                  required
                  value={fechaInicio}
                  onChange={(event) => setFechaInicio(event.target.value)}
                  className="h-14 w-full rounded-xl border border-[#D7DFE6] bg-[#F6F8FA] px-4 text-sm focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
                />
              </div>
            </div>

            <aside className="mt-5 rounded-2xl border border-[#B7C8F0] bg-[#EAF4FE] p-4">
              <h3 className="font-semibold">Registro clínico auditado</h3>
              <p className="mt-2 text-sm leading-5 text-[#435059]">
                Esta actualización quedará asentada con tu firma digital (
                {nombreUsuario}) y notificará por alerta prioritaria a Sofía,
                María Rodríguez y Dr. Valenzuela.
              </p>
            </aside>
            <div className="mt-5 flex flex-col gap-3 pb-2">
              <button
                type="button"
                onClick={registrarCambio}
                disabled={!tipoCambio || !medicamento || !detalle.trim() || !profesional.trim() || !fechaInicio}
                className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LuCheck className="size-5" />
                Guardar cambios en la medicación
              </button>
              <button
                type="button"
                onClick={cerrarDialogo}
                className="min-h-13 w-full cursor-pointer rounded-xl bg-[#E7EDFB] px-4 font-semibold text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0]"
              >
                Descartar
              </button>
            </div>
          </div>
        </section>
      </dialog>
    </>
  );
}
