import { useEffect, useState } from "react";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { LuBell, LuCheck } from "react-icons/lu";
import { notificacionesService, type Notificacion } from "../../services/notificacionesService";
import tiempoDesde from "../../utils/tiempoDesde";

// pantalla con los avisos que recibió el usuario (los mismos que llegan como notificación push).
// No está en el Figma: sigue el estilo de las otras pantallas de NONOS
export default function Avisos() {
  const [avisos, setAvisos] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // trae los avisos, del más nuevo al más viejo
    const cargar = async () => {
      try {
        setAvisos(await notificacionesService.getNotificaciones());
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los avisos.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // marca un aviso como leído en el back y en la pantalla
  const marcarLeido = async (id: string) => {
    try {
      await notificacionesService.marcarComoLeida(id);
      setAvisos(avisos.map((aviso) => (aviso.id === id ? { ...aviso, leida: true } : aviso)));
    } catch (err) {
      console.error(err);
      setError("No se pudo marcar como leído. Probá de nuevo.");
    }
  };

  const sinLeer = avisos.filter((aviso) => !aviso.leida).length;

  return (
    <main className="mainBody gap-4 text-[#0E1D28]">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Avisos recibidos" compacto />

        {cargando && <p className="text-center text-[#424656]">Cargando avisos…</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

        {!cargando && !error && (
          <p className="text-sm font-semibold text-[#424656]">
            {sinLeer === 0 ? "No tenés avisos sin leer." : `${sinLeer} ${sinLeer === 1 ? "aviso sin leer" : "avisos sin leer"}`}
          </p>
        )}

        {!cargando && avisos.length === 0 && !error && (
          <p className="rounded-2xl bg-white p-4 text-sm">Todavía no recibiste ningún aviso.</p>
        )}

        <ul className="flex flex-col gap-3">
          {avisos.map((aviso) => (
            <li
              key={aviso.id}
              className={`flex flex-col gap-2 rounded-2xl p-4 shadow-xs ${aviso.leida ? "bg-white/70" : "border-l-4 border-[#0B5FFF] bg-white"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="flex items-start gap-2 font-bold">
                  <LuBell aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#0B5FFF]" />
                  {aviso.titulo}
                </h2>
                <span className="shrink-0 text-xs text-[#424656]">{tiempoDesde(aviso.enviadaEn)}</span>
              </div>
              <p className="text-sm leading-relaxed text-[#424656]">{aviso.mensaje}</p>
              {!aviso.leida && (
                <button
                  type="button"
                  onClick={() => marcarLeido(aviso.id)}
                  className="flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-lg bg-[#EBF5FF] px-3 text-sm font-semibold text-[#0049CC] hover:bg-[#DCEBFA] active:bg-[#CBDEF2]"
                >
                  <LuCheck aria-hidden="true" className="size-4" />
                  Marcar como leído
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
