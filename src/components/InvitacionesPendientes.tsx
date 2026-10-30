import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { invitacionesService, type Invitacion } from "../services/invitacionesService";
import { usuarioService } from "../services/usuariosService";
import { LuCheck, LuInfo, LuMailOpen, LuX } from "react-icons/lu";

// texto del rol que va a tener la persona si acepta la invitación
function textoRolInvitacion(invitacion: Invitacion) {
  if (invitacion.tipoVinculo === "FAMILIAR") return "Familiar";
  if (invitacion.tipoCuidador === "FISICO") return "Cuidador físico";
  if (invitacion.tipoCuidador === "DIGITAL") return "Cuidador digital";
  return "Cuidador";
}

// bloque para el home del familiar y del cuidador: invitaciones pendientes con Aceptar y Rechazar,
// o un aviso si todavía no tiene ningún adulto mayor vinculado
export default function InvitacionesPendientes() {
  const { usuario } = useAuth();
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [tieneAdultos, setTieneAdultos] = useState<boolean>(true);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // id de la invitación que se está aceptando o rechazando en el back
  const [procesando, setProcesando] = useState<string | null>(null);
  // id de la invitación que muestra el "¿Seguro?" antes de rechazar
  const [confirmandoRechazo, setConfirmandoRechazo] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;

    // trae las invitaciones recibidas y los adultos ya vinculados
    const cargarDatos = async () => {
      setCargando(true);
      setError(null);

      try {
        const recibidas = await invitacionesService.getRecibidas();
        setInvitaciones(recibidas.filter((invitacion) => invitacion.estado === "PENDIENTE"));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus invitaciones");
      }

      // si esto falla no se muestra el aviso de "sin vincular", para no asustar de más
      try {
        const adultos = await usuarioService.getAdultosMayoresVinculados(usuario.id);
        setTieneAdultos(adultos.length > 0);
      } catch (err) {
        console.error(err);
      }

      setCargando(false);
    };

    cargarDatos();
  }, [usuario]);

  // acepta la invitación: el back crea el vínculo y se saca de la lista
  const aceptar = async (id: string) => {
    setProcesando(id);
    setError(null);

    try {
      await invitacionesService.aceptarInvitacion(id);
      setInvitaciones(invitaciones.filter((invitacion) => invitacion.id !== id));
      setTieneAdultos(true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo aceptar la invitación");
    } finally {
      setProcesando(null);
    }
  };

  // rechaza la invitación (ya confirmada) y se saca de la lista
  const rechazar = async (id: string) => {
    setProcesando(id);
    setError(null);

    try {
      await invitacionesService.rechazarInvitacion(id);
      setInvitaciones(invitaciones.filter((invitacion) => invitacion.id !== id));
      setConfirmandoRechazo(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo rechazar la invitación");
    } finally {
      setProcesando(null);
    }
  };

  if (cargando) return null;

  if (invitaciones.length === 0) {
    if (error) {
      return <p role="alert" className="w-full rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>;
    }
    if (tieneAdultos) return null;

    return (
      <section className="flex w-full items-start gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-label="Sin adultos vinculados">
        <LuInfo aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-[#D4E4F3] p-2.5 text-[#0B5FFF]" />
        <p className="min-w-0 text-base leading-relaxed text-[#424656]">
          Todavía no estás vinculado a ningún adulto mayor. Pedile que te invite desde NONOS con tu mail.
        </p>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="invitaciones-pendientes">
      <h2 id="invitaciones-pendientes" className="flex items-center gap-2 text-xl font-bold leading-normal">
        <LuMailOpen aria-hidden="true" className="size-5 shrink-0 text-[#0B5FFF]" />
        Invitaciones pendientes
      </h2>

      {invitaciones.map((invitacion) => (
        <article key={invitacion.id} className="flex flex-col gap-3 rounded-xl bg-[#EBF5FF] p-3.5">
          <div className="min-w-0">
            <h3 className="text-base font-bold leading-relaxed wrap-anywhere">
              {invitacion.emisor?.nombreCompleto || "Un adulto mayor"} te invitó a NONOS
            </h3>
            <p className="text-sm leading-relaxed text-[#424656]">Rol: {textoRolInvitacion(invitacion)}</p>
          </div>

          {confirmandoRechazo === invitacion.id ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-[#424656]">¿Seguro que querés rechazar esta invitación?</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => rechazar(invitacion.id)}
                  disabled={procesando === invitacion.id}
                  className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FFDAD6] px-2 text-base font-semibold text-[#BA1A1A] hover:bg-[#FFC9C3] active:bg-[#FFB4AB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BA1A1A] disabled:cursor-wait disabled:opacity-60"
                >
                  {procesando === invitacion.id ? "Rechazando..." : "Sí, rechazar"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmandoRechazo(null)}
                  disabled={procesando === invitacion.id}
                  className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-2 text-base font-semibold text-[#16222C] hover:bg-gray-100 active:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] disabled:opacity-60"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => aceptar(invitacion.id)}
                disabled={procesando === invitacion.id}
                className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1550E0] px-2 text-base font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] disabled:cursor-wait disabled:opacity-60"
              >
                <LuCheck aria-hidden="true" className="size-4 shrink-0" />
                {procesando === invitacion.id ? "Aceptando..." : "Aceptar"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmandoRechazo(invitacion.id)}
                disabled={procesando === invitacion.id}
                className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-2 text-base font-semibold text-[#BA1A1A] hover:bg-[#FFDAD6]/65 active:bg-[#FFDAD6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BA1A1A] disabled:opacity-60"
              >
                <LuX aria-hidden="true" className="size-4 shrink-0" />
                Rechazar
              </button>
            </div>
          )}
        </article>
      ))}

      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
    </section>
  );
}
