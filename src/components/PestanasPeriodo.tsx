import { periodos } from "../utils/formatoSignos";

interface Props {
  periodo: string;
  onCambiar: (periodo: string) => void;
}

// botones Hoy / Semana / Mes de las pantallas de signos vitales
export default function PestanasPeriodo({ periodo, onCambiar }: Props) {
  return (
    <div role="group" aria-label="Período de consulta" className="grid grid-cols-3 gap-1 rounded-2xl bg-[#DAEAF9]/60 p-1">
      {periodos.map((opcion) => (
        <button
          key={opcion.valor}
          type="button"
          aria-pressed={periodo === opcion.valor}
          onClick={() => onCambiar(opcion.valor)}
          className={`min-h-11 min-w-0 cursor-pointer rounded-xl px-2 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF] ${
            periodo === opcion.valor
              ? "bg-white font-bold text-[#0049CC] shadow-xs"
              : "font-semibold text-[#424656] hover:bg-white/50 active:bg-white/70"
          }`}
        >
          {opcion.texto}
        </button>
      ))}
    </div>
  );
}
