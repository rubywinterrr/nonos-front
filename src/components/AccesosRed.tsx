import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuSiren, LuStickyNote } from "react-icons/lu";
import { MdChevronRight } from "react-icons/md";
import { useAuth } from "../hooks/useAuth";
import { alertasService } from "../services/alertasService";
import { buscarAdultoSeleccionado } from "../utils/adultoQueSeMira";

// filas del inicio del familiar/cuidador que llevan a "Alertas" (con las pendientes) y a "Notas de la red"
export default function AccesosRed() {
  const { usuario } = useAuth();
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    if (!usuario) return;
    const miId = usuario.id;

    // cuenta las alertas pendientes del adulto que se mira
    const contar = async () => {
      try {
        const adulto = await buscarAdultoSeleccionado(miId);
        if (!adulto) return;
        const alertas = await alertasService.getAlertas(adulto.id);
        setPendientes(alertas.filter((a) => a.estado === "PENDIENTE").length);
      } catch (err) {
        console.error(err);
      }
    };
    contar();
  }, [usuario]);

  const clasesFila =
    "flex w-full items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-xs hover:bg-[#F5F9FF] active:bg-[#EBF5FF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5FFF]";

  return (
    <>
      <Link to="../alertas" className={clasesFila}>
        <span className="flex items-center gap-3">
          <LuSiren aria-hidden="true" className={`size-10 shrink-0 rounded-xl p-2.5 ${pendientes > 0 ? "bg-[#FFDBD2] text-[#AD2B00]" : "bg-[#EBF5FF] text-[#0B5FFF]"}`} />
          <span className="flex flex-col">
            <span className="text-base font-bold">Alertas</span>
            <span className="text-xs text-[#424656]">
              {pendientes === 0 ? "No hay alertas pendientes" : `${pendientes} ${pendientes === 1 ? "alerta pendiente" : "alertas pendientes"}`}
            </span>
          </span>
        </span>
        <MdChevronRight aria-hidden="true" className="size-5 shrink-0 text-[#B9C6D5]" />
      </Link>
      <Link to="../notas" className={clasesFila}>
        <span className="flex items-center gap-3">
          <LuStickyNote aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-[#EBF5FF] p-2.5 text-[#0B5FFF]" />
          <span className="flex flex-col">
            <span className="text-base font-bold">Notas de la red</span>
            <span className="text-xs text-[#424656]">Lo que anotan los que acompañan</span>
          </span>
        </span>
        <MdChevronRight aria-hidden="true" className="size-5 shrink-0 text-[#B9C6D5]" />
      </Link>
    </>
  );
}
