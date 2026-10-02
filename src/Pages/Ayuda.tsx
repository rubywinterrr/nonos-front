import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { useEffect } from "react";
import { FaHandHoldingHeart } from "react-icons/fa";
import { BsPatchCheck } from "react-icons/bs";
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
        <div className="w-full p-4 bg-linear-65 from-indigo-100 to-sky-100 rounded-xl shadow-md inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
          <div className=" w-full inline-flex justify-start items-start gap-3">
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
          <div className=" w-full pt-2 inline-flex justify-start items-center gap-2">
            <BsPatchCheck className="text-xl text-blue-600" />
            <p className="text-blue-600">
              Atención humana y comprensiva sin apuros
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
