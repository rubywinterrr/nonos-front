import Header from "../components/cajaArriba";
import Footer from "../components/cajaAbajo";

// Página principal de inicio del usuario.
// Presenta una estructura de bloques con secciones de contenido y el layout base del sistema.
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        <div className="flex flex-col lg:flex-row">
          <section className="h-main bg-green-100 w-screen lg:w-[50vw]">
            <h1 className="text-2xl font-extrabold p-5">Home</h1>
          </section>
          <section className="w-screen lg:w-[50vw] h-[40vh] lg:h-main bg-amber-100">
            <h1 className="text-2xl font-extrabold p-5">Sección 2</h1>
          </section>
        </div>
        <div className="flex flex-col lg:flex-row">
          <section className="w-screen lg:w-[50vw] h-[30vh] lg:h-main bg-blue-100">
            <h1 className="text-2xl font-extrabold p-5">Sección 3</h1>
          </section>
          <section className="w-screen lg:w-[50vw] h-[60vh] lg:h-main bg-red-100">
            <h1 className="text-2xl font-extrabold p-5">Sección 4</h1>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
