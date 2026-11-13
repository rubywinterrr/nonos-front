import { MdOutlineEmail } from "react-icons/md";
export default function CuadroAsesor() {
  return (
    <div className="bg-[#DAEAF9] rounded-2xl w-full flex flex-col items-start justify-start min-h-50 p-5 gap-7">
      <div className="w-full flex items-start justify-start gap-3 pt-1 ">
        <MdOutlineEmail className="text-white bg-blue-700 rounded-full p-3 size-13" />
        <div className="flex flex-col gap-2 items-start pt-1  max-w-80/100">
          <h2 className="text-xl">¿Tenés dudas sobre este paso?</h2>
          <p className="text-gray-700 text-lg">
            Estamos disponibles para acompañarte paso a paso.
          </p>
        </div>
      </div>
      {/* llama al teléfono de asistencia de NONOS (el mismo de la pantalla del SOS) */}
      <a href="tel:+5491130285858" className="bg-blue-600 shadow-md hover:bg-blue-700 active:bg-blue-700 hover:scale-102 active:scale-99 text-white text-lg rounded-2xl w-full min-h-16 px-3 py-2 text-center cursor-pointer flex items-center justify-center">
        Contactate con un asesor humano
      </a>
    </div>
  );
}
