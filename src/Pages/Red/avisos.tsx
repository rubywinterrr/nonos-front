import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VueltaAtras from "../../components/vueltaAtras";
import { useAuth } from "../../hooks/useAuth";
import { notificacionesService, type Notificacion } from "../../services/notificacionesService";
import type { AdultoMayorVinculado } from "../../services/usuariosService";
import { buscarAdultoSeleccionado } from "../../utils/adultoQueSeMira";
import tiempoDesde from "../../utils/tiempoDesde";
import { LuActivity, LuBatteryLow, LuCheck, LuHeartPulse, LuPill, LuQrCode, LuTriangleAlert } from "react-icons/lu";

type FiltroAvisos = "TODAS" | "URGENTES" | "MEDICACION" | "SALUD";
type CategoriaAviso = "URGENTE" | "MEDICACION" | "SALUD";
type GrupoAvisos = "HOY" | "AYER" | "ESTA SEMANA" | "ANTERIORES";

function textoNormalizado(aviso: Notificacion) {
  return `${aviso.titulo} ${aviso.mensaje}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function categoriaAviso(aviso: Notificacion): CategoriaAviso {
  const texto = textoNormalizado(aviso);
  if (/pidio ayuda|pedido de ayuda|emergencia|\bsos\b|caida|oxigeno bajo|pulso (alto|bajo)|alerta critica/.test(texto)) {
    return "URGENTE";
  }
  if (/medic|pastill|losartan|dosis/.test(texto)) return "MEDICACION";
  return "SALUD";
}

function grupoPorFecha(fecha: string): GrupoAvisos {
  const enviada = new Date(fecha);
  if (Number.isNaN(enviada.getTime())) return "ANTERIORES";

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diaAviso = new Date(enviada);
  diaAviso.setHours(0, 0, 0, 0);
  const diasAtras = Math.floor((hoy.getTime() - diaAviso.getTime()) / (24 * 60 * 60 * 1000));

  if (diasAtras <= 0) return "HOY";
  if (diasAtras === 1) return "AYER";
  if (diasAtras < 7) return "ESTA SEMANA";
  return "ANTERIORES";
}

function momentoAviso(fecha: string) {
  const enviada = new Date(fecha);
  if (Number.isNaN(enviada.getTime())) return "FECHA NO DISPONIBLE";

  const grupo = grupoPorFecha(fecha);
  if (grupo === "HOY") return tiempoDesde(fecha).toLocaleUpperCase("es-AR");
  if (grupo === "AYER") {
    return `AYER · ${enviada.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
  }
  if (grupo === "ESTA SEMANA") {
    const diasAtras = Math.max(2, Math.floor((Date.now() - enviada.getTime()) / (24 * 60 * 60 * 1000)));
    return `HACE ${diasAtras} DÍAS`;
  }
  return enviada.toLocaleDateString("es-AR", { day: "numeric", month: "short" }).toLocaleUpperCase("es-AR");
}

function IconoAviso({ aviso }: { aviso: Notificacion }) {
  const texto = textoNormalizado(aviso);
  if (categoriaAviso(aviso) === "URGENTE") return <LuTriangleAlert aria-hidden="true" className="size-6" />;
  if (categoriaAviso(aviso) === "MEDICACION") return <LuPill aria-hidden="true" className="size-6" />;
  if (/bateria|pulsera/.test(texto)) return <LuBatteryLow aria-hidden="true" className="size-6" />;
  if (/qr|codigo/.test(texto)) return <LuQrCode aria-hidden="true" className="size-6" />;
  if (/pulso|oxigeno|salud|pasos|resumen|consulta|observacion/.test(texto)) return <LuHeartPulse aria-hidden="true" className="size-6" />;
  return <LuActivity aria-hidden="true" className="size-6" />;
}

function colorAviso(aviso: Notificacion) {
  const categoria = categoriaAviso(aviso);
  if (categoria === "URGENTE") return { icono: "bg-[#C92A2A] text-white", barra: "bg-[#C92A2A]", texto: "text-[#C92A2A]" };
  if (categoria === "MEDICACION") return { icono: "bg-[#1550E0] text-white", barra: "bg-[#1550E0]", texto: "text-[#1550E0]" };
  const texto = textoNormalizado(aviso);
  if (/bateria|pulsera/.test(texto)) return { icono: "bg-[#435059] text-white", barra: "bg-[#435059]", texto: "text-[#435059]" };
  if (/pasos|resumen del dia/.test(texto)) return { icono: "bg-[#E8FAF1] text-[#006A3A]", barra: "bg-[#006A3A]", texto: "text-[#435059]" };
  return { icono: "bg-[#E7EDFB] text-[#1550E0]", barra: "bg-[#1550E0]", texto: "text-[#435059]" };
}

