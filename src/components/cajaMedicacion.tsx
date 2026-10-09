import { CgPill } from "react-icons/cg";
import { IoMdInformationCircleOutline } from "react-icons/io";

//FIJARSE EN EL FIGMA CADA COSA -- HAY UN EJEMPLO EN EL PRIMERO DE LA PANTALLA DE SALUD (MI INFO)

export default function CajaMed() {
  return (
    <div className="bg-white w-full flex gap-5 items-start justify-start rounded-2xl p-5 relative">
      <CgPill className="text-6xl bg-gray-200 rounded-xl p-3" />
      <div className="flex flex-col items-start justify-start">
        <h1 className="font-semibold text-xl">Losartán 50mg</h1>
        <p className="text-lg text-gray-600">1 comprimido por la mañana</p>
        <span className="flex items-center gap-2 text-gray-600">
          <IoMdInformationCircleOutline className="text-xl" /> Presión arterial
        </span>
      </div>
      <p className="bg-gray-200 rounded-lg p-1 absolute top-5 right-5 pr-2 pl-2 font-semibold">
        Presión arterial
      </p>
    </div>
  );
}
