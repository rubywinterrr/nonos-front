import { useState } from "react";
import { LuActivity, LuHeartPulse, LuPencil, LuStethoscope, LuTrash2, LuUserRound } from "react-icons/lu";

export type CategoriaHistorial = "episodios" | "medicacion" | "visitas";

interface TarjetaHistorialProps {
  fecha: string;
  hora: string;
  tipo: string;
  detalle: string;
  autor: string;
  categoria: CategoriaHistorial;
  // solo vienen si el registro es de quien está mirando: muestran "Editar" y "Borrar"
  onEditar?: () => void;
  onBorrar?: () => void;
}

export default function TarjetaHistorial({ fecha, hora, tipo, detalle, autor, categoria, onEditar, onBorrar }: TarjetaHistorialProps) {
  // true mientras se pregunta "¿Borrar este registro?"
  const [confirmando, setConfirmando] = useState(false);
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
      {onEditar && onBorrar && !confirmando && (
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onEditar} className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E7EDFB] text-sm font-semibold text-[#0D328B] hover:bg-[#D3E0F8]">
            <LuPencil aria-hidden="true" className="size-4" />
            Editar
          </button>
          <button type="button" onClick={() => setConfirmando(true)} className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FBE9E9] text-sm font-semibold text-[#A92323] hover:bg-[#F5D0D0]">
            <LuTrash2 aria-hidden="true" className="size-4" />
            Borrar
          </button>
        </div>
      )}
      {onBorrar && confirmando && (
        <div className="flex flex-col gap-2 rounded-lg bg-[#FBE9E9] p-3">
          <p className="text-sm font-semibold text-[#A92323]">¿Borrar este registro?</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={onBorrar} className="min-h-11 cursor-pointer rounded-lg bg-[#C92A2A] font-semibold text-white hover:bg-[#AF2424]">Sí, borrar</button>
            <button type="button" onClick={() => setConfirmando(false)} className="min-h-11 cursor-pointer rounded-lg bg-white font-semibold hover:bg-[#E9EEF2]">No</button>
          </div>
        </div>
      )}
    </article>
  );
}