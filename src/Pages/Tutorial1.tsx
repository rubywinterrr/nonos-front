import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { FondoBlanco } from "../components/funcionFondoBlanco";
export default function Tutorial1() {
  FondoBlanco();
  return (
    <>
      <main className="mainBody bg-white">
        <Header />
        <VueltaAtras />
        <div className="flex w-full lg:w-35/100 flex-col shadow-lg rounded-3xl p-5 gap-5 items-center justify-start">
          <div className="w-full flex justify-between items-center">
            <p className="rounded-lg bg-[#DBE1FF] p-2">TUTORIAL PARA EMPEZAR</p>
            <p className="bg-[#EBF5FF] rounded-lg flex items-center p-2 text-blue-600 justify-center gap-1">
              <HiOutlineCheckBadge className="text-2xl" /> 25%
            </p>
          </div>
          <h1 className="text-3xl">
            Paso 1 de 4: Conocer tu pulsera y pantalla
          </h1>
          <div
            className="h-4 w-full overflow-hidden rounded-full bg-blue-100"
            role="progressbar"
            aria-label="Progreso del tutorial"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={25}
          >
            <div className="h-full w-1/4 rounded-full bg-blue-800"></div>
          </div>
          <div className="flex w-full text-gray-400 justify-between items-center text-lg font-semibold pl-1 pr-1">
            <p className="text-blue-800">1. Pulsera</p>
            <p>2. Botón</p>
            <p>3. Familia</p>
            <p>4. Batería</p>
          </div>
        </div>
      </main>
    </>
  );
}
