import Header from "./componentes/cajaArriba";
import Footer from "./componentes/cajaAbajo";
import Boton1 from "./componentes/boton1";
export default function SOS() {
  return (
    <>
      <Header />
      <main className="h-main w-screen flex flex-col items-center justify-center">
        <Boton1 />
      </main>
      <Footer />
    </>
  );
}
