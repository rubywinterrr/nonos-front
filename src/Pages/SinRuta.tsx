import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { useVolver } from "../hooks/useVolver";
export default function SinRuta() {
  const volver = useVolver();
  return (
    <>
      <Header />
      <main id="contenido-principal" tabIndex={-1} className="mainBody">
        <VueltaAtras tituloPrincipal={false} />
        <div className="w-full lg:w-50/100 lg:relative lg:left-1/2 lg:-translate-x-1/2 static min-h-60 p-4 text-center rounded-2xl bg-gray-50 border-t flex flex-col justify-center gap-5 items-center border-t-red-400 border-b-red-400 border-b">
          <h1 className="font-bold text-4xl">Ruta no encontrada</h1>
          <p className="text-gray-700 font-semibold text-2xl">
            Vuelve a la pagina anterior
          </p>
          <button
            type="button"
            onClick={volver}
            className="border-gray-400 border rounded-lg p-2 text-lg bg-gray-200 cursor-pointer hover:bg-gray-300 active:bg-gray-400/80"
          >
            Volver atras
          </button>
        </div>
      </main>
    </>
  );
}
