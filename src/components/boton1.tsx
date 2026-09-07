import Icon from "../assets/Icon.png";

// Botón de emergencia principal.
// Activa la acción de alerta y se destaca visualmente con colores rojos intensos.
export default function Boton1() {
  // Función que dispara la acción de alerta general en caso de emergencia.
  function Alerta() {
    console.log("Alerta");
  }

  return (
    <>
      <button
        className="h-75 max-sm:h-55 flex flex-col items-center gap-5 justify-center text-white bg-red-600 ring-20 ring-red-600 border-white border-18 rounded-full aspect-square p-2 active:scale-110 transition-scale duration-500 active:ring-red-700"
        onClick={Alerta}
      >
        <img
          src={Icon}
          alt="simbolo salud"
          className="aspect-square h-50/100 p-1"
        />
        <p className="font-extrabold text-4xl m-0">SOS</p>
      </button>
    </>
  );
}
