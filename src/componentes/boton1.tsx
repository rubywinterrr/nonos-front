export default function Boton1() {
  function Cambio() {
    console.log("cambio de pantalla");
  }

  return (
    <>
      <button className="text-2xl text-red-600 border-red-400 border-2 rounded-full aspect-square p-2 hover:bg-red-100 active:scale-110 transition-scale duration-500 active:bg-red-300 active:border-8 " onClick={Cambio}>Cambiar</button>
    </>
  );
}
