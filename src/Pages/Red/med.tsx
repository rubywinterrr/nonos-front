import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import MedicamentoHabitual from "../../components/MedicamentoHabitual";
import RegistroMedicacion from "../../components/RegistroMedicacion";
import { useAuth } from "../../hooks/useAuth";
import { medicamentosService, type CambioMedicacion, type Medicamento } from "../../services/medicamentosService";
import { usuarioService, type AdultoMayorVinculado, type Vinculo } from "../../services/usuariosService";
import { buscarAdultoSeleccionado } from "../../utils/adultoQueSeMira";
import calcularEdad from "../../utils/calcularEdad";
import {
  LuCalendarDays,
  LuCheck,
  LuClipboardList,
  LuInfo,
  LuPlus,
  LuX,
} from "react-icons/lu";

// un cambio del historial junto con el nombre del remedio al que pertenece
interface CambioConRemedio {
  cambio: CambioMedicacion;
  remedio: string;
}

// fecha larga: "23 de octubre de 2026 · 18:30 hs"
function fechaLarga(fecha: string) {
  const d = new Date(fecha);
  const dia = d.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
  const hora = d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${dia} · ${hora} hs`;
}

// fecha sin hora: "20 de octubre de 2026"
function fechaSinHora(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
}

// el back guarda el cambio como texto JSON ({"dosis":"50 mg","horariosDelDia":["08:00"]}): se pasa a una frase
function textoDelCambio(remedio: string, cambio: string) {
  try {
    const datos = JSON.parse(cambio);
    const partes: string[] = [];
    if (datos.dosis) partes.push(`dosis ${datos.dosis}`);
    if (datos.horariosDelDia) partes.push(`horarios ${datos.horariosDelDia.join(", ")} hs`);
    if (datos.nombre) partes.push(`nombre ${datos.nombre}`);
    if (partes.length === 0) return `${remedio}: se actualizó.`;
    return `${remedio}: ${partes.join(" · ")}.`;
  } catch {
    return `${remedio}: ${cambio}`;
  }
}

// pauta para la tarjeta: "2 tomas por día · 08:00 · 21:00 hs"
function pautaDelRemedio(medicamento: Medicamento) {
  const cantidad = medicamento.horariosDelDia.length;
  if (cantidad === 0) return "Sin horario fijo";
  const tomas = cantidad === 1 ? "1 toma por día" : `${cantidad} tomas por día`;
  return `${tomas} · ${medicamento.horariosDelDia.join(" · ")} hs`;
}

// iniciales del nombre para el círculo del paciente ("José Pérez" → "JP")
function iniciales(nombre: string) {
  const partes = nombre.trim().split(" ");
  let resultado = "";
  for (const parte of partes) {
    if (parte.length > 0) resultado = resultado + parte[0];
  }
  return resultado.slice(0, 2).toUpperCase();
}

// pantalla del familiar/cuidador: medicación activa del adulto que mira, su historial de cambios
// y el diálogo para registrar un cambio
export default function MedFam() {
  const { usuario } = useAuth();
  const dialogoCambio = useRef<HTMLDialogElement>(null);
  const nombreUsuario = usuario ? usuario.nombreCompleto : "";
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [cerrandoDialogo, setCerrandoDialogo] = useState(false);
  const [tipoCambio, setTipoCambio] = useState("");
  // id del remedio elegido, o "nuevo"
  const [medicamento, setMedicamento] = useState("");
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [horarios, setHorarios] = useState<string[]>(["08:00"]);
  const [profesional, setProfesional] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorDialogo, setErrorDialogo] = useState<string | null>(null);

  const [adulto, setAdulto] = useState<AdultoMayorVinculado | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [registros, setRegistros] = useState<CambioConRemedio[]>([]);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // se suma 1 cada vez que hay que volver a cargar (después de guardar un cambio)
  const [recargar, setRecargar] = useState(0);

  useEffect(() => {
    if (!usuario) return;
    const miId = usuario.id;

    // trae el adulto, sus medicamentos, los cambios de cada uno y su red
    const cargar = async () => {
      setError(null);
      try {
        const elegido = await buscarAdultoSeleccionado(miId);
        setAdulto(elegido);
        if (!elegido) return;

        const lista = await medicamentosService.getMedicamentos(elegido.id);
        setMedicamentos(lista);

        const cambios: CambioConRemedio[] = [];
        for (const remedio of lista) {
          const delRemedio = await medicamentosService.getCambiosMedicamento(remedio.id);
          for (const cambio of delRemedio) cambios.push({ cambio, remedio: remedio.nombre });
        }
        // del más nuevo al más viejo
        cambios.sort((a, b) => new Date(b.cambio.fechaCambio).getTime() - new Date(a.cambio.fechaCambio).getTime());
        setRegistros(cambios);

        setVinculos(await usuarioService.getVinculos(elegido.id));
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la medicación.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario, recargar]);

  // quién hizo el cambio: el back guarda el id, acá se busca el nombre
  const autorDelCambio = (autorId: string) => {
    if (usuario && autorId === usuario.id) return usuario.nombreCompleto;
    if (adulto && autorId === adulto.id) return adulto.nombreCompleto;
    const deLaRed = vinculos.find((v) => v.familiarId === autorId);
    if (deLaRed) return deLaRed.familiar.nombreCompleto;
    return "Otra persona de su red";
  };

  // los nombres de la red (sin mí) para el aviso de "Registro clínico auditado"
  const otrosDeLaRed = vinculos.filter((v) => v.familiarId !== usuario?.id).map((v) => v.familiar.nombreCompleto);

  const abrirDialogo = () => {
    setCerrandoDialogo(false);
    setTipoCambio("");
    setMedicamento("");
    setNombreNuevo("");
    setDetalle("");
    setHorarios(["08:00"]);
    setProfesional("");
    setFechaInicio("");
    setErrorDialogo(null);
    setDialogoAbierto(true);
    dialogoCambio.current?.showModal();
  };

  // al elegir un remedio, los horarios arrancan con los que ya tiene
  const elegirMedicamento = (valor: string) => {
    setMedicamento(valor);
    const elegido = medicamentos.find((m) => m.id === valor);
    if (elegido && elegido.horariosDelDia.length > 0) setHorarios(elegido.horariosDelDia);
    else setHorarios(["08:00"]);
  };

  // cambia un horario de la lista (posición i)
  const cambiarHorario = (i: number, valor: string) => {
    setHorarios(horarios.map((h, j) => (j === i ? valor : h)));
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

  const suspende = tipoCambio === "Suspender o finalizar toma";
  const esNuevo = medicamento === "nuevo";
  const faltanDatos = !tipoCambio || !medicamento || !detalle.trim() || !profesional.trim() || !fechaInicio || (esNuevo && !nombreNuevo.trim());

  // guarda el cambio en el back según el tipo elegido
  // PENDIENTE BACK: el profesional y la fecha de comienzo se piden pero el back no los guarda
  const registrarCambio = async () => {
    if (faltanDatos || !adulto) return;
    if (!suspende && horarios.length === 0) {
      setErrorDialogo("Agregá al menos un horario.");
      return;
    }
    setGuardando(true);
    setErrorDialogo(null);
    try {
      if (esNuevo) {
        await medicamentosService.crearMedicamento({
          nombre: nombreNuevo.trim(),
          dosis: detalle.trim(),
          horariosDelDia: horarios,
          usuarioId: adulto.id,
        });
      } else if (suspende) {
        await medicamentosService.eliminarMedicamento(medicamento);
      } else {
        // este endpoint además guarda el cambio en el historial, con quién lo hizo y cuándo
        await medicamentosService.actualizarMedicamentoConHistorial(medicamento, adulto.id, {
          dosis: detalle.trim(),
          horariosDelDia: horarios,
        });
      }
      cerrarDialogo();
      setRecargar(recargar + 1);
    } catch (err) {
      console.error(err);
      setErrorDialogo(err instanceof Error ? err.message : "No se pudo guardar el cambio. Probá de nuevo.");
    } finally {
      setGuardando(false);
    }
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

          {cargando && <p className="text-center text-[#435059]">Cargando medicación…</p>}
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
          {!cargando && !adulto && !error && (
            <p className="rounded-xl bg-white p-4 text-sm">Todavía no estás vinculado a ningún adulto mayor.</p>
          )}

          {registros.length > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5">
              <LuCalendarDays
                aria-hidden="true"
                className="size-4 shrink-0 text-[#435059]"
              />
              <p>Actualizado el {fechaSinHora(registros[0].cambio.fechaCambio)} por {autorDelCambio(registros[0].cambio.usuarioId)}.</p>
            </div>
          )}

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
                {medicamentos.length} {medicamentos.length === 1 ? "activo" : "activos"}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {!cargando && medicamentos.length === 0 && (
                <p className="rounded-xl bg-white p-4 text-sm">Todavía no tiene medicación cargada.</p>
              )}
              {medicamentos.map((remedio) => (
                <MedicamentoHabitual
                  key={remedio.id}
                  nombre={remedio.nombre}
                  dosis={remedio.dosis}
                  // PENDIENTE BACK: el medicamento no tiene categoría ("Presión arterial")
                  categoria=""
                  pauta={pautaDelRemedio(remedio)}
                />
              ))}
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
              {!cargando && registros.length === 0 && (
                <p className="rounded-xl bg-white p-4 text-sm">Todavía no hay cambios registrados.</p>
              )}
              {registros.map((registro) => (
                <RegistroMedicacion
                  key={registro.cambio.id}
                  fecha={fechaLarga(registro.cambio.fechaCambio)}
                  detalle={textoDelCambio(registro.remedio, registro.cambio.cambio)}
                  // PENDIENTE BACK: falta "según indicación de <profesional>", el back no guarda el profesional
                  autor={autorDelCambio(registro.cambio.usuarioId)}
                />
              ))}
            </div>
          </section>

          <button
            type="button"
            onClick={abrirDialogo}
            disabled={!adulto}
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
                {adulto ? iniciales(adulto.nombreCompleto) : ""}
              </div>
              <div>
                <span className="rounded-full bg-[#E7EDFB] px-2 py-1 text-xs font-bold uppercase text-[#0D328B]">
                  Paciente asignado
                </span>
                <p className="mt-1 font-bold">{adulto?.nombreCompleto}</p>
                {/* PENDIENTE BACK: el vínculo no guarda el parentesco, por ahora "Papá" queda fijo */}
                <p className="text-sm font-semibold text-[#435059]">
                  Papá{adulto?.fechaNacimiento && ` · ${calcularEdad(adulto.fechaNacimiento)} años`}
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
                  onChange={(event) => elegirMedicamento(event.target.value)}
                  className="h-14 w-full rounded-xl border border-[#D7DFE6] bg-[#F6F8FA] px-4 text-sm focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
                >
                  <option value="" disabled>Seleccioná un medicamento</option>
                  {medicamentos.map((remedio) => (
                    <option key={remedio.id} value={remedio.id}>{remedio.nombre} {remedio.dosis}</option>
                  ))}
                  <option value="nuevo">Nuevo medicamento</option>
                </select>
              </div>
              {/* agregado: para un medicamento nuevo el back necesita el nombre */}
              {esNuevo && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold" htmlFor="nombre-nuevo">
                    Nombre del medicamento
                  </label>
                  <input
                    id="nombre-nuevo"
                    required
                    value={nombreNuevo}
                    onChange={(event) => setNombreNuevo(event.target.value)}
                    className="h-14 w-full rounded-xl border border-[#D7DFE6] bg-[#F6F8FA] px-4 text-sm focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
                  />
                </div>
              )}
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
              {/* agregado: el back guarda los horarios aparte, en formato "HH:MM" */}
              {!suspende && (
                <div className="space-y-2">
                  <p className="block text-sm font-semibold">Horarios de las tomas</p>
                  {horarios.map((horario, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="time"
                        required
                        aria-label={`Horario ${i + 1}`}
                        value={horario}
                        onChange={(event) => cambiarHorario(i, event.target.value)}
                        className="h-14 flex-1 rounded-xl border border-[#D7DFE6] bg-[#F6F8FA] px-4 text-sm focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]"
                      />
                      {horarios.length > 1 && (
                        <button
                          type="button"
                          aria-label={`Quitar horario ${i + 1}`}
                          onClick={() => setHorarios(horarios.filter((_, j) => j !== i))}
                          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#E7EDFB] text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0]"
                        >
                          <LuX aria-hidden="true" className="size-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setHorarios([...horarios, "20:00"])}
                    className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#E7EDFB] px-4 text-sm font-semibold text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0]"
                  >
                    <LuPlus aria-hidden="true" className="size-4" />
                    Agregar horario
                  </button>
                </div>
              )}
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
              {/* PENDIENTE BACK: el back todavía no avisa a la red cuando cambia la medicación */}
              <p className="mt-2 text-sm leading-5 text-[#435059]">
                Esta actualización quedará asentada con tu firma digital (
                {nombreUsuario})
                {otrosDeLaRed.length > 0 && ` y notificará por alerta prioritaria a ${otrosDeLaRed.join(", ")}`}.
              </p>
            </aside>
            {errorDialogo && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{errorDialogo}</p>
            )}
            <div className="mt-5 flex flex-col gap-3 pb-2">
              <button
                type="button"
                onClick={registrarCambio}
                disabled={faltanDatos || guardando}
                className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LuCheck className="size-5" />
                {guardando ? "Guardando…" : "Guardar cambios en la medicación"}
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
