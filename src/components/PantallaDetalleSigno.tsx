import type { ReactNode } from "react";
import Header from "./Header";
import VueltaAtras from "./vueltaAtras";
import PestanasPeriodo from "./PestanasPeriodo";

interface Props {
  titulo: string;
  periodo: string;
  onCambiarPeriodo: (periodo: string) => void;
  cargando: boolean;
  error: string | null;
  sinAdulto: boolean;
  // texto de "Lo que vemos" (vacío si no hay datos para comentar)
  loQueVemos: string;
  children: ReactNode;
}

// estructura común de las 4 pantallas de detalle de signos vitales:
// encabezado, pestañas Hoy/Semana/Mes, el contenido propio, "Lo que vemos" y el aviso médico
export default function PantallaDetalleSigno({
  titulo,
  periodo,
  onCambiarPeriodo,
  cargando,
  error,
  sinAdulto,
  loQueVemos,
  children,
}: Props) {
  return (
    <main className="mainBody text-[#0E1D28]">
      <Header />
      <VueltaAtras titulo={titulo} seccion="Signos vitales" compacto />

      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <PestanasPeriodo periodo={periodo} onCambiar={onCambiarPeriodo} />

        {cargando && <p className="text-center text-[#424656]">Cargando datos de la pulsera…</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
        {sinAdulto && (
          <p className="rounded-2xl bg-white p-5 text-base">
            Todavía no estás vinculado a ningún adulto mayor. Cuando aceptes una invitación, vas a ver sus datos acá.
          </p>
        )}

        {!cargando && !sinAdulto && children}

        {!cargando && !sinAdulto && loQueVemos && (
          <section className="flex flex-col gap-1 rounded-2xl bg-white/70 p-4" aria-labelledby="lo-que-vemos">
            <h2 id="lo-que-vemos" className="font-bold text-[#0049CC]">Lo que vemos</h2>
            <p className="text-base leading-relaxed">{loQueVemos}</p>
          </section>
        )}

        <p className="text-center text-xs text-[#424656]">
          Información de acompañamiento. No reemplaza una consulta médica.
        </p>
      </div>
    </main>
  );
}
