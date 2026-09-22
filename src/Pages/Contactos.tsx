import Header from "../components/Header";
import Footer from "../components/NavBar";
import VueltaAtras from "../components/vueltaAtras";
import corazon from "../assets/Corazon.png";

// Vista para gestionar contactos o personas de emergencia vinculadas a la app.
export default function Contactos() {
  const contactos = ["Miriam", "Pablo", "Ariel", "Raquel"];

  return (
    <>
      <main className="min-h-main w-screen flex flex-col items-baseline p-7 pb-[13vh] lg:pb-0 gap-7">
        <Header />
        <div className="flex flex-col gap-3">
          <VueltaAtras />
          <h1 className="bg-gray-200 font-semibold text-md text-gray-500 p-3 rounded-full h-10 flex gap-2 items-center w-fit">
            <img src={corazon} alt="Corazon" className="h-90/100 aspect-square" />
            Acompañamiento diario
          </h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
