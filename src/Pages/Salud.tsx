import Header from "../componentes/cajaArriba";
import Footer from "../componentes/cajaAbajo";

export default function Salud() {
  return (
    <>
      <Header />
      <main className="w-screen h-main flex flex-col justify-center items-center">
        <h1 className="text-4xl font-extrabold">Salud</h1>
      </main>
      <Footer />
    </>
  );
}
