import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { useState, useEffect } from "react";
import { FondoBlanco } from "../components/funcionFondoBlanco";
import stock2 from "../assets/stock2.png";
import { BiBulb } from "react-icons/bi";
import BotonSiguiente from "../components/botonSiguiente";
import {
  MdOutlineWatch,
  MdChecklist,
  MdCheckCircleOutline,
} from "react-icons/md";
import CuadroAsesor from "../components/CuadroContactarAsesor";
export default function Tutorial1() {
  FondoBlanco();

  const progresoObjetivo = 25;
  const [progreso, setProgreso] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgreso(progresoObjetivo);
    }, 150);
    return () => clearTimeout(timer);
  }, [progresoObjetivo]);
  return (
    <>
      <main className="mainBody bg-white">
        <Header />
        <VueltaAtras titulo="Ayuda y soporte"/>
        <section className="flex w-full lg:w-35/100 flex-col shadow-lg rounded-3xl p-5 gap-5 items-center justify-start">
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
            <div
              className="h-full rounded-full bg-blue-800"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <div className="flex w-full text-gray-400 justify-between items-center text-lg font-semibold pl-1 pr-1">
            <p className="text-blue-800">1. Pulsera</p>
            <p>2. Botón</p>
            <p>3. Familia</p>
            <p>4. Batería</p>
          </div>
        </section>
        <section className="rounded-3xl w-full flex flex-col items-start justify-start shadow-lg gap-5 p-5">
          <div
            className="rounded-2xl w-full h-75 relative"
            style={{
              backgroundImage: `url(${stock2})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top",
            }}
          >
            <h2 className="font-semibold rounded-2xl bg-[#F9F9F8] p-3 flex items-center gap-3 absolute w-95/100 bottom-3 left-1/2 -translate-x-1/2 pr-26">
              <div className="bg-[#84F6E6] rounded-full aspect-square h-8 w-8 flex items-center justify-center">
                <div className="bg-[#006A61] rounded-full h-40/100 aspect-square "></div>
              </div>
              Luz verde titilando: lista para cuidarte.
            </h2>
          </div>

          <div className="flex-col flex gap-3 items-start justify-center">
            <h2 className="flex gap-1 items-center justify-start text-blue-600">
              <MdOutlineWatch className="text-xl" />
              Paso inicial imprescindible
            </h2>
            <h1 className="font-semibold text-2xl">
              1. Colocate tu pulsera NONOS en la muñeca
            </h1>
          </div>
          <p className="text-gray-600 text-lg ">
            Ajustá la pulsera para que quede cómoda. Cuando la luz verde titila,
            significa que está encendida y lista.
          </p>
          <div className="rounded-2xl bg-[#DAEAF9] w-full gap-3 p-5 flex">
            <BiBulb className="aspect-square text-5xl p-2 bg-[#DBE1FF] rounded-full text-blue-700" />
            <div className="flex flex-col justify-start items-start gap-1 max-w-80/100 ">
              <h3 className="text-blue-800 text-xl font-semibold">
                Consejo útil diario
              </h3>
              <p>
                No hace falta sacártela para lavarte o bañarte. Es resistente al
                agua y continúa cuidándote en la ducha.
              </p>
            </div>
          </div>
          <div className="bg-[#EBF5FF] flex flex-col p-5 gap-3 rounded-2xl w-full">
            <h1 className="flex gap-2 items-center justify-start text-xl font-semibold">
              <MdChecklist className="text-3xl text-blue-700" />
              Comprobá antes de avanzar:
            </h1>
            <p className="text-lg flex items-start justify-start gap-2 pl-2">
              <MdCheckCircleOutline className="text-green-800 text-4xl" />
              Que pase un dedo entre la correa y tu piel para evitar marcas.
            </p>
            <p className="text-lg flex items-start justify-start gap-2 pl-2">
              <MdCheckCircleOutline className="text-green-800 text-4xl" />
              Que el botón rojo quede ubicado hacia el lado más accesible.
            </p>
          </div>
          <BotonSiguiente
            siguientePaso="../tutorial1.2"
            texto="Botón de auxilio"
          />
        </section>
        <CuadroAsesor />
      </main>
    </>
  );
}
