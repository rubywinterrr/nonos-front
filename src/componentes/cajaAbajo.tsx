export default function Footer() {
  return (
    <>
      <footer className="bg-white border-t-2 border-[#002B2F] h-[13vh] w-screen fixed bottom-0 flex flex-row justify-evenly items-center">
        <div className="h-93/100 border rounded-lg aspect-square flex justify-center items-center flex-col">
          <div className="aspect-square h-50/100 border"></div>
          <p className="font-bold">Inicio</p>
        </div>
        <div className="h-93/100 border rounded-lg aspect-square flex justify-center items-center flex-col">
          <div className="aspect-square h-50/100 border"></div>
          <p className="font-bold">Salud</p>
        </div>
        <div className="h-93/100 border rounded-lg aspect-square flex justify-center items-center flex-col">
          <div className="aspect-square h-50/100 border"></div>
          <p className="font-bold">Contactos</p>
        </div>
        <div className="h-93/100 border rounded-lg aspect-square flex justify-center items-center flex-col bg-[#FFDAD6]">
          <div className="aspect-square h-50/100 border border-[#D0021B]"></div>
          <p className="font-bold text-[#D0021B]">SOS</p>
        </div>
      </footer>
    </>
  );
}
