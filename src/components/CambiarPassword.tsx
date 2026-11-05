import { useState } from "react";
import { LuCheck, LuX } from "react-icons/lu";
import { authService } from "../services/authService";
import PasswordInput from "./PasswordInput";

interface Props {
  onCerrar: () => void;
}

// formulario para cambiar la contraseña; lo abren los botones de "Mi cuenta".
// No está en el Figma: sigue el estilo del formulario de MiPerfil
export default function CambiarPassword({ onCerrar }: Props) {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // revisa la nueva contraseña y la manda; si sale bien, el service lleva al login
  const guardar = async (evento: React.SubmitEvent) => {
    evento.preventDefault();
    setError(null);

    if (nueva.length < 8 || !/[A-Z]/.test(nueva) || !/[!@#$%^&*(),.?":{}|<>]/.test(nueva)) {
      setError("La nueva contraseña necesita mínimo 8 caracteres, una mayúscula y un carácter especial.");
      return;
    }

    setGuardando(true);
    try {
      await authService.cambiarPassword(actual, nueva);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña.");
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={guardar} className="mt-2 flex w-full flex-col gap-3 rounded-xl bg-[#E7EDFB] p-3">
      <div className="flex flex-col gap-1 text-sm font-semibold">
        Contraseña actual
        <PasswordInput value={actual} onChange={setActual} etiqueta="Contraseña actual" />
      </div>
      <div className="flex flex-col gap-1 text-sm font-semibold">
        Contraseña nueva
        <PasswordInput value={nueva} onChange={setNueva} etiqueta="Contraseña nueva" autoComplete="new-password" />
        <span className="text-xs font-normal text-[#435059]">Mínimo 8 caracteres, una mayúscula y un carácter especial.</span>
      </div>
      <p className="text-xs text-[#435059]">Al cambiarla se cierran todas tus sesiones y vas a tener que volver a ingresar.</p>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
      <div className="grid grid-cols-2 gap-2">
        <button type="submit" disabled={guardando} className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1550E0] font-semibold text-white hover:bg-[#1245BF] disabled:cursor-wait disabled:opacity-60">
          <LuCheck aria-hidden="true" className="size-4" />
          {guardando ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" onClick={onCerrar} disabled={guardando} className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white font-semibold text-[#0D328B] hover:bg-[#D3E0F8] disabled:opacity-60">
          <LuX aria-hidden="true" className="size-4" />
          Cancelar
        </button>
      </div>
    </form>
  );
}
