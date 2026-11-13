import { useEffect, useState } from "react";
import VueltaAtras from "../../components/vueltaAtras";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { notificacionesService, type Notificacion } from "../../services/notificacionesService";
import tiempoDesde from "../../utils/tiempoDesde";
import {
  LuBatteryLow,
  LuHeart,
  LuPill,
  LuTriangleAlert,
  LuUserRound,
} from "react-icons/lu";

interface TarjetaNotificacionProps {
  momento: string;
  titulo: string;
  detalle?: string;
  color: "azul" | "rojo" | "gris" | "verde";
  icono: "medicacion" | "ayuda" | "bateria" | "pasos" | "consulta";
  nueva?: boolean;
}

function TarjetaNotificacion({
  momento,
  titulo,
  detalle,
  color,
  icono,
  nueva = false,
}: TarjetaNotificacionProps) {
  const tonos = {
    azul: {
      texto: "text-[#144BD3]",
      fondo: "bg-[#144BD3]",
      borde: "border-[#144BD3]",
    },
    rojo: {
      texto: "text-[#A92323]",
      fondo: "bg-[#A92323]",
      borde: "border-[#A92323]",
    },
    gris: {
      texto: "text-[#435059]",
      fondo: "bg-[#435059]",
      borde: "border-[#435059]",
    },
    verde: {
      texto: "text-[#006A3A]",
      fondo: "bg-[#E8FAF1]",
      borde: "border-[#E8FAF1]",
    },
  }[color];

  const iconoContenido = {
    medicacion: <LuPill aria-hidden="true" className="size-6 text-white" />,
    ayuda: <LuTriangleAlert aria-hidden="true" className="size-6 text-white" />,
    bateria: <LuBatteryLow aria-hidden="true" className="size-6 text-white" />,
    pasos: <LuHeart aria-hidden="true" className="size-6 text-[#006A3A]" />,
    consulta: (
      <LuUserRound aria-hidden="true" className="size-6 text-[#144BD3]" />
    ),
  }[icono];

  return (
    <article
      className={`relative flex w-full flex-col gap-4 overflow-hidden rounded-3xl bg-white px-4 py-5 shadow-xs ${nueva ? "" : "border border-[#D7DFE6]"}`}
    >
      {nueva && (
        <span
          aria-hidden="true"
          className={`absolute bottom-3 left-0 top-3 w-1 rounded-r ${tonos.borde}`}
        />
      )}
      <div className="flex items-start gap-3.5">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${tonos.fondo}`}
        >
          {iconoContenido}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p
            className={`text-base font-bold leading-5 tracking-wide ${tonos.texto}`}
          >
            {momento}
          </p>
          <h2 className="text-xl font-bold leading-6 text-[#16222C]">
            {titulo}
          </h2>
          {detalle && (
            <p className="text-lg leading-6 text-[#435059]">{detalle}</p>
          )}
        </div>
      </div>
      {icono === "medicacion" && (
        <Link
          type="button"
          to={"../medicamentos"}
          className="flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[#144BD3] px-4 py-2 text-base font-bold text-white hover:bg-[#103EAE] active:bg-[#0B328F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B328F]"
        >
          Ver mi medicación
        </Link>
      )}
    </article>
  );
}

// elige el ícono según lo que dice el aviso (el back no manda de qué tipo es)
function iconoDeAviso(aviso: Notificacion) {
  const texto = `${aviso.titulo} ${aviso.mensaje}`
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

  if (texto.includes("ayuda") || texto.includes("emergencia") || texto.includes("caida") || texto.includes("oxigeno") || texto.includes("pulso")) return "ayuda";
  if (texto.includes("medic") || texto.includes("pastilla") || texto.includes("dosis")) return "medicacion";
  if (texto.includes("bateria") || texto.includes("pulsera")) return "bateria";
  if (texto.includes("pasos") || texto.includes("resumen")) return "pasos";
  return "consulta";
}

// cada ícono va con su color del Figma
function colorDeIcono(icono: TarjetaNotificacionProps["icono"]) {
  if (icono === "ayuda") return "rojo";
  if (icono === "bateria") return "gris";
  if (icono === "pasos") return "verde";
  return "azul";
}

// cuándo llegó el aviso: "Ahora", "Hace 2 min", "Ayer" o "28 de octubre"
function momentoAviso(fecha: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dia = new Date(fecha);
  dia.setHours(0, 0, 0, 0);
  const diasAtras = Math.round((hoy.getTime() - dia.getTime()) / (24 * 60 * 60 * 1000));

  if (diasAtras === 1) return "Ayer";
  if (diasAtras > 1) return dia.toLocaleDateString("es-AR", { day: "numeric", month: "long" });

  const texto = tiempoDesde(fecha);
  if (texto === "recién") return "Ahora";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// título del resumen de arriba, según cuántos avisos nuevos hay
function tituloResumen(cantidad: number) {
  if (cantidad === 0) return "No tenés avisos nuevos";
  if (cantidad === 1) return "Tenés 1 aviso nuevo";
  return `Tenés ${cantidad} avisos nuevos`;
}

// arma una tarjeta con los datos de un aviso del back
function tarjetaDeAviso(aviso: Notificacion) {
  const icono = iconoDeAviso(aviso);
  return (
    <TarjetaNotificacion
      key={aviso.id}
      momento={momentoAviso(aviso.enviadaEn)}
      titulo={aviso.titulo}
      detalle={aviso.mensaje}
      color={colorDeIcono(icono)}
      icono={icono}
      nueva={!aviso.leida}
    />
  );
}

export default function Notificaciones() {
  const { usuario } = useAuth();
  const usuarioId = usuario?.id;
  const [avisos, setAvisos] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuarioId) return;
    let activa = true;

    // marca los avisos como leídos: en esta visita se siguen viendo como nuevos
    // y la próxima vez aparecen en "Antes"; el Header actualiza el número de la campanita
    const marcarLeidos = async (lista: Notificacion[]) => {
      try {
        for (const aviso of lista) {
          if (!aviso.leida) await notificacionesService.marcarComoLeida(aviso.id);
        }
        window.dispatchEvent(new Event("nonos:notificaciones-actualizadas"));
      } catch (err) {
        // si falla, siguen sin leer y se vuelve a intentar la próxima vez
        console.error(err);
      }
    };

    // trae los avisos del usuario, del más nuevo al más viejo
    const cargarAvisos = async () => {
      try {
        const data = await notificacionesService.getNotificaciones();
        if (!activa) return;
        setAvisos(data);
        marcarLeidos(data);
      } catch (err) {
        console.error(err);
        if (activa) setError("No se pudieron cargar tus avisos.");
      } finally {
        if (activa) setCargando(false);
      }
    };

    cargarAvisos();

    return () => {
      activa = false;
    };
  }, [usuarioId]);

  const nuevos = avisos.filter((aviso) => !aviso.leida);
  const anteriores = avisos.filter((aviso) => aviso.leida);

  return (
    <main id="contenido-principal" tabIndex={-1} className="mainBody gap-4">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-32 text-[#16222C]">
        <VueltaAtras titulo="Notificaciones" compacto seccion="Mis avisos" />

        {cargando && <p role="status" className="text-[#435059]">Cargando tus avisos...</p>}
        {error && <p role="alert" className="text-red-800">{error}</p>}

        {!cargando && !error && (
          <section
            className="relative flex min-h-20 w-full items-center overflow-hidden rounded-3xl bg-linear-to-br from-[#144BD3] to-[#0E3494] px-5 py-4 text-white"
            aria-label="Resumen de avisos"
          >
            <span
              aria-hidden="true"
              className="absolute -right-8 -top-12 size-40 rounded-full bg-white/10"
            />
            <h2 className="relative text-3xl font-bold leading-8">
              {tituloResumen(nuevos.length)}
            </h2>
          </section>
        )}

        {nuevos.length > 0 && (
          <section
            className="flex w-full flex-col gap-3 pt-1.5"
            aria-labelledby="avisos-atencion"
          >
            <h2
              id="avisos-atencion"
              className="text-sm font-bold leading-5 tracking-widest text-[#435059]"
            >
              REQUIERE TU ATENCIÓN
            </h2>
            {nuevos.map(tarjetaDeAviso)}
          </section>
        )}

        {anteriores.length > 0 && (
          <section
            className="flex w-full flex-col gap-3 pt-1.5"
            aria-labelledby="avisos-antes"
          >
            <h2
              id="avisos-antes"
              className="text-sm font-bold leading-5 tracking-widest text-[#435059]"
            >
              ANTES
            </h2>
            {anteriores.map(tarjetaDeAviso)}
          </section>
        )}

        <Link
          to={"../configuracion"}
          className="flex min-h-14 w-full cursor-pointer items-center justify-center rounded-2xl border border-[#B7C8F0] bg-[#E7EDFB] px-4 py-3 text-base font-semibold text-[#144BD3] hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
        >
          Ajustar notificaciones
        </Link>
      </div>
    </main>
  );
}
