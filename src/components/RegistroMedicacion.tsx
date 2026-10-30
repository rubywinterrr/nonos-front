import { LuUserRound } from "react-icons/lu";

interface RegistroMedicacionProps {
  fecha: string;
  detalle: string;
  autor: string;
}

export default function RegistroMedicacion({ fecha, detalle, autor }: RegistroMedicacionProps) {
  return (
    <article className="flex w-full flex-col gap-2 rounded-xl bg-white p-4">
      <p className="text-sm font-semibold leading-5 text-[#54646F]">{fecha}</p>
      <p className="text-base font-semibold leading-6">{detalle}</p>
      <div className="flex items-center gap-2 pt-1 text-sm leading-5 text-[#54646F]">
        <LuUserRound aria-hidden="true" className="size-4 shrink-0" />
        <span>{autor}</span>
      </div>
    </article>
  );
}
