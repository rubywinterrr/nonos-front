import { useEffect, useState } from "react";
export default function ConfigCuenta1() {
  const progresoObjetivo = 50;
  const [progreso, setProgreso] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgreso(progresoObjetivo);
    }, 150);
    return () => clearTimeout(timer);
  }, [progresoObjetivo]);
  const [hasScrolled, setHasScrolled] = useState(() => window.scrollY > 0);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <main className="mainBody">
        <header
          className={`w-full min-h-17 fixed top-0 left-1/2 border-b-2 border-gray-200 z-50 -translate-x-1/2 flex items-center justify-center ${
            hasScrolled ? "shadow-md" : "shadow-none"
          }`}
        >
          <h1 className="text-3xl font-bold">NONOS</h1>
        </header>
        <section className="flex w-full lg:w-35/100 flex-col shadow-lg rounded-3xl p-5 gap-5 items-start bg-blue-50 justify-start">
          <span className="flex justify-between items-center w-full">
            <h1 className="text-xl text-blue-700 font-bold">Paso 1 de 2:</h1>
            <h2 className="text-gray-600 text-lg font-bold">50% completado</h2>
          </span>
          <div
            className="h-4 w-full overflow-hidden rounded-full bg-blue-100"
            role="progressbar"
            aria-label="Progreso del tutorial"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
          >
            <div
              className="h-full rounded-full bg-blue-700"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <h1 className="flex w-full text-gray-400 justify-between items-center font-semibold text-2xl">
            Tus datos básicos y cobertura médica
          </h1>
        </section>
      </main>
    </>
  );
}
