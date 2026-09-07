import Header from "../components/cajaArriba";
import Footer from "../components/cajaAbajo";

// Vista para gestionar contactos o personas de emergencia vinculadas a la app.
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
