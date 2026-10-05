import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { useEffect } from "react";
import { FaHandHoldingHeart } from "react-icons/fa";
import { BsPatchCheck } from "react-icons/bs";
import { PiBookOpenText } from "react-icons/pi";
import Stock1 from "../assets/fotoStock.png";
export default function Ayuda() {
  useEffect(() => {
    document.body.style.setProperty("background-color", "#FFFFFF", "important");
    return () => {
      document.body.style.removeProperty("background-color");
    };
  }, []);
  return (
    <>
      <main className="mainBody bg-white">
        <Header />
        <VueltaAtras />
        <div className="w-full lg:w-40/100 p-4 bg-linear-65 from-indigo-100 to-sky-100 rounded-xl shadow-md inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
          <div className="w-full inline-flex justify-start items-start gap-3">
            <div className="size-12 bg-white rounded-full shadow-md flex justify-center items-center">
              <FaHandHoldingHeart className="w-7 h-6 text-blue-600" />
            </div>
            <div className="flex-1 flex flex-col justify-start items-start">
              <h1 className="text-xl">Estamos para acompañarte</h1>
              <p className="text-lg text-gray-500">
                Aquí vas a encontrar ayuda para cuando lo necesites.
              </p>
            </div>
          </div>
          <div className="w-full pt-2 inline-flex justify-start items-center gap-2">
            <BsPatchCheck className="text-xl text-blue-600" />
            <p className="text-blue-600">
              Atención humana y comprensiva sin apuros
            </p>
          </div>
        </div>
        <h2 className="text-xl mb-4 flex items-center gap-2">
          <PiBookOpenText className="text-blue-600 text-3xl" />
          Tutoriales guiados
        </h2>
        <div className="rounded-3xl w-full lg:w-30/100 bg-white shadow-lg relative">
          <p className="text-blue-600 bg-gray-200 rounded-2xl w-30 flex items-center justify-center absolute top-2 left-2">
            Para empezar
          </p>
          <img src={Stock1} className="w-full min-h-40/100 rounded-t-3xl" />
          <div className="flex flex-col gap-3 p-3">
            <h2 className="text-xl w-full">
              Guía rápida para usar NONOS por primera vez
            </h2>
            <p className="w-full text-gray-600">
              Conocé en 3 minutos las funciones más importantes para tu
              tranquilidad y la de tus seres queridos.
            </p>
            <button className="bg-blue-600 text-white text-lg rounded-2xl w-full h-16 cursor-pointer">
              Ver guía paso a paso
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
