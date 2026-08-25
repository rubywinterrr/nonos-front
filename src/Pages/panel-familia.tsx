import Header from "../componentes/cajaArriba";
import Footer from "../componentes/cajaAbajo";
export default function PanelFamilia() {
  return (
    <>
      <Header />
      <main className="flex justify-center items-center flex-col h-[80vh] bg-green-100">
        <h1 className="text-2xl font-extrabold p-5">Panel Familia</h1>
      </main>
      <section className="w-screen h-[40vh] bg-amber-100">
        <h1 className="text-2xl font-extrabold p-5">Sección 2</h1>
      </section>
      <Footer />
    </>
  );
}
