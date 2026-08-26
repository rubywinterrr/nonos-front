import Footer from "../componentes/cajaAbajo";
import Header from "../componentes/cajaArriba";
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
