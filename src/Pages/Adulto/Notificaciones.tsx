import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { Link } from "react-router-dom";
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

export default function Notificaciones() {
  return (
    <main className="mainBody gap-4">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-32 text-[#16222C]">
        <VueltaAtras titulo="Notificaciones" compacto seccion="Mis avisos" />

        <section
          className="relative flex min-h-20 w-full items-center overflow-hidden rounded-3xl bg-linear-to-br from-[#144BD3] to-[#0E3494] px-5 py-4 text-white"
          aria-label="Resumen de avisos"
        >
          <span
            aria-hidden="true"
            className="absolute -right-8 -top-12 size-40 rounded-full bg-white/10"
          />
          <h2 className="relative text-3xl font-bold leading-8">
            Tenés 3 avisos nuevos
          </h2>
        </section>

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
          <TarjetaNotificacion
            momento="Ahora"
            titulo="Es hora de tu medicación"
            detalle="Losartán 50 mg."
            color="azul"
            icono="medicacion"
            nueva
          />
        </section>

        <section
          className="flex w-full flex-col gap-3 pt-1.5"
          aria-labelledby="avisos-hoy"
        >
          <h2 id="avisos-hoy" className="sr-only">
            Hoy
          </h2>
          <TarjetaNotificacion
            momento="Hace 2 min"
            titulo="Tu pedido de ayuda se envió"
            color="rojo"
            icono="ayuda"
            nueva
          />
          <TarjetaNotificacion
            momento="Hace 1 h"
            titulo="Poca batería en tu pulsera"
            color="gris"
            icono="bateria"
            nueva
          />
        </section>

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
          <TarjetaNotificacion
            momento="Ayer"
            titulo="Llevás 2.450 pasos"
            color="verde"
            icono="pasos"
          />
          <TarjetaNotificacion
            momento="Ayer"
            titulo="Mañana tenés consulta"
            detalle="Con el Dr. López, a las 10:00."
            color="azul"
            icono="consulta"
          />
        </section>

        <button
          type="button"
          className="flex min-h-14 w-full cursor-pointer items-center justify-center rounded-2xl border border-[#B7C8F0] bg-[#E7EDFB] px-4 py-3 text-base font-semibold text-[#144BD3] hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
        >
          Ajustar notificaciones
        </button>
      </div>
    </main>
  );
}
