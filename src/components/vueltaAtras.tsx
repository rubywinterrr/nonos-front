import { useVolver } from "../hooks/useVolver";
import { FaArrowLeft } from "react-icons/fa6";
import { LuArrowLeft } from "react-icons/lu";
interface Prop {
  titulo?: string;
  compacto?: boolean;
  tituloPrincipal?: boolean;
  // texto chico de arriba del título (por defecto "Ficha de consulta")
  seccion?: string;
}

export default function VueltaAtras({ titulo = "NONOS", compacto = false, tituloPrincipal = true, seccion = "Ficha de consulta" }: Prop) {
  const volver = useVolver();
  const Titulo = tituloPrincipal ? "h1" : "p";
  if (compacto) {
    return (
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          aria-label="Volver a la pantalla anterior"
          onClick={volver}
          className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-[#E9EEF2] hover:bg-[#D7DFE6] active:border-[#1550E0] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
        >
          <LuArrowLeft aria-hidden="true" className="size-5" />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase leading-5 tracking-wide text-[#435059]">{seccion}</p>
          <Titulo className="w-fit border-b-2 border-[#D7DFE6] text-2xl font-bold leading-7 text-[#16222C]">{titulo}</Titulo>
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full min-w-0 items-center gap-3 pb-4">
      <button
        type="button"
        aria-label="Volver a la pantalla anterior"
        className="shrink-0 rounded-xl bg-gray-100 size-[min(3.75rem,72px)] lg:size-18 p-4 cursor-pointer hover:bg-gray-300"
        onClick={volver}
      >
        <FaArrowLeft aria-hidden="true" className="size-full" />
      </button>
      <div className="min-w-0">
        <p className="text-lg lg:text-xl font-semibold text-gray-700 uppercase">
          {seccion}
        </p>
        <Titulo className="border-b-2 border-white/70 font-semibold text-2xl lg:text-3xl">{titulo}</Titulo>
      </div>
    </div>
  );
}
