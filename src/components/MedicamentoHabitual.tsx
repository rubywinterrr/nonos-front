import { LuClock3 } from "react-icons/lu";

interface MedicamentoHabitualProps {
  nombre: string;
  dosis: string;
  categoria: string;
  pauta: string;
}

export default function MedicamentoHabitual({ nombre, dosis, categoria, pauta }: MedicamentoHabitualProps) {
  return (
    <article className="flex w-full flex-col gap-2 rounded-xl bg-white p-4">
      <div className="flex w-full items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-6">{nombre}</h3>
          <p className="text-sm font-semibold leading-5 text-[#127A45]">Dosis: {dosis}</p>
        </div>
        {/* la categoría no se muestra si viene vacía (el back todavía no la guarda) */}
        {categoria && (
          <span className="max-w-55 rounded-sm bg-[#E8FAF1] px-2 py-1 text-right text-sm font-semibold leading-5 text-[#0B4C2B]">{categoria}</span>
        )}
      </div>
      <div className="flex items-start gap-2 pt-1 text-sm leading-5">
        <LuClock3 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#435059]" />
        <p>{pauta}</p>
      </div>
    </article>
  );
}
