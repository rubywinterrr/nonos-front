import type { ReactNode } from "react";

interface CondicionMedicaProps {
  icono: ReactNode;
  titulo: string;
  estado: string;
  descripcion: string;
  colorIcono?: "azul" | "verde" | "violeta";
}

export default function CondicionMedica({
  icono,
  titulo,
  estado,
  descripcion,
  colorIcono = "azul",
}: CondicionMedicaProps) {
  const fondos = {
    azul: "bg-[#E7EDFB] text-[#1550E0]",
    verde: "bg-[#E8FAF1] text-[#0B6D3C]",
    violeta: "bg-[#EEE9FF] text-[#5B42B9]",
  };

  return (
    <article className="flex items-start gap-3 rounded-lg border border-[#D7DFE6] bg-white p-3">
      <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${fondos[colorIcono]}`}>
        {icono}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
          <h3 className="text-sm font-semibold leading-5">{titulo}</h3>
          {/* el estado no se muestra si viene vacío (el back todavía no lo guarda) */}
          {estado && (
            <span className="rounded border border-[#BAEDD3] bg-[#E8FAF1] px-2 py-0.5 text-xs font-semibold text-[#0B4C2B]">
              {estado}
            </span>
          )}
        </div>
        {descripcion && <p className="mt-1 text-xs leading-4 text-[#435059]">{descripcion}</p>}
      </div>
    </article>
  );
}

