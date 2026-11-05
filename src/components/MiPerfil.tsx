import { useState } from "react";
import { LuCheck, LuLogOut, LuPencil, LuUserX, LuX } from "react-icons/lu";
import { useAuth } from "../hooks/useAuth";
import { usuarioService, type CambiosPerfil } from "../services/usuariosService";
import { authService } from "../services/authService";

// fecha del back ("1946-05-12T00:00:00.000Z") en el formato del <input type="date"> ("1946-05-12")
function fechaParaInput(fecha: string | null) {
  if (!fecha) return "";
  return fecha.slice(0, 10);
}

// sección de "Mi cuenta" para editar los datos propios, cerrar todas las sesiones o dar de baja la cuenta.
// No está en el Figma: sigue el estilo de las tarjetas de la cuenta
export default function MiPerfil() {
  const { usuario, recargarUsuario } = useAuth();
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  // estos cuatro son datos médicos: solo los edita el adulto mayor
  const [plan, setPlan] = useState("");
  const [sanatorio, setSanatorio] = useState("");
  const [medico, setMedico] = useState("");
  const [telefonoMedico, setTelefonoMedico] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [confirmandoBaja, setConfirmandoBaja] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  if (!usuario) return null;

  const esAdulto = usuario.rol === "ADULTO_MAYOR";

  // abre el formulario con los datos actuales
  const abrir = () => {
    setNombre(usuario.nombreCompleto);
    setTelefono(usuario.telefono ?? "");
    setNacimiento(fechaParaInput(usuario.fechaNacimiento));
    setPlan(usuario.planObraSocial ?? "");
    setSanatorio(usuario.sanatorioHabitual ?? "");
    setMedico(usuario.nombreMedicoCabecera ?? "");
    setTelefonoMedico(usuario.telefonoMedicoCabecera ?? "");
    setError(null);
    setMensaje(null);
    setEditando(true);
  };

  // guarda los cambios y actualiza los datos que se ven en la app
  const guardar = async (evento: React.SubmitEvent) => {
    evento.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre no puede quedar vacío.");
      return;
    }
    if (telefonoMedico.trim() && !/^\+?[0-9\s-]{6,20}$/.test(telefonoMedico.trim())) {
      setError("El teléfono del médico solo puede tener números, espacios y guiones (de 6 a 20).");
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      const cambios: CambiosPerfil = {
        nombreCompleto: nombre.trim(),
        telefono: telefono.trim() || null,
        fechaNacimiento: nacimiento || null,
      };
      if (esAdulto) {
        cambios.planObraSocial = plan.trim() || null;
        cambios.sanatorioHabitual = sanatorio.trim() || null;
        cambios.nombreMedicoCabecera = medico.trim() || null;
        cambios.telefonoMedicoCabecera = telefonoMedico.trim() || null;
      }
      await usuarioService.actualizarPerfil(usuario.id, cambios);
      await recargarUsuario();
      setEditando(false);
      setMensaje("¡Listo! Tus datos quedaron guardados.");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudieron guardar tus datos.");
    } finally {
      setGuardando(false);
    }
  };

  // da de baja la cuenta y sale
  const darDeBaja = async () => {
    setError(null);
    try {
      await usuarioService.eliminarCuenta(usuario.id);
      await authService.logout();
    } catch (err) {
      console.error(err);
      setError("No se pudo dar de baja la cuenta.");
    }
  };

  const clasesCampo =
    "h-12 rounded-lg border border-[#D7DFE6] bg-white px-3 text-base font-normal focus:border-[#1550E0] focus:outline-none focus:ring-2 focus:ring-[#B7C8F0]";

  return (
    <section aria-labelledby="mi-perfil" className="flex w-full flex-col gap-3 rounded-2xl border border-[#D7DFE6] bg-white p-4 shadow-xs">
      <h2 id="mi-perfil" className="text-sm font-bold">Mis datos y sesión</h2>

      {mensaje && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{mensaje}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

      {editando ? (
        <form onSubmit={guardar} className="flex flex-col gap-3 rounded-xl bg-[#E7EDFB] p-3">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Nombre y apellido
            <input value={nombre} onChange={(evento) => setNombre(evento.target.value)} className={clasesCampo} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Teléfono
            <input type="tel" value={telefono} onChange={(evento) => setTelefono(evento.target.value)} placeholder="Ej: +54 9 11 4490-2211" className={clasesCampo} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Fecha de nacimiento
            <input type="date" value={nacimiento} onChange={(evento) => setNacimiento(evento.target.value)} className={clasesCampo} />
          </label>
          {esAdulto && (
            <>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                Plan de la obra social
                <input value={plan} onChange={(evento) => setPlan(evento.target.value)} className={clasesCampo} />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                Sanatorio habitual
                <input value={sanatorio} onChange={(evento) => setSanatorio(evento.target.value)} className={clasesCampo} />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                Médico de cabecera
                <input value={medico} onChange={(evento) => setMedico(evento.target.value)} className={clasesCampo} />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                Teléfono del médico
                <input type="tel" value={telefonoMedico} onChange={(evento) => setTelefonoMedico(evento.target.value)} className={clasesCampo} />
              </label>
            </>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button type="submit" disabled={guardando} className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1550E0] font-semibold text-white hover:bg-[#1245BF] disabled:cursor-wait disabled:opacity-60">
              <LuCheck aria-hidden="true" className="size-4" />
              {guardando ? "Guardando…" : "Guardar"}
            </button>
            <button type="button" onClick={() => setEditando(false)} className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white font-semibold text-[#0D328B] hover:bg-[#D3E0F8]">
              <LuX aria-hidden="true" className="size-4" />
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={abrir} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#D7DFE6] bg-white text-sm font-bold text-[#1550E0] hover:bg-[#E7EDFB]">
          <LuPencil aria-hidden="true" className="size-4" />
          Editar mis datos
        </button>
      )}

      <button
        type="button"
        onClick={() => authService.logoutAll()}
        className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#D7DFE6] bg-white text-sm font-bold text-[#16222C] hover:bg-[#E9EEF2]"
      >
        <LuLogOut aria-hidden="true" className="size-4" />
        Cerrar sesión en todos los dispositivos
      </button>

      {confirmandoBaja ? (
        <div className="flex flex-col gap-2 rounded-xl bg-[#FBE9E9] p-3">
          <p className="text-sm font-semibold text-[#A92323]">
            ¿Seguro? Tu cuenta se desactiva y se cierran todas tus sesiones. Para volver vas a tener que pedir ayuda al equipo de NONOS.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={darDeBaja} className="min-h-11 cursor-pointer rounded-lg bg-[#C92A2A] font-semibold text-white hover:bg-[#AF2424]">Sí, dar de baja</button>
            <button type="button" onClick={() => setConfirmandoBaja(false)} className="min-h-11 cursor-pointer rounded-lg bg-white font-semibold hover:bg-[#E9EEF2]">No</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirmandoBaja(true)} className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold text-[#A92323] hover:bg-[#FBE9E9]">
          <LuUserX aria-hidden="true" className="size-4" />
          Dar de baja mi cuenta
        </button>
      )}
    </section>
  );
}
