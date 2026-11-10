import { LuTriangleAlert } from "react-icons/lu";
import type { Alerta } from "../services/alertasService";
import { diaYHora } from "../utils/formatoSignos";

interface Props {
    nombreAdulto: string;
    alertas: Alerta[];
}

// cartel del inicio del familiar y del cuidador cuando el adulto apretó SOS y sigue pendiente.
// Mismo estilo que los avisos críticos del inicio del adulto (AvisosSalud)
export default function CartelSOS({ nombreAdulto, alertas }: Props) {
    // busca el SOS pendiente más nuevo
    let sos: Alerta | null = null;
    for (const alerta of alertas) {
        if (alerta.tipo === "SOS_DIRECTO" && alerta.estado === "PENDIENTE") {
            if (!sos || new Date(alerta.createdAt).getTime() > new Date(sos.createdAt).getTime()) {
                sos = alerta;
            }
        }
    }
    if (!sos) return null;

    return (
        <article role="alert" className="flex items-start gap-3 rounded-2xl border border-[#BA1A1A]/40 bg-[#FFDAD6] p-4 text-[#93000A]">
            <LuTriangleAlert aria-hidden="true" className="size-8 shrink-0 text-[#BA1A1A]" />
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold leading-snug">SOS: alerta apretada</h2>
                <p className="text-base">{nombreAdulto.split(" ")[0]} apretó el botón de ayuda.</p>
                <p className="text-sm">{diaYHora(sos.createdAt)}</p>
            </div>
        </article>
    );
}