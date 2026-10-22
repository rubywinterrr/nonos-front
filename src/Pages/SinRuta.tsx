import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { useNavigate } from "react-router-dom";
export default function SinRuta() {
  const navigate = useNavigate();
  return (
    <>
      <main className="mainBody">
        <Header />
        <VueltaAtras />
        <div className="w-full lg:w-50/100 lg:relative lg:left-1/2 lg:-translate-x-1/2 static h-60 rounded-2xl bg-gray-50 border-t flex flex-col justify-center gap-5 items-center border-t-red-400 border-b-red-400 border-b">
          <h1 className="font-bold text-4xl">Ruta no encontrada</h1>
          <p className="text-gray-700 font-semibold text-2xl">
            Vuelve a la pagina anterior
          </p>
          <button
            onClick={() => navigate(-1)}
            className="border-gray-400 border rounded-lg p-2 text-lg bg-gray-200 cursor-pointer hover:bg-gray-300 active:bg-gray-400/80"
          >
            Volver atras
          </button>
        </div>
      </main>
    </>
  );
}
