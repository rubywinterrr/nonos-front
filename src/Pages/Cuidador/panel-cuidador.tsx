import Header from "../../components/cajaArriba";
import Footer from "../../components/cajaAbajo";

// Panel principal para el perfil del cuidador.
// Se utiliza para mostrar información relevante y acceso rápido a herramientas del cuidado.
export default function PanelCuidador() {
  return (
    <>
      <Header />
      <main className="flex justify-center items-center flex-col h-[80vh] bg-green-100 w-screen">
        <h1 className="text-2xl font-extrabold p-5">Panel Cuidador</h1>
      </main>
      <section className="w-screen h-[40vh] bg-amber-100">
        <h1 className="text-2xl font-extrabold p-5">Sección 2</h1>
      </section>
      <Footer />
    </>
  );
}
