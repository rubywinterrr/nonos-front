import Header from "../componentes/cajaArriba";
import Footer from "../componentes/cajaAbajo";

export default function Contactos() {
  return (
    <>
      <Header />
      <main className="w-screen h-main flex flex-col justify-center items-center">
        <h1 className="text-4xl font-extrabold">Contactos</h1>
      </main>
      <Footer />
    </>
  );
}
