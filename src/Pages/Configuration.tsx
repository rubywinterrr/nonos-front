import Header from "../components/cajaArriba";
import Footer from "../components/cajaAbajo";
export default function Config() {
  return (
    <>
      <Header></Header>
      <main className="h-main bg-main">
        <h1 className="font-bold text-2xl">Configuración</h1>
      </main>
      <Footer></Footer>
    </>
  );
}
