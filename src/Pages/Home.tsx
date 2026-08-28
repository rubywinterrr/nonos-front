import Header from "../componentes/cajaArriba";
import Footer from "../componentes/cajaAbajo";
export default function Home() {
  return (
    <>
      <Header />
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-main bg-green-100 w-screen md:w-[40vh]">
        <h1 className="text-2xl font-extrabold p-5">Home</h1>
      </main>
      <section className="w-screen md:w-[50vh] h-[40vh] bg-amber-100">
        <h1 className="text-2xl font-extrabold p-5">Sección 2</h1>
      </section>
      <Footer />
    </>
  );
}
