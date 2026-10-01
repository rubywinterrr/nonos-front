import { MdOutlinePhone } from "react-icons/md";
export default function TarjetaContactos({
  nombre,
  nombreCompleto,
  fotoContacto,
}) {
  return (
    <>
      <div className="bg-white rounded-2xl flex flex-col gap-3 w-full h-40 items-center justify-center lg:w-32/100">
        <div className="w-full h-45/100 flex items-center p-1 gap-3 pl-6">
          <img
            className="border rounded-full aspect-square h-95/100 text-xs object-cover"
            src={fotoContacto}
            alt="Foto de contacto"
          />
          <div className="flex flex-col justify-baseline">
            <h1 className="font-bold text-2xl">{nombreCompleto}</h1>
            <p className="text-gray-500 text-md">Ubicación</p>
          </div>
        </div>
        <h2 className="font-semibold text-xl w-90/100 h-30/100 rounded-xl bg-gray-300 flex items-center justify-center hover:bg-black hover:text-white active:scale-97 hover:scale-102 active:bg-gray-400 cursor-pointer gap-5">
          {" "}
          <MdOutlinePhone className="text-2xl" />
          Llamar a {nombre}
        </h2>
      </div>
    </>
  );
}