interface TarjetaAvisoProps {
  aviso: Notificacion;
  telefono?: string | null;
  nombreAdulto?: string;
  rutaAlertas: string;
  onMarcarLeido: (id: string) => void;
}

function TarjetaAviso({ aviso, telefono, nombreAdulto, rutaAlertas, onMarcarLeido }: TarjetaAvisoProps) {
  const estilo = colorAviso(aviso);
  const urgente = categoriaAviso(aviso) === "URGENTE";

  return (
    <li className={`relative flex w-full flex-col gap-3 overflow-hidden rounded-3xl bg-white px-4 py-4 shadow-xs ${aviso.leida ? "border border-[#D7DFE6]" : ""}`}>
      {!aviso.leida && <span aria-hidden="true" className={`absolute bottom-3 left-0 top-3 w-1 rounded-r ${estilo.barra}`} />}
      <div className="flex items-start gap-3">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${estilo.icono}`}>
          <IconoAviso aviso={aviso} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className={`text-xs font-bold leading-4 tracking-wide ${estilo.texto}`}>{momentoAviso(aviso.enviadaEn)}</p>
          <h3 className="text-base font-bold leading-5 text-[#16222C]">{aviso.titulo}</h3>
          <p className="text-sm leading-5 text-[#435059]">{aviso.mensaje}</p>
        </div>
      </div>

      {urgente && (telefono || aviso.alertaId) && (
        <div className="grid grid-cols-2 gap-2">
          {telefono ? (
            <a
              href={`tel:${telefono}`}
              onClick={() => !aviso.leida && onMarcarLeido(aviso.id)}
              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-[#C92A2A] px-3 py-2 text-sm font-bold text-white hover:bg-[#AD2020] active:bg-[#8D1D1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D1D1D] ${!aviso.alertaId ? "col-span-2" : ""}`}
            >
              Llamar a {nombreAdulto?.split(/\s+/)[0] || "la persona"}
            </a>
          ) : null}
          {aviso.alertaId && (
            <Link
              to={rutaAlertas}
              onClick={() => !aviso.leida && onMarcarLeido(aviso.id)}
              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-[#C92A2A] px-3 py-2 text-sm font-bold text-[#C92A2A] hover:bg-[#F9E9E9] active:bg-[#F2D5D5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D1D1D] ${!telefono ? "col-span-2" : ""}`}
            >
              Ver detalle
            </Link>
          )}
        </div>
      )}

      {!aviso.leida && (
        <button
          type="button"
          onClick={() => onMarcarLeido(aviso.id)}
          className="flex min-h-9 w-fit cursor-pointer items-center gap-2 rounded-lg px-2 text-xs font-semibold text-[#1550E0] hover:bg-[#E7EDFB] active:bg-[#D3E0F8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
        >
          <LuCheck aria-hidden="true" className="size-4" />
          Marcar como leído
        </button>
      )}
    </li>
  );
}

