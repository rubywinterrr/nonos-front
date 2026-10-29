import { LuPhone } from "react-icons/lu";

interface ContactoVinculadoProps {
  nombre: string;
  relacion: string;
  detalle?: string;
}

export default function ContactoVinculado({
  nombre,
  relacion,
  detalle,
}: ContactoVinculadoProps) {
  return (
    <article className="flex items-center justify-between gap-3 rounded-lg border border-[#D7DFE6] bg-white p-3">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold leading-5">{nombre}</h3>
        <p className="text-xs leading-4 text-[#435059]">{relacion}</p>
        {detalle && <p className="text-xs leading-4 text-[#435059]">{detalle}</p>}
      </div>
      <button
        type="button"
        aria-label={`Llamar a ${nombre}`}
        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#1550E0] text-white hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
      >
        <LuPhone aria-hidden="true" className="size-5" />
      </button>
    </article>
  );
}
