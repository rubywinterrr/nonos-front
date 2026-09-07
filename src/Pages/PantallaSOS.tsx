import Header from "../components/cajaArriba";
import Footer from "../components/cajaAbajo";
import Boton1 from "../components/boton1";

// Pantalla de emergencia.
// Centraliza la acción de alerta y comunica al usuario el aviso inmediato a contactos.
export default function SOS() {
  return (
    <>
      <Header />
      <main className="h-main w-screen flex flex-col lg:flex-row items-center justify-evenly bg-main2 gap-10 pb-10 md:pb-15 lg:py-0">
        <div className="max-w-xs sm:max-w-sm px-4 h-fit flex flex-col justify-center items-center gap-5">
          <h1 className="text-red-600 font-bold text-3xl">Emergencia</h1>
          <h2 className="text-gray-600 text-center text-xl border p-5 rounded-2xl bg-[#EAE8E0]">
            Mantené presionado para pedir ayuda.
          </h2>
        </div>
        <Boton1 />
        <h2 className="text-xl text-center text-gray-600 w-80">
          Avisaremos a tus contactos de emergencia inmediatamente.
        </h2>
      </main>
      <Footer />
    </>
  );
}
