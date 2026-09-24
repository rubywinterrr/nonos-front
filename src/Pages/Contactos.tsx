import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import corazon from "../assets/Corazon.png";
import Icon from "../assets/Icon.png";

// Vista para gestionar contactos o personas de emergencia vinculadas a la app.
export default function Contactos() {
  const contactos = ["Miriam", "Pablo", "Ariel", "Raquel"];

  return (
    <>
      <main className="min-h-main w-screen flex flex-col items-baseline p-7 pb-[13vh] lg:pb-0 gap-7">
        <Header />
        <section className="w-full flex flex-col items-baseline gap-3">
          <div className="flex flex-col gap-3">
            <VueltaAtras />
            <h1 className="bg-gray-200 font-semibold text-md text-gray-500 p-3 rounded-full h-10 flex gap-2 items-center w-fit">
              <img
                src={corazon}
                alt="Corazon"
                className="h-90/100 aspect-square"
              />
              Acompañamiento diario
            </h1>
          </div>
          <div className="rounded-2xl bg-black w-full h-20 flex items-center justify-between p-3">
            <div className="h-95/100 aspect-square rounded-full bg-red-600 p-4">
              <img src={Icon} alt="Asterisco" />
            </div>
            <div className="flex flex-col gap-1 items-center">
              <h1 className="font-semibold text-white text-xl">
                107 Ambulancia
              </h1>
              <h2 className="text-md text-gray-400">Emergencias médicas</h2>
            </div>
            <div className="bg-white rounded-xl aspect-square h-95/100"></div>
          </div>
        </section>
      </main>
    </>
  );
}
