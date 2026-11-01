import { useEffect, useState } from "react";
import { LuBell, LuBellOff } from "react-icons/lu";
import { activarPush, estaSuscripto, permisoActual, soportaPush } from "../utils/notificacionesPush";

// cartel del inicio para activar los avisos push en este celular.
// No aparece si ya están activos o si el navegador no los soporta
export default function ActivarAvisos() {
  const [mostrar, setMostrar] = useState(false);
  const [activando, setActivando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bloqueado = permisoActual() === "denied";

  useEffect(() => {
    // revisa si este celular ya está suscripto
    const revisar = async () => {
      if (!soportaPush()) return;
      try {
        const yaActivo = await estaSuscripto();
        setMostrar(!yaActivo);
      } catch (err) {
        console.error(err);
      }
    };
    revisar();
  }, []);

  // pide el permiso y suscribe el celular
  const activar = async () => {
    setActivando(true);
    setError(null);
    try {
      await activarPush();
      setMostrar(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudieron activar los avisos.");
    } finally {
      setActivando(false);
    }
  };

  if (!mostrar) return null;

  return (
    <section className="flex w-full flex-col gap-3 rounded-2xl border border-[#B7C8F0] bg-white p-4 shadow-xs" aria-labelledby="activar-avisos">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EBF5FF] text-[#0B5FFF]">
          {bloqueado ? <LuBellOff aria-hidden="true" className="size-5" /> : <LuBell aria-hidden="true" className="size-5" />}
        </span>
        <div>
          <h2 id="activar-avisos" className="text-base font-bold">Activar avisos en este celular</h2>
          <p className="text-sm leading-relaxed text-[#424656]">
            {bloqueado
              ? "Los avisos están bloqueados. Para recibirlos, permitilos en la configuración del navegador para este sitio."
              : "Te avisamos al instante si pide ayuda o si la pulsera detecta algo fuera de lo normal."}
          </p>
        </div>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
      {!bloqueado && (
        <button
          type="button"
          onClick={activar}
          disabled={activando}
          className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0B5FFF] px-4 font-semibold text-white hover:bg-[#0049CC] active:bg-[#003BA6] disabled:cursor-wait disabled:opacity-70"
        >
          <LuBell aria-hidden="true" className="size-5" />
          {activando ? "Activando…" : "Activar avisos"}
        </button>
      )}
    </section>
  );
}
