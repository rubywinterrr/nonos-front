import { CgPill } from "react-icons/cg";
import { MdOutlineSchedule } from "react-icons/io";

//FIJARSE EN EL FIGMA CADA COSA -- HAY UN EJEMPLO EN EL PRIMERO DE LA PANTALLA DE SALUD (MI INFO)
interface Props {
  nombre: string;
  dosis: string;
  horarios: string[];
}

export default function CajaMed({ nombre, dosis, horarios }: Props) {
  return (
    <div className="bg-white w-full flex gap-3 items-start justify-start rounded-2xl p-5 relative">
      <CgPill className="size-13 bg-gray-200 rounded-xl p-3" />
      <div className="flex flex-col items-start justify-start">
        <h1 className="font-semibold text-lg">{nombre}</h1>
        <p className="text-gray-600">{dosis}</p>
      <span className="flex items-center gap-2 text-gray-600">
          <MdOutlineSchedule className="text-xl" /> {horarios.join(" · ")}
        </span>
    </div>
    </div>
  );
}
