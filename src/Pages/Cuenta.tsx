import Footer from "../components/cajaAbajo";
import Header from "../components/cajaArriba";

// Pantalla de perfil y configuración de la cuenta del usuario.
export default function PagCuenta() {
  return (
    <>
      <Header></Header>
      <main className="w-screen h-main bg-gray-200 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-extrabold">Cuenta</h1>
      </main>
      <Footer></Footer>
    </>
  );
}
