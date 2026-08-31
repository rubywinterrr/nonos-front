// Variante del encabezado sin los botones laterales.
// Se usa como alternativa visual cuando solo se necesita el logo centrado.
export default function Header2() {
  return (
    <>
      <header className="h-[10vh] md:h-[12vh] w-screen flex items-center justify-center border-b-2">
        <div className="h-90/100  w-60/100 flex items-center justify-center">
          <h1 className="font-bold text-5xl md:text-7xl md:font-extrabold">
            NONOS
          </h1>
        </div>
      </header>
    </>
  );
}
