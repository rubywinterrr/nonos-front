import Header from "../componentes/cajaArriba";
import Footer from "../componentes/cajaAbajo";
import Boton1 from "../componentes/boton1";
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex justify-center items-center flex-col h-[77vh] bg-green-100 w-screen">
        <h1 className="text-2xl font-extrabold p-5">Home</h1>
        <Boton1 />
      </main>
      <section className="w-screen h-[40vh] bg-amber-100">
        <h1 className="text-2xl font-extrabold p-5">Sección 2</h1>
      </section>
      <Footer />
    </>
  );
}
