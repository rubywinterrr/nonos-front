import { LuActivity, LuHeartPulse, LuStethoscope, LuUserRound } from "react-icons/lu";

export type CategoriaHistorial = "episodios" | "medicacion" | "visitas";

interface TarjetaHistorialProps {
  fecha: string;
  hora: string;
  tipo: string;
  detalle: string;
  autor: string;
  categoria: CategoriaHistorial;
}

export default function TarjetaHistorial({ fecha, hora, tipo, detalle, autor, categoria }: TarjetaHistorialProps) {
  const IconoCategoria = categoria === "episodios" ? LuActivity : categoria === "medicacion" ? LuHeartPulse : LuStethoscope;
  return (
    <article className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E9EEF2] text-[#435059]"><IconoCategoria aria-hidden="true" className="size-4" /></span>
          <div className="min-w-0 text-sm leading-5"><p className="font-semibold">{fecha}</p><p className="text-[#435059]">{hora}</p></div>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-lg bg-[#E7EDFB] px-2 py-1 text-xs font-semibold uppercase leading-4 text-[#435059]"><IconoCategoria aria-hidden="true" className="size-3.5" />{tipo}</span>
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-[#E7EDFB] p-4">
        <h3 className="text-sm font-semibold leading-5 text-[#435059]">¿Qué ocurrió?</h3>
        <p className="text-base leading-6">{detalle}</p>
      </div>
      <div className="flex items-center gap-2 pt-1 text-sm leading-5 text-[#435059]"><LuUserRound aria-hidden="true" className="size-4 shrink-0" /><p className="truncate">Registrado por: {autor}</p></div>
    </article>
  );
}
