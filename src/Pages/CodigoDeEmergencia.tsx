import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { MdQrCodeScanner, MdFullscreen, MdVibration } from "react-icons/md";
import { IoAlertCircle } from "react-icons/io5";
import { GoQuestion } from "react-icons/go";

export default function Codigo() {
  return (
    <>
      <main className="min-h-main w-screen bg-main-blue p-7 pb-[13vh] gap-7 flex flex-col items-baseline">
        <Header />
        <div className="flex flex-col gap-3">
          <VueltaAtras />
          <h1 className="bg-gray-200 font-semibold text-md text-gray-500 p-3 rounded-full h-10 flex gap-2 items-center w-fit">
            <IoAlertCircle className="text-xl" />
            EMERGENCIA ACTIVA
          </h1>
        </div>
        <section className="w-full flex flex-col lg:flex-row justify-center gap-5 items-center lg:gap-0">
          <div className="bg-black rounded-2xl lg:w-60/100 flex flex-col items-center gap-10 w-full p-7">
            <div className="flex flex-col gap-5 items-center">
              <div className="bg-[#1A1A1A] p-4 rounded-full h-16 w-16 text-4xl flex items-center justify-center text-white">
                <MdQrCodeScanner />
              </div>
              <h1 className="font-semibold text-white text-2xl text-center">
                Escaneá el QR de tu pulsera e ingresá este código:
              </h1>
            </div>
            <div className="w-full flex flex-col gap-7">
              <div className="bg-white rounded-xl text-6xl text-black p-10 w-full text-center">
                000-00
              </div>
              <div className="border-gray-700 border bg-[#101A21] w-full h-40 rounded-2xl"></div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-5">
            <h1 className="w-full min-h-12 lg:w-80/100 bg-[#DEE3EB] rounded-xl text-xl flex items-center justify-center gap-2 p-1">
              {" "}
              <MdFullscreen className="text-3xl font-bold" />
              Mostrar código en pantalla completa{" "}
            </h1>
            <div className="w-full min-h-12 lg:w-80/100 bg-white rounded-xl text-xl flex items-center justify-between gap-2 p-3 pl-5 pr-5">
              <div className="flex gap-2 items-center">
                <MdVibration className="text-2xl" />
                Sonido de ayuda
              </div>
              <span className="rounded-full bg-gray-300 text-sm p-2 font-semibold">
                ACTIVO
              </span>
            </div>
            <div className="rounded-xl lg:w-80/100 bg-white text-xl flex items-center w-full h-40 p-1 pl-5 gap-4">
              <div className="h-full w-8/100 flex justify-center">
                <GoQuestion className="text-2xl mt-5 text-gray-600"></GoQuestion>
              </div>
              <div className="flex flex-col justify-center items-center max-w-80/100 h-full gap-2">
                <h1 className="font-semibold w-full">
                  ¿Cómo funciona la pulsera?
                </h1>
                <p className="text-gray-600 text-sm w-full">
                  Cualquier ambulancia o profesional de la salud puede apuntar
                  con su teléfono al código QR grabado en tu muñeca e ingresar
                  estos números para conocer tus medicamentos y contactos
                  familiares de inmediato.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
