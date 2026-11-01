import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuBell } from "react-icons/lu";
import { MdChevronRight } from "react-icons/md";
import { notificacionesService } from "../services/notificacionesService";

// fila del inicio que lleva a "Avisos recibidos", con cuántos hay sin leer
export default function LinkAvisos() {
  const [sinLeer, setSinLeer] = useState(0);

  useEffect(() => {
    // cuenta los avisos sin leer
    const contar = async () => {
      try {
        const avisos = await notificacionesService.getNotificaciones();
        setSinLeer(avisos.filter((aviso) => !aviso.leida).length);
      } catch (err) {
        console.error(err);
      }
    };
    contar();
  }, []);

  return (
    <Link
      to="../avisos"
      className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-xs hover:bg-[#F5F9FF] active:bg-[#EBF5FF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]"
    >
      <span className="flex items-center gap-3">
        <LuBell aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-[#EBF5FF] p-2.5 text-[#0B5FFF]" />
        <span className="flex flex-col">
          <span className="text-base font-bold">Avisos recibidos</span>
          <span className="text-xs text-[#424656]">
            {sinLeer === 0 ? "No hay avisos sin leer" : `${sinLeer} ${sinLeer === 1 ? "aviso sin leer" : "avisos sin leer"}`}
          </span>
        </span>
      </span>
      <MdChevronRight aria-hidden="true" className="size-5 shrink-0 text-[#B9C6D5]" />
    </Link>
  );
}
