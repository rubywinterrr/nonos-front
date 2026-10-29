import { useState, type FormEvent } from "react";
import { LuCheck, LuChevronDown, LuMonitor, LuShieldCheck, LuUserRoundPlus, LuUsersRound } from "react-icons/lu";
import { useAuth } from "../hooks/useAuth";
import { invitacionesService, type NuevaInvitacion } from "../services/invitacionesService";

export default function Desplegable() {
  const [isOpen, setIsOpen] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState("familiar");
  const [nivelAcceso, setNivelAcceso] = useState("predeterminado");
  const [error, setError] = useState("");
  const { usuario } = useAuth();
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Conserva el envío de invitaciones que ya usa el backend.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    if (!rolSeleccionado) {
      setError("Por favor, selecciona un rol para continuar.");
      return;
    }
    const datos: NuevaInvitacion = {
      emailDestino: email.trim(),
      tipoVinculo: "FAMILIAR",
      direccion: usuario?.rol === "FAMILIAR" ? "EMISOR_ES_FAMILIAR" : "EMISOR_ES_ADULTO_MAYOR",
    };
    if (rolSeleccionado === "fisico") {
      datos.tipoVinculo = "CUIDADOR";
      datos.tipoCuidador = "FISICO";
    }
    if (rolSeleccionado === "digital") {
      datos.tipoVinculo = "CUIDADOR";
      datos.tipoCuidador = "DIGITAL";
    }
    setEnviando(true);
    try {
      await invitacionesService.crearInvitacion(datos);
      setMensaje(`Invitación creada para ${email.trim()}. Vence en 7 días.`);
      setEmail("");
      setRolSeleccionado("");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo crear la invitación");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section aria-label="Invitar a un nuevo acompañante" className="flex w-full flex-col gap-3">
      <button type="button" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-white p-4 text-left hover:bg-[#F3F7FC] active:bg-[#E7EDFB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#E7EDFB] text-[#1550E0]"><LuUserRoundPlus aria-hidden="true" className="size-6" /></span>
        <span className="min-w-0 flex-1"><span className="block text-sm font-bold leading-5">Invitar a un nuevo acompañante</span><span className="mt-0.5 block text-xs leading-4 text-[#435059]">Le llegará un enlace por correo electrónico para vincularse.</span></span>
        <LuChevronDown aria-hidden="true" className={`size-5 shrink-0 text-[#1550E0] transition-transform ${isOpen ? "" : "-rotate-90"}`} />
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div>
            <label htmlFor="email-invitacion" className="block text-sm font-bold leading-5">Correo electrónico de la persona</label>
            <input id="email-invitacion" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ej: familiar@gmail.com" className="mt-1.5 h-12 w-full rounded-xl border border-[#D7DFE6] bg-white px-4 text-sm shadow-xs outline-none placeholder:text-[#435059] focus:border-[#1550E0] focus:ring-2 focus:ring-[#B7C8F0]" />
          </div>

          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-2.5 text-sm font-bold">Elegí qué rol tendrá:</legend>
            <button type="button" aria-pressed={rolSeleccionado === "familiar"} onClick={() => setRolSeleccionado("familiar")} className={`flex min-h-18 w-full cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 text-left hover:bg-[#E3EBF8] active:bg-[#D1E0F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${rolSeleccionado === "familiar" ? "border-[#1550E0] bg-[#E9EEF2]" : "border-white bg-white"}`}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E7EDFB] text-[#1550E0]"><LuUsersRound aria-hidden="true" className="size-5" /></span>
              <span className="min-w-0 flex-1"><span className={`block text-sm font-bold ${rolSeleccionado === "familiar" ? "text-[#1550E0]" : ""}`}>Familiar</span><span className="block text-xs leading-4 text-[#435059]">Avisos de bienestar y alertas de emergencia</span></span>
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-full ${rolSeleccionado === "familiar" ? "bg-[#1550E0] text-white" : "border border-[#B7C8F0] bg-[#E7EDFB]"}`}>{rolSeleccionado === "familiar" && <LuCheck aria-hidden="true" className="size-3" />}</span>
            </button>
            <button type="button" aria-pressed={rolSeleccionado === "fisico"} onClick={() => setRolSeleccionado("fisico")} className={`flex min-h-18 w-full cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 text-left hover:bg-[#E3EBF8] active:bg-[#D1E0F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${rolSeleccionado === "fisico" ? "border-[#1550E0] bg-[#E9EEF2]" : "border-white bg-white"}`}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E9EEF2] text-[#435059]"><LuShieldCheck aria-hidden="true" className="size-5" /></span>
              <span className="min-w-0 flex-1"><span className={`block text-sm font-bold ${rolSeleccionado === "fisico" ? "text-[#1550E0]" : ""}`}>Cuidador físico</span><span className="block text-xs leading-4 text-[#435059]">Control del adulto mayor y registro de actividad</span></span>
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-full ${rolSeleccionado === "fisico" ? "bg-[#1550E0] text-white" : "border border-[#B7C8F0] bg-[#E7EDFB]"}`}>{rolSeleccionado === "fisico" && <LuCheck aria-hidden="true" className="size-3" />}</span>
            </button>
            <button type="button" aria-pressed={rolSeleccionado === "digital"} onClick={() => setRolSeleccionado("digital")} className={`flex min-h-18 w-full cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 text-left hover:bg-[#E3EBF8] active:bg-[#D1E0F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${rolSeleccionado === "digital" ? "border-[#1550E0] bg-[#E9EEF2]" : "border-white bg-white"}`}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E9EEF2] text-[#435059]"><LuMonitor aria-hidden="true" className="size-5" /></span>
              <span className="min-w-0 flex-1"><span className={`block text-sm font-bold ${rolSeleccionado === "digital" ? "text-[#1550E0]" : ""}`}>Cuidador digital</span><span className="block text-xs leading-4 text-[#435059]">Control de medicación y registro de NONOS</span></span>
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-full ${rolSeleccionado === "digital" ? "bg-[#1550E0] text-white" : "border border-[#B7C8F0] bg-[#E7EDFB]"}`}>{rolSeleccionado === "digital" && <LuCheck aria-hidden="true" className="size-3" />}</span>
            </button>
          </fieldset>

          <fieldset className="flex flex-col gap-2.5">
            <legend className="text-sm font-bold leading-5">Nivel de acceso a los datos médicos y personales:</legend>
            <p className="-mt-1 text-xs leading-4 text-[#435059]">Definí cuánta información del adulto mayor podrá ver el cuidador al ingresar.</p>
            <button type="button" aria-pressed={nivelAcceso === "predeterminado"} onClick={() => setNivelAcceso("predeterminado")} className={`w-full cursor-pointer rounded-2xl border-2 p-3 text-left hover:bg-[#E3EBF8] active:bg-[#D1E0F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${nivelAcceso === "predeterminado" ? "border-[#1550E0] bg-[#E9EEF2]" : "border-white bg-white"}`}>
              <span className="flex items-center gap-2"><span className={`flex-1 text-sm font-bold ${nivelAcceso === "predeterminado" ? "text-[#1550E0]" : ""}`}>Acceso predeterminado</span><span className="rounded-full bg-[#E7EDFB] px-2 py-0.5 text-xs font-bold text-[#1550E0]">Recomendado</span><span className={`flex size-5 shrink-0 items-center justify-center rounded-full ${nivelAcceso === "predeterminado" ? "bg-[#1550E0] text-white" : "border border-[#B7C8F0] bg-[#E7EDFB]"}`}>{nivelAcceso === "predeterminado" && <LuCheck aria-hidden="true" className="size-3" />}</span></span>
              <span className="mt-2 block text-xs leading-5 text-[#435059]">Solo información esencial para el rol: alertas, estado diario y datos de emergencia básicos.</span>
            </button>
            <button type="button" aria-pressed={nivelAcceso === "completo"} onClick={() => setNivelAcceso("completo")} className={`w-full cursor-pointer rounded-2xl border-2 p-3 text-left hover:bg-[#E3EBF8] active:bg-[#D1E0F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${nivelAcceso === "completo" ? "border-[#1550E0] bg-[#E9EEF2]" : "border-white bg-white"}`}>
              <span className="flex items-center gap-2"><span className={`flex-1 text-sm font-bold ${nivelAcceso === "completo" ? "text-[#1550E0]" : ""}`}>Acceso completo</span><span className={`flex size-5 shrink-0 items-center justify-center rounded-full ${nivelAcceso === "completo" ? "bg-[#1550E0] text-white" : "border border-[#B7C8F0] bg-[#E7EDFB]"}`}>{nivelAcceso === "completo" && <LuCheck aria-hidden="true" className="size-3" />}</span></span>
              <span className="mt-2 block text-xs leading-5 text-[#435059]">Acceso total a la ficha clínica: historial médico, medidas anticipadas, acceso a todos los contactos y demás.</span>
            </button>
          </fieldset>

          <button type="submit" disabled={enviando} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 text-base font-bold text-white hover:bg-[#1245BF] active:bg-[#0F389D] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"><LuCheck aria-hidden="true" className="size-5" />{enviando ? "Enviando..." : "Enviar invitación"}</button>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          {mensaje && <p role="status" className="text-sm text-green-700">{mensaje}</p>}
          <p className="flex items-center gap-1 text-xs text-[#0B4C2B]"><LuShieldCheck aria-hidden="true" className="size-4" />Podés retirar el acceso en cualquier momento</p>
        </form>
      )}
    </section>
  );
}
