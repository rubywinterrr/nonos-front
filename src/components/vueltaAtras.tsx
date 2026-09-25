import { FaArrowLeft } from "react-icons/fa6";
export default function VueltaAtras() {
  function NomPag() {
    const rutaActual = window.location.pathname.toLowerCase();
    switch (rutaActual) {
      case "/contactos":
        return "Contactos";
      case "/sos":
        return "Mi informacion médica";
      case "/codigo":
        return "Código de emergencia"
      default:
        return "NONOS";
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 pb-4">
        <FaArrowLeft
          className="rounded-xl bg-gray-100 w-15 h-15 lg:w-18 lg:h-18 p-4 cursor-pointer hover:bg-gray-300"
          onClick={() => window.history.back()}
        />
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-500">
            FICHA DE CONSULTA
          </h2>
          <h1 className="font-semibold text-2xl lg:text-3xl">{NomPag()}</h1>
        </div>
      </div>
    </>
  );
}
