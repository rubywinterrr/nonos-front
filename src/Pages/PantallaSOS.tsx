import Header from "../componentes/cajaArriba";
import Footer from "../componentes/cajaAbajo";
import Boton1 from "../componentes/boton1";
export default function SOS() {
  return (
    <>
      <Header />
      <main className="h-main w-screen flex flex-col items-center justify-evenly">
        <div className="w-sm h-fit flex flex-col justify-center items-center">
          <h1 className="text-red-600 font-black text-2xl">Emergencia</h1>
          <h2 className="text-gray-600 text-center text-xl">
            Mantené presionado para pedir ayuda inmediata a tus contactos.
          </h2>
        </div>
        <Boton1 />
      </main>
      <Footer />
    </>
  );
}
