export default function Boton1() {
  function Alerta() {
    console.log("Alerta");
  }

  return (
    <>
      <button
        className="text-2xl h-40 text-white bg-red-600 ring-5 ring-red-700 border-white border-3 rounded-full aspect-square p-2 active:scale-110 transition-scale duration-500 active:ring-8 shadow-[0_4px_16px_0_rgba(208,2,27,0.30)] 
  md:shadow-[0_8px_32px_0_rgba(208,2,27,0.40)] "
        onClick={Alerta}
      >
        <p className="font-extrabold text-7xl m-0 h-13">*</p>
        <p className="font-extrabold text-2xl m-0">SOS</p>
      </button>
    </>
  );
}
