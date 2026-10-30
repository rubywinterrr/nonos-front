import { useEffect, useState } from "react";
import VueltaAtras from "../../components/vueltaAtras";
import Header from "../../components/Header";
import CambioMedicacion from "../../components/CambioMedicacion";
import { LuCalendarCheck, LuClock, LuHistory, LuInfo, LuUserRoundPen } from "react-icons/lu";
import { MdAddCircleOutline } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import { medicamentosService, type CambioMedicacion as Cambio, type Medicamento } from "../../services/medicamentosService";
import type { AdultoMayorVinculado } from "../../services/usuariosService";
import { buscarAdultoSeleccionado } from "../../utils/adultoQueSeMira";

// un cambio del historial junto con el nombre del remedio al que pertenece
interface CambioConRemedio {
  cambio: Cambio;
  remedio: string;
}

// fecha larga: "23 de octubre de 2026 · 18:30 hs"
function fechaLarga(fecha: string) {
  const d = new Date(fecha);
  const dia = d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  const hora = d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${dia} · ${hora} hs`;
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

// pantalla del cuidador/familiar: medicación activa del adulto que mira, su historial de cambios
// y el formulario para registrar un cambio
export default function MedCuidador() {
  const { usuario } = useAuth();
  const [adulto, setAdulto] = useState<AdultoMayorVinculado | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [historial, setHistorial] = useState<CambioConRemedio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  // se suma 1 cada vez que hay que volver a cargar (después de guardar un cambio)
  const [recargar, setRecargar] = useState(0);

  useEffect(() => {
    if (!usuario) return;
    const id = usuario.id;

    // trae el adulto, sus medicamentos y los cambios de cada uno
    const cargar = async () => {
      setError(null);
      try {
        const elegido = await buscarAdultoSeleccionado(id);
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
        setHistorial(cambios);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la medicación.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario, recargar]);

  // quién hizo el cambio: el back guarda el id, acá se traduce a algo legible
  const autorDelCambio = (autorId: string) => {
    if (usuario && autorId === usuario.id) return "Vos";
    if (adulto && autorId === adulto.id) return adulto.nombreCompleto;
    return "Otra persona de su red";
  };

  // cuando el formulario guarda bien: se cierra, se avisa y se recarga la lista
  const alGuardar = () => {
    setMostrarFormulario(false);
    setMensaje("¡Listo! El cambio quedó guardado.");
    setRecargar(recargar + 1);
  };

  const ultimoCambio = historial.length > 0 ? historial[0] : null;

  return (
    <>
      <main className="mainBody text-[#0E1D28]">
        <Header />
        <VueltaAtras titulo="Medicación actual" compacto />

        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          {cargando && <p className="text-center text-[#424656]">Cargando medicación…</p>}
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
          {!cargando && !adulto && !error && (
            <p className="rounded-2xl bg-white p-5">
              Todavía no estás vinculado a ningún adulto mayor. Cuando aceptes una invitación, vas a ver su medicación acá.
            </p>
          )}

          {adulto && mostrarFormulario && (
            <CambioMedicacion
              adulto={adulto}
              medicamentos={medicamentos}
              onGuardado={alGuardar}
              onCerrar={() => setMostrarFormulario(false)}
            />
          )}

          {adulto && !mostrarFormulario && (
            <>
              {mensaje && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{mensaje}</p>}

              <section className="flex items-start gap-3 rounded-2xl bg-white/70 p-4">
                <LuInfo aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#424656]" />
                <p className="text-sm leading-relaxed text-[#424656]">
                  NONOS no controla si se tomó o no la medicación. Esta lista es una referencia del esquema médico indicado y su
                  historial de cambios.
                </p>
              </section>

              {ultimoCambio && (
                <section className="flex items-start gap-3 rounded-2xl bg-white/70 p-4">
                  <LuCalendarCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#0B5FFF]" />
                  <p className="text-sm font-semibold leading-relaxed">
                    Actualizado el {fechaLarga(ultimoCambio.cambio.fechaCambio)} por {autorDelCambio(ultimoCambio.cambio.usuarioId)}.
                  </p>
                </section>
              )}

              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold">Medicación de {adulto.nombreCompleto.split(" ")[0]}</h2>
                <span className="rounded-full bg-[#84F6E6]/40 px-3 py-1 text-xs font-bold text-[#006A61]">
                  {medicamentos.length} {medicamentos.length === 1 ? "activo" : "activos"}
                </span>
              </div>

              {medicamentos.length === 0 && (
                <p className="rounded-2xl bg-white p-4 text-sm">Todavía no tiene medicación cargada.</p>
              )}

              {medicamentos.map((medicamento) => (
                <article key={medicamento.id} className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-xs">
                  <div>
                    <h3 className="text-lg font-bold">{medicamento.nombre}</h3>
                    <p className="text-sm font-semibold text-[#006A61]">Dosis: {medicamento.dosis}</p>
                  </div>
                  <p className="flex items-start gap-2 text-sm leading-relaxed">
                    <LuClock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#0B5FFF]" />
                    {medicamento.horariosDelDia.length > 0
                      ? `${medicamento.horariosDelDia.join(" · ")} hs`
                      : "Sin horario fijo"}
                  </p>
                  {medicamento.lowStock && (
                    <p className="w-fit rounded-md bg-[#FFDAD6] px-2 py-0.5 text-xs font-bold text-[#93000A]">Quedan pocas</p>
                  )}
                </article>
              ))}

              <h2 className="flex items-center gap-2 text-lg font-bold">
                <LuHistory aria-hidden="true" className="size-5" />
                Historial de modificaciones
              </h2>
              {historial.length === 0 && (
                <p className="rounded-2xl bg-white p-4 text-sm">Todavía no hay cambios registrados.</p>
              )}
              {historial.map((item) => (
                <article key={item.cambio.id} className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-xs">
                  <p className="text-xs font-semibold text-[#424656]">{fechaLarga(item.cambio.fechaCambio)}</p>
                  <p className="text-base font-bold leading-snug">{textoDelCambio(item.remedio, item.cambio.cambio)}</p>
                  <p className="flex items-start gap-2 text-xs text-[#424656]">
                    <LuUserRoundPen aria-hidden="true" className="size-4 shrink-0 text-[#0B5FFF]" />
                    {autorDelCambio(item.cambio.usuarioId)}
                  </p>
                </article>
              ))}

              <button
                type="button"
                onClick={() => {
                  setMensaje(null);
                  setMostrarFormulario(true);
                }}
                className="mt-2 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 py-3 font-semibold text-white shadow-md hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
              >
                <MdAddCircleOutline aria-hidden="true" className="size-5" />
                Registrar cambio en la medicación
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
