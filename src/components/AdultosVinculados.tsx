import { useEffect, useState } from "react";
import { LuCheck, LuMail, LuPhone, LuUsers } from "react-icons/lu";
import { useAuth } from "../hooks/useAuth";
import { usuarioService, type AdultoMayorVinculado } from "../services/usuariosService";
import { guardarAdultoSeleccionado, leerAdultoSeleccionado } from "../utils/adultoQueSeMira";
import calcularEdad from "../utils/calcularEdad";

// iniciales del nombre para cuando no hay foto (ej: "Elena Blanco" → "EB")
function iniciales(nombre: string) {
  const partes = nombre.trim().split(" ");
  let resultado = "";
  for (const parte of partes) {
    if (parte.length > 0) resultado = resultado + parte[0];
  }
  return resultado.slice(0, 2).toUpperCase();
}

// bloque de la Cuenta del cuidador/familiar: los adultos que tiene vinculados,
// con su mail y teléfono, y un botón para elegir cuál mira en el resto de la app
export default function AdultosVinculados() {
  const { usuario } = useAuth();
  const [adultos, setAdultos] = useState<AdultoMayorVinculado[]>([]);
  const [seleccionado, setSeleccionado] = useState<string | null>(leerAdultoSeleccionado());
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    const id = usuario.id;

    // trae los adultos vinculados
    const cargar = async () => {
      try {
        setAdultos(await usuarioService.getAdultosMayoresVinculados(id));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los adultos vinculados.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario]);

  // si nunca eligió, se está mirando al primero
  let idMirado = seleccionado;
  if (!adultos.some((a) => a.id === seleccionado) && adultos.length > 0) idMirado = adultos[0].id;

  // guarda a qué adulto se va a mirar en el resto de la app
  const elegir = (id: string) => {
    guardarAdultoSeleccionado(id);
    setSeleccionado(id);
  };

  return (
    <section className="flex w-full flex-col gap-3 rounded-2xl bg-white/70 p-4 text-[#0E1D28]" aria-labelledby="adultos-vinculados">
      <div className="flex items-center justify-between gap-2">
        <h2 id="adultos-vinculados" className="flex items-center gap-2 text-lg font-bold">
          <LuUsers aria-hidden="true" className="size-8 shrink-0 rounded-lg bg-white p-1.5 text-[#1550E0]" />
          Adultos mayores vinculados
        </h2>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-xs font-bold">
          {adultos.length} {adultos.length === 1 ? "asignado" : "asignados"}
        </span>
      </div>

      {cargando && <p className="text-sm text-[#424656]">Cargando…</p>}
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
      {!cargando && !error && adultos.length === 0 && (
        <p className="rounded-xl bg-white p-4 text-sm">
          Todavía no estás vinculado a ningún adulto mayor. Pedile que te invite desde NONOS con tu mail.
        </p>
      )}

      {adultos.map((adulto) => (
        <article key={adulto.id} className="flex flex-col gap-3 rounded-xl bg-white p-4">
          <div className="flex items-center gap-3">
            {adulto.fotoUrl ? (
              <img src={adulto.fotoUrl} alt="" className="size-12 shrink-0 rounded-full bg-[#D4E4F3] object-cover" />
            ) : (
              <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#EBF5FF] font-semibold text-[#424656]">
                {iniciales(adulto.nombreCompleto)}
              </span>
            )}
            <div className="min-w-0">
              <h3 className="flex flex-wrap items-center gap-2 text-lg font-bold">
                {adulto.nombreCompleto}
                {adulto.id === idMirado && (
                  <span className="rounded-md bg-[#84F6E6]/40 px-2 py-0.5 text-xs font-bold text-[#006A61]">Viendo ahora</span>
                )}
              </h3>
              {adulto.fechaNacimiento && (
                <p className="text-sm font-semibold text-[#1550E0]">{calcularEdad(adulto.fechaNacimiento)} años</p>
              )}
            </div>
          </div>

          <dl className="flex flex-col gap-2 border-t border-[#D4E4F3] pt-3">
            <div className="flex items-start gap-2">
              <LuMail aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#1550E0]" />
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-wide text-[#424656]">Correo electrónico</dt>
                <dd className="break-all font-semibold">{adulto.email}</dd>
              </div>
            </div>
            {adulto.telefono && (
              <div className="flex items-start gap-2">
                <LuPhone aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#1550E0]" />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-[#424656]">Teléfono vinculado</dt>
                  <dd className="font-semibold">
                    <a href={`tel:${adulto.telefono}`} className="hover:underline">{adulto.telefono}</a>
                  </dd>
                </div>
              </div>
            )}
          </dl>

          {adulto.id !== idMirado && (
            <button
              type="button"
              onClick={() => elegir(adulto.id)}
              className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#EBF5FF] font-semibold text-[#1550E0] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            >
              <LuCheck aria-hidden="true" className="size-4" />
              Ver a {adulto.nombreCompleto.split(" ")[0]} en la app
            </button>
          )}
        </article>
      ))}
    </section>
  );
}
