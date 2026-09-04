import Header from "../../components/cajaArriba";
import Footer from "../../components/cajaAbajo";

// Panel principal para el perfil de adulto mayor.
// Sirve como pantalla de inicio con una sección destacada y contenido complementario.
export default function PanelAdulto() {
  return (
    <>
      <Header />
      <main className="flex justify-center items-center flex-col h-[80vh] bg-green-100 w-screen">
        <h1 className="text-2xl font-extrabold p-5">Panel Adulto</h1>
      </main>
      <section className="w-screen h-[40vh] bg-amber-100">
        <h1 className="text-2xl font-extrabold p-5">Sección 2</h1>
      </section>
      <Footer />
    </>
  );
}
