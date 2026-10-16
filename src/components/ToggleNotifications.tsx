import { useEffect, useState } from "react";
import { MdCheck, MdNotificationsOff } from "react-icons/md";
import { pushService, type EstadoPush } from "../services/pushService";

export default function ToggleNotifications() {
  const [estado, setEstado] = useState<EstadoPush | "cargando">("cargando");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    pushService.getEstado().then(setEstado).catch(() => setEstado("unsupported"));
  }, []);

  const alternar = async () => {
    setError(null);
    setProcesando(true);
    try {
      if (estado === "subscribed") await pushService.desactivar();
      else await pushService.activar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cambiar la configuración");
    } finally {
      setEstado(await pushService.getEstado());
      setProcesando(false);
    }
  };

  if (estado === "cargando") return null;

  if (estado === "unsupported") {
    return (
      <p className="text-gray-600">
        Este navegador no permite notificaciones. En iPhone, agregá NONOS a la
        pantalla de inicio y abrilo desde ahí.
      </p>
    );
  }

  if (estado === "denied") {
    return (
      <p className="text-red-700 flex items-center gap-2">
        <MdNotificationsOff />
        Bloqueaste las notificaciones. Habilitalas desde los permisos del
        sitio en tu navegador.
      </p>
    );
  }

  const activas = estado === "subscribed";
  return (
    <div className="flex flex-col gap-2 items-start">
      <button
        onClick={alternar}
        disabled={procesando}
        className={`px-4 py-2 rounded-full border font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
          activas
            ? "bg-green-50 text-green-700 border-green-300/50"
            : "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        {activas && <MdCheck />}
        {procesando ? "Procesando..." : activas ? "Activadas" : "Activar notificaciones"}
      </button>
      {error && <p className="text-red-700 text-sm">{error}</p>}
    </div>
  );
}