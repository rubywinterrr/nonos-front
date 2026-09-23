import Header from "../components/Header";
import Footer from "../components/NavBar";
import iconContacto from "../assets/Icon-contactos.png";
import iconEscudo from "../assets/Icon-escudo.png";
import equis from "../assets/Equis.png";
import iconTelefono from "../assets/Icon-telefono.png";
import check from "../assets/Check.png";
import campana from "../assets/Campana.png";
import VueltaAtras from "../components/vueltaAtras";

//import Boton1 from "../components/boton1";

// Pantalla de emergencia.
// Centraliza la acción de alerta y comunica al usuario el aviso inmediato a contactos.
export default function SOS() {
  const contactos = ["Juli", "Ruby", "Joaco", "Nico"];

  const nombresFormateados = new Intl.ListFormat("es", {
    style: "long",
    type: "conjunction",
  }).format(contactos);

  return (
    <>
      <main className="bg-main-blue min-h-main w-screen p-7 pb-[13vh] flex flex-col items-baseline gap-7 lg:pb-0">
        <Header />
        <section className="w-full flex flex-col lg:flex-row items-baseline gap-3 lg:items-center lg:gap-25">
          <section className="w-full flex flex-col lg:w-50/100 gap-8">
            <VueltaAtras />
            <div className="w-full flex justify-center items-center">
              <h1 className="bg-[#D6E0F1] rounded-full w-65/100 xl:w-45/100 h-10 flex justify-center items-center text-1xl font-semibold shadow-lg gap-3">
                <img src={check} className="aspect-square h-50/100" />
                EMERGENCIA ENVIADA
              </h1>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              <div className="flex flex-col items-center justify-center w-80/100 gap-3">
                <div className="flex items-center justify-center bg-black rounded-full h-20 aspect-square">
                  <img
                    src={campana}
                    alt="Campanita de Notificación"
                    className="h-50/100 aspect-square"
                  />
                </div>
                <h1 className="text-2xl font-semibold">Ya pediste ayuda</h1>
                <p className="font-semibold text-xl text-gray-500 text-center">
                  Avisamos a {nombresFormateados}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl min-h-40 w-full flex flex-col items-center gap-3 p-5 ">
              <div className="flex justify-between items-center w-full">
                <h1 className="font-medium text-lg flex items-center">
                  <img src={iconContacto} alt="Contacto" className="h-5 mr-2" />
                  Contactos notificados
                </h1>
                <p className="text-gray-500">
                  {contactos.length} de {contactos.length}
                </p>
              </div>
              <div className="w-full">
                <div className="border border-gray-300 w-full rounded-full"></div>
              </div>
              <ol className="w-full flex flex-col gap-3 p-3">
                {contactos.map((contacto) => (
                  <li className="bg-[#EFF4FC] rounded-lg h-20 w-full p-3">
                    {contacto}
                  </li>
                ))}
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
              <button className="bg-red-600 rounded-2xl w-full  h-18 flex items-center justify-center text-lg p-5 gap-3 text-white font-semibold cursor-pointer">
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
