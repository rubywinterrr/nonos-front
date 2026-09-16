import Header from "../components/Header";
import Footer from "../components/cajaAbajo";
import flechaIzq from "../assets/FlechaIzq.png";
import iconContacto from "../assets/Icon-contactos.png";
import iconEscudo from "../assets/Icon-escudo.png";
import equis from "../assets/Equis.png";
import iconTelefono from "../assets/Icon-telefono.png";
//import Boton1 from "../components/boton1";

// Pantalla de emergencia.
// Centraliza la acción de alerta y comunica al usuario el aviso inmediato a contactos.
export default function SOS() {
  function Volver() {
    window.history.back();
  }
  return (
    <>
      <main className="bg-main-blue min-h-main w-screen p-7 pb-[13vh] flex flex-col items-baseline gap-10 lg:pb-0">
        <Header />
        <section className="w-full flex flex-col lg:flex-row items-baseline gap-10 lg:items-center lg:gap-25">
          <section className="w-full flex flex-col  lg:w-50/100 gap-10">
            <div className="flex items-center gap-5">
              <img
                src={flechaIzq}
                alt="Flecha Izquierda"
                className="rounded-2xl bg-gray-200 h-18 aspect-square p-5 cursor-pointer hover:bg-gray-300"
                onClick={Volver}
              ></img>
              <div>
                <h2 className="text-xl font-semibold text-gray-500">
                  FICHA DE CONSULTA
                </h2>
                <h1 className="font-semibold text-2xl">
                  Mi informacion médica
                </h1>
              </div>
            </div>
            <div className="w-full flex justify-center items-center">
              <h1 className="bg-[#D6E0F1] rounded-full w-60/100 h-12 flex justify-center items-center text-1xl font-semibold shadow-lg">
                EMERGENCIA ENVIADA
              </h1>
            </div>
            <div className="bg-white rounded-2xl min-h-40 w-full flex flex-col items-center gap-3 p-5 ">
              <div className="flex justify-between items-center w-full">
                <h1 className="font-medium text-lg flex items-center">
                  <img src={iconContacto} alt="Contacto" className="h-5 mr-2" />
                  Contactos notificados
                </h1>
                <p className="text-gray-500">2 de 2</p>
              </div>
              <div className="w-full">
                <div className="border border-gray-300 w-full rounded-full"></div>
              </div>
              <ol className="w-full flex flex-col gap-3 p-3">
                <li className="bg-[#EFF4FC] rounded-lg h-20 w-full p-3">1</li>
                <li className="bg-[#EFF4FC] rounded-lg h-20 w-full p-3">2</li>
              </ol>
            </div>
          </section>
          <section className="w-full flex flex-col  lg:w-40/100 gap-10 lg:gap-25 lg:mt-30">
            <h1 className="bg-[#EFF4FC] rounded-2xl h-18 lg:h-15 w-full  text-sm flex gap-5 items-center p-5">
              <img src={iconEscudo} alt="Escudo" className="h-7" />
              Mantené la calma. Si se trató de un error podés cancelar en
              cualquier momento.
            </h1>
            <div className="flex flex-col gap-3 w-full">
              <button className="bg-red-500 rounded-2xl w-full  h-18 flex items-center justify-center text-lg p-5 gap-3 text-white font-semibold cursor-pointer">
                {" "}
                <img src={iconTelefono} alt="Teléfono" className="h-6" /> Llamar
                al 107 (Emergencias Médicas)
              </button>
              <button className="bg-[#E9EEF6] rounded-2xl w-full  h-18 flex items-center justify-center text-lg p-5 gap-3 font-semibold cursor-pointer">
                {" "}
                <img src={equis} alt="Cancelar" className="h-4" /> Fue una falsa
                alarma (Cancelar alerta)
              </button>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
