import flechaIzq from "../assets/FlechaIzq.png";
export default function VueltaAtras() {
  function NomPag() {
    const rutaActual = window.location.pathname;
    switch (rutaActual) {
      case "/Contactos":
        return "Contactos";
      case "/SOS":
        return "Mi informacion médica";
      default:
        return "NONOS";
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 pb-4">
        <img
          src={flechaIzq}
          alt="Flecha Izquierda"
          className="rounded-2xl bg-gray-200 h-15 aspect-square p-5 cursor-pointer hover:bg-gray-300"
          onClick={() => window.history.back()}
        ></img>
        <div>
          <h2 className="text-xl font-semibold text-gray-500">
            FICHA DE CONSULTA
          </h2>
          <h1 className="font-semibold text-2xl">{NomPag()}</h1>
        </div>
      </div>
    </>
  );
}
