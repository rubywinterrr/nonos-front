import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { FondoBlanco } from "../components/funcionFondoBlanco";
import { useState, useEffect } from "react";
import stock3 from "../assets/stock3.png";
import { FaSmile } from "react-icons/fa";
import BotonSiguiente from "../components/botonSiguiente";
import { MdSos } from "react-icons/md";
import {
  MdChecklist,
  MdCheckCircleOutline,
  MdNotificationsActive,
} from "react-icons/md";
import CuadroAsesor from "../components/CuadroContactarAsesor";
export default function Tutorial1_2() {
  FondoBlanco();
  const progresoObjetivo = 50;
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
        <VueltaAtras titulo="Ayuda y soporte" />
        <section className="flex w-full lg:w-35/100 flex-col shadow-lg rounded-3xl p-5 gap-5 items-center justify-start">
          <div className="w-full flex justify-between items-center">
            <p className="rounded-lg bg-[#DBE1FF] p-2">TUTORIAL PARA EMPEZAR</p>
            <p className="bg-[#EBF5FF] rounded-lg flex items-center p-2 text-blue-600 justify-center gap-1">
              <HiOutlineCheckBadge className="text-2xl" /> 50%
            </p>
          </div>
          <h1 className="text-3xl">
            Paso 2 de 4: Cómo usar el botón rojo de auxilio
          </h1>
          <div
            className="h-4 w-full overflow-hidden rounded-full bg-blue-100"
            role="progressbar"
            aria-label="Progreso del tutorial"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
          >
            <div
              className="h-full rounded-full bg-blue-800"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <div className="flex w-full text-gray-400 justify-between items-center text-lg font-semibold pl-1 pr-1">
            <p>1. Pulsera</p>
            <p className="text-blue-800">2. Botón</p>
            <p>3. Familia</p>
            <p>4. Batería</p>
          </div>
        </section>
        <section className="rounded-3xl w-full flex flex-col items-start justify-start shadow-lg gap-5 p-5">
          <div
            className="rounded-2xl w-full h-75 relative"
            style={{
              backgroundImage: `url(${stock3})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top",
            }}
          >
            <div className="font-semibold rounded-2xl bg-[#F9F9F8] p-3 flex items-center gap-3 absolute w-95/100 bottom-3 left-1/2 -translate-x-1/2">
              <MdSos className="bg-red-700 rounded-full aspect-square text-white text-5xl p-2 flex items-center justify-center" />
              <div className="flex flex-col items-start justify-start gap-1 max-w-70/100">
                <h2 className="font-semibold text-xl">Botón SOS lateral</h2>
                <p className="text-gray-500 text-lg">
                  Mantenelo apretado 3 segundos
                </p>
              </div>
            </div>
          </div>

          <h2 className="flex gap-4 items-center justify-start font-semibold text-2xl mt-4">
            <MdNotificationsActive className="text-5xl rounded-xl bg-red-100 text-orange-800 p-3 " />
            Acción en caso de <br />
            emergencia
          </h2>
          <h1 className="font-semibold text-2xl text-orange-800">
            1. Presioná el botón rojo durante 3 segundos continuos
          </h1>
          <p className="text-gray-600 text-xl ">
            Una luz naranja empezará a parpadear. Esto significa que NONOS ya
            está avisando a tus contactos.
          </p>
          <div className="rounded-2xl bg-[#DAEAF9] w-full gap-3 p-5 flex">
            <FaSmile className="aspect-square text-5xl p-3 text-white rounded-full bg-blue-700" />
            <div className="flex flex-col justify-start items-start gap-2 max-w-80/100 ">
              <h3 className="font-bold text-xl">Un consejo para vos</h3>
              <p className="text-lg">
                No te preocupes por apretarlo sin querer. Tienes 10 segundos
                para cancelarlo tocando la pulsera antes de que se envíen las
                alarmas.
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
              Sentir el relieve redondeado del botón con tu dedo índice.
            </p>
            <p className="text-lg flex items-start justify-start gap-2 pl-2">
              <MdCheckCircleOutline className="text-green-800 text-4xl" />
              Recordar que funciona adentro y afuera de tu casa, las 24 horas.
            </p>
          </div>
          <BotonSiguiente
            siguientePaso="../tutorial1.3"
            texto="Tu familia avisada"
          />
        </section>
        <CuadroAsesor />
      </main>
    </>
  );
}
