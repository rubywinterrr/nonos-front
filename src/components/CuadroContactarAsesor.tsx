import { MdOutlineEmail } from "react-icons/md";
export default function CuadroAsesor() {
  return (
    <div className="bg-[#DAEAF9] rounded-2xl w-full flex flex-col items-start justify-start min-h-50 p-5 gap-7">
      <div className="w-full flex items-start justify-start gap-5 pt-1 ">
        <MdOutlineEmail className="text-white bg-blue-700 rounded-full p-3 text-6xl" />
        <div className="flex flex-col gap-2 items-start pt-1  max-w-80/100">
          <h2 className="text-xl">¿Tenés dudas sobre este paso?</h2>
          <p className="text-gray-500 text-lg">
            Estamos disponibles para acompañarte paso a paso.
          </p>
        </div>
      </div>
      <button className="bg-blue-600 shadow-md hover:bg-blue-700 active:bg-blue-700 hover:scale-102 active:scale-99 text-white text-lg rounded-2xl w-full h-16 cursor-pointer">
        Contactate con un asesor humano
      </button>
    </div>
  );
}