export default function Avisos() {
  const { usuario } = useAuth();
  const usuarioId = usuario?.id;
  const [avisos, setAvisos] = useState<Notificacion[]>([]);
  const [adulto, setAdulto] = useState<AdultoMayorVinculado | null>(null);
  const [filtro, setFiltro] = useState<FiltroAvisos>("TODAS");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activa = true;

    const cargar = async () => {
      try {
        const notificaciones = await notificacionesService.getNotificaciones();
        if (activa) setAvisos(notificaciones);
      } catch (err) {
        console.error(err);
        if (activa) setError("No se pudieron cargar los avisos.");
      } finally {
        if (activa) setCargando(false);
      }
    };

    cargar();

    return () => {
      activa = false;
    };
  }, [usuarioId]);

  useEffect(() => {
    if (!usuarioId) return;
    let activa = true;
    buscarAdultoSeleccionado(usuarioId)
      .then((seleccionado) => {
        if (activa) setAdulto(seleccionado);
      })
      .catch((err) => console.error("No se pudo cargar el adulto vinculado:", err));
    return () => {
      activa = false;
    };
  }, [usuarioId]);

  const marcarLeido = async (id: string) => {
    try {
      await notificacionesService.marcarComoLeida(id);
      setAvisos((actuales) => actuales.map((aviso) => aviso.id === id ? { ...aviso, leida: true } : aviso));
      window.dispatchEvent(new Event("nonos:notificaciones-actualizadas"));
    } catch (err) {
      console.error(err);
      setError("No se pudo marcar como leído. Probá de nuevo.");
    }
  };

  const sinLeer = avisos.filter((aviso) => !aviso.leida).length;
  const urgentesSinLeer = avisos.filter((aviso) => !aviso.leida && categoriaAviso(aviso) === "URGENTE").length;
  const medicacionSinLeer = avisos.filter((aviso) => !aviso.leida && categoriaAviso(aviso) === "MEDICACION").length;
  const avisosFiltrados = avisos.filter((aviso) => {
    if (filtro === "TODAS") return true;
    if (filtro === "URGENTES") return categoriaAviso(aviso) === "URGENTE";
    if (filtro === "MEDICACION") return categoriaAviso(aviso) === "MEDICACION";
    return categoriaAviso(aviso) === "SALUD";
  });
  const requierenAtencion = avisosFiltrados.filter((aviso) => !aviso.leida && categoriaAviso(aviso) === "URGENTE");
  const lineaDeTiempo = avisosFiltrados.filter((aviso) => !requierenAtencion.some((pendiente) => pendiente.id === aviso.id));
  const hoy = lineaDeTiempo.filter((aviso) => grupoPorFecha(aviso.enviadaEn) === "HOY");
  const ayer = lineaDeTiempo.filter((aviso) => grupoPorFecha(aviso.enviadaEn) === "AYER");
  const estaSemana = lineaDeTiempo.filter((aviso) => grupoPorFecha(aviso.enviadaEn) === "ESTA SEMANA");
  const anteriores = lineaDeTiempo.filter((aviso) => grupoPorFecha(aviso.enviadaEn) === "ANTERIORES");
  const rutaAlertas = usuario?.rol === "CUIDADOR" ? "/cuidador/alertas" : "/familia/alertas";
  const rutaConfiguracion = usuario?.rol === "CUIDADOR" ? "/cuidador/configuracion" : "/familia/configuracion";

  const tarjetas = (lista: Notificacion[]) => lista.map((aviso) => (
    <TarjetaAviso
      key={aviso.id}
      aviso={aviso}
      telefono={adulto?.telefono}
      nombreAdulto={adulto?.nombreCompleto}
      rutaAlertas={rutaAlertas}
      onMarcarLeido={marcarLeido}
    />
  ));

  return (
    <main id="contenido-principal" tabIndex={-1} className="mainBody gap-4">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-32 text-[#16222C]">
        <VueltaAtras titulo="Notificaciones" compacto seccion="Ficha de consulta" />

        <section className="relative flex w-full flex-col gap-2 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1550E0] to-[#0F389D] px-5 py-4 text-white" aria-label="Resumen de hoy">
          <span aria-hidden="true" className="absolute -right-8 -top-12 size-40 rounded-full bg-white/10" />
          <p className="relative text-xs font-bold leading-4 tracking-wide text-white/80">RESUMEN DE HOY</p>
          <h2 className="relative text-2xl font-bold leading-8">{sinLeer} {sinLeer === 1 ? "aviso sin leer" : "avisos sin leer"}</h2>
          <div className="relative flex flex-wrap gap-2 pt-1">
            <span className="rounded-full bg-[#F9E9E9] px-3 py-1 text-xs font-bold text-[#8D1D1D]">{urgentesSinLeer} {urgentesSinLeer === 1 ? "urgente" : "urgentes"}</span>
            <span className="rounded-full bg-[#E7EDFB] px-3 py-1 text-xs font-bold text-[#0F389D]">{medicacionSinLeer} {medicacionSinLeer === 1 ? "medicación" : "medicaciones"}</span>
          </div>
        </section>

        <div role="group" aria-label="Filtrar notificaciones" className="flex w-full gap-0.5 overflow-x-auto rounded-2xl bg-[#E9EEF2] p-1">
          <button type="button" aria-pressed={filtro === "TODAS"} onClick={() => setFiltro("TODAS")} className={`min-h-9 min-w-0 flex-1 cursor-pointer rounded-xl px-2 text-xs font-bold transition-colors ${filtro === "TODAS" ? "bg-white text-[#0F389D] shadow-xs" : "text-[#435059] hover:bg-white/60 active:bg-white"}`}>Todas</button>
          <button type="button" aria-pressed={filtro === "URGENTES"} onClick={() => setFiltro("URGENTES")} className={`min-h-9 min-w-0 flex-1 cursor-pointer rounded-xl px-2 text-xs font-semibold transition-colors ${filtro === "URGENTES" ? "bg-white text-[#0F389D] shadow-xs" : "text-[#435059] hover:bg-white/60 active:bg-white"}`}>Urgentes</button>
          <button type="button" aria-pressed={filtro === "MEDICACION"} onClick={() => setFiltro("MEDICACION")} className={`min-h-9 min-w-0 flex-1 cursor-pointer rounded-xl px-2 text-xs font-semibold transition-colors ${filtro === "MEDICACION" ? "bg-white text-[#0F389D] shadow-xs" : "text-[#435059] hover:bg-white/60 active:bg-white"}`}>Medicación</button>
          <button type="button" aria-pressed={filtro === "SALUD"} onClick={() => setFiltro("SALUD")} className={`min-h-9 min-w-0 flex-1 cursor-pointer rounded-xl px-2 text-xs font-semibold transition-colors ${filtro === "SALUD" ? "bg-white text-[#0F389D] shadow-xs" : "text-[#435059] hover:bg-white/60 active:bg-white"}`}>Salud</button>
        </div>

        {cargando && <p role="status" className="py-3 text-center text-sm text-[#435059]">Cargando avisos…</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

        {!cargando && !error && (
          <>
            {requierenAtencion.length > 0 && (
              <section className="flex w-full flex-col gap-2.5 pt-1.5" aria-labelledby="requieren-atencion">
                <h2 id="requieren-atencion" className="text-xs font-bold leading-4 tracking-widest text-[#435059]">REQUIEREN TU ATENCIÓN</h2>
                <ul className="flex flex-col gap-2.5">{tarjetas(requierenAtencion)}</ul>
              </section>
            )}
            {hoy.length > 0 && (
              <section className="flex w-full flex-col gap-2.5 pt-1.5" aria-labelledby="avisos-hoy">
                <h2 id="avisos-hoy" className="text-xs font-bold leading-4 tracking-widest text-[#435059]">HOY</h2>
                <ul className="flex flex-col gap-2.5">{tarjetas(hoy)}</ul>
              </section>
            )}
            {ayer.length > 0 && (
              <section className="flex w-full flex-col gap-2.5 pt-1.5" aria-labelledby="avisos-ayer">
                <h2 id="avisos-ayer" className="text-xs font-bold leading-4 tracking-widest text-[#435059]">AYER</h2>
                <ul className="flex flex-col gap-2.5">{tarjetas(ayer)}</ul>
              </section>
            )}
            {estaSemana.length > 0 && (
              <section className="flex w-full flex-col gap-2.5 pt-1.5" aria-labelledby="avisos-semana">
                <h2 id="avisos-semana" className="text-xs font-bold leading-4 tracking-widest text-[#435059]">ESTA SEMANA</h2>
                <ul className="flex flex-col gap-2.5">{tarjetas(estaSemana)}</ul>
              </section>
            )}
            {anteriores.length > 0 && (
              <section className="flex w-full flex-col gap-2.5 pt-1.5" aria-labelledby="avisos-anteriores">
                <h2 id="avisos-anteriores" className="text-xs font-bold leading-4 tracking-widest text-[#435059]">ANTERIORES</h2>
                <ul className="flex flex-col gap-2.5">{tarjetas(anteriores)}</ul>
              </section>
            )}
            {avisosFiltrados.length === 0 && (
              <p className="rounded-2xl bg-white p-4 text-sm text-[#435059]">
                {avisos.length === 0 ? "Todavía no recibiste ningún aviso." : "No hay avisos en esta categoría."}
              </p>
            )}
          </>
        )}

        <Link
          to={rutaConfiguracion}
          className="flex min-h-14 w-full cursor-pointer items-center justify-center rounded-2xl border border-[#1550E0] px-4 py-3 text-base font-semibold text-[#0D328B] hover:bg-[#E7EDFB] active:bg-[#D3E0F8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
        >
          Ajustar notificaciones
        </Link>
      </div>
    </main>
  );
}
