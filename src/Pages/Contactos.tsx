import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { FaHeart } from "react-icons/fa";
import { BsChatLeftText } from "react-icons/bs";
import { VscInfo } from "react-icons/vsc";
import { MdOutlinePhone } from "react-icons/md";
import { BiHealth } from "react-icons/bi";
// Vista para gestionar contactos o personas de emergencia vinculadas a la app.
export default function Contactos() {
  const contactos = [
    {
      nombreCompleto: "Julian Garbate",
      nombre: "Julian",
      fotoContacto: "../../public/fotoPerfil_1.jpeg",
    },
    { nombreCompleto: "Ruby Winter", nombre: "Ruby" },
    {
      nombreCompleto: "Joaco Schopflo",
      nombre: "Joaco",
      fotoContacto: "../../public/joaco.jpeg",
    },
    { nombreCompleto: "Nico Nuñez", nombre: "Nico" },
    {
      nombreCompleto: "Javier Milei",
      nombre: "Javier",
      fotoContacto: "../../public/pedro.jpeg",
    },
    {
      nombreCompleto: "Martin Berenstein",
      nombre: "Martin",
      fotoContacto: "../../public/tincho.jpeg",
    },
    {
      nombreCompleto: "Martin Iud Matz",
      nombre: "Martin",
      fotoContacto: "../../public/iud.jpeg",
    },
  ];

  return (
    <>
      <main className="min-h-main w-screen flex flex-col items-baseline p-7 pb-[13vh] gap-7">
        <Header />
        <div className="flex flex-col gap-3">
          <VueltaAtras />
          <h1 className="bg-gray-200 font-semibold text-md text-gray-500 p-3 rounded-full h-10 flex gap-2 items-center w-fit">
            <FaHeart />
            Acompañamiento diario
          </h1>
        </div>
        <div className="rounded-2xl bg-black w-full h-23 flex items-center justify-between p-3 lg:w-32/100">
          <div className="flex items-center gap-3 border h-full">
            <div className="h-95/100 aspect-square rounded-full bg-red-600 p-4 flex justify-center items-center text-3xl text-white">
              <BiHealth />
            </div>
            <div className="flex flex-col justify-baseline">
              <h1 className="font-semibold text-white text-xl">
                107 Ambulancia
              </h1>
              <h2 className="text-md text-gray-400">Emergencias médicas</h2>
            </div>
          </div>
          <div className="bg-white rounded-lg aspect-square h-full flex items-center justify-center flex-col gap-1 p-1 cursor-pointer">
            <MdOutlinePhone className="text-3xl" />
            <p className="text-xs font-semibold">Llamar</p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-5 w-full flex-wrap">
          {contactos.map((contacto) => (
            <div className="bg-white rounded-2xl flex flex-col gap-3 w-full h-40 items-center justify-center lg:w-32/100">
              <div className="w-full h-45/100 flex items-center p-1 gap-3 pl-6">
                <img
                  className="border rounded-full aspect-square h-95/100 text-xs object-cover"
                  src={contacto.fotoContacto}
                  alt="Foto de contacto"
                />
                <div className="flex flex-col justify-baseline">
                  <h1 className="font-bold text-2xl">
                    {contacto.nombreCompleto}
                  </h1>
                  <p className="text-gray-500 text-md">Ubicación</p>
                </div>
              </div>
              <h2 className="font-semibold text-xl w-90/100 h-30/100 rounded-xl bg-gray-300 flex items-center justify-center hover:bg-black hover:text-white active:scale-97 hover:scale-102 active:bg-gray-400 cursor-pointer gap-5">
                {" "}
                <MdOutlinePhone className="text-2xl" />
                Llamar a {contacto.nombre}
              </h2>
            </div>
          ))}
        </div>
        <div className="w-full border-gray-400 border-t" />
        <div className="flex flex-col w-full gap-4 items-center justify-center">
          <div className="w-full bg-[#EFF4FC] rounded-xl h-40 flex justify-center items-center p-3 lg:w-40/100">
            <div className="flex gap-3 w-full">
              <div className=" h-full w-13/100 lg:flex lg:justify-center lg:items-baseline ">
                <div className=" bg-[#D6E0F1] aspect-square w-full lg:w-80/100 lg:mt-2 p-2.5 rounded-full flex items-center justify-center text-2xl text-gray-500">
                  <VscInfo />
                </div>
              </div>
              <div className=" pt-1 flex flex-col w-87/100 gap-2 h-full">
                <h1 className=" w-full h-24/100 font-semibold text-lg">
                  ¿Necesitas agregar a alguien?
                </h1>
                <p className=" max-w-90/100 h-70/100 text-gray-500 text-md w-full">
                  Tu familia gestiona los contactos para mayor seguridad. Puedes
                  avisarles con un solo toque.
                </p>{" "}
              </div>
            </div>
          </div>
          <h1 className="bg-gray-200 rounded-xl w-full text-center font-semibold p-2 text-md justify-center gap-2 flex items-center cursor-pointer h-15 lg:w-32/100">
            <BsChatLeftText />
            Avisar a {contactos[0].nombre} para agregar contactos.
          </h1>
        </div>
      </main>
    </>
  );
}
