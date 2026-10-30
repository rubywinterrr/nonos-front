import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { LuArrowLeft } from "react-icons/lu";
interface Prop {
  titulo?: string;
  compacto?: boolean;
  // texto chico de arriba del título (por defecto "Ficha de consulta")
  seccion?: string;
}

export default function VueltaAtras({ titulo = "NONOS", compacto = false, seccion = "Ficha de consulta" }: Prop) {
  const navigate = useNavigate();
  if (compacto) {
    return (
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          aria-label="Volver a la pantalla anterior"
          onClick={() => navigate(-1)}
          className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-[#E9EEF2] hover:bg-[#D7DFE6] active:border-[#1550E0] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
        >
          <LuArrowLeft aria-hidden="true" className="size-5" />
        </button>
        <div>
          <p className="text-sm font-semibold uppercase leading-5 tracking-wide text-[#435059]">{seccion}</p>
          <h1 className="w-fit border-b-2 border-[#D7DFE6] text-2xl font-bold leading-7 text-[#16222C]">{titulo}</h1>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 pb-4">
      <FaArrowLeft
        className="rounded-xl bg-gray-100 w-15 h-15 lg:w-18 lg:h-18 p-4 cursor-pointer hover:bg-gray-300"
        onClick={() => navigate(-1)}
      />
      <div>
        <h2 className="text-lg lg:text-xl font-semibold text-gray-500">
          FICHA DE CONSULTA
        </h2>
        <h1 className="border-b-2 border-white/70 font-semibold text-2xl lg:text-3xl">{titulo}</h1>
      </div>
    </div>
  );
}
