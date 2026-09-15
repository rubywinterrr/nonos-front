//import Header from "../components/cajaArriba";
import Footer from "../components/cajaAbajo";
import { useAuth } from "../context/AuthContext";

// Página principal de inicio del usuario.
// Presenta una estructura de bloques con secciones de contenido y el layout base del sistema.
export default function Home() {
  const { user } = useAuth();
  const obtenerFechaActual = () => {
    const fecha = new Date();
    // Configuramos qué datos queremos (día de la semana, día del mes y mes)
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };

    // Obtenemos algo como "viernes, 15 de septiembre"
    const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);

    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  };
  return (
    <>
      <main className="flex flex-col">
        <div className="flex flex-col lg:flex-row">
          <section className="h-main bg-[#B9D2FF] w-screen lg:w-[50vw] flex flex-col p-7 items-baseline gap-10">
            <header className="flex justify-between items-center w-full">
              <h1 className="text-2xl font-extrabold">Inicio</h1>
              <div className="border h-10 aspect-square"></div>
            </header>
            <div>
              <h1 className="font-bold text-2xl mb-5">
                ¡Hola {user?.nombre || "Usuario"}!
              </h1>
              <h2 className="text-xl text-gray-600">{obtenerFechaActual()}</h2>
            </div>
          </section>

          <section className="w-screen lg:w-[50vw] h-[40vh] lg:h-main bg-amber-100">
            <h1 className="text-2xl font-extrabold p-5">Sección 2</h1>
          </section>
        </div>
        <div className="flex flex-col lg:flex-row">
          <section className="w-screen lg:w-[50vw] h-[30vh] lg:h-main bg-blue-100">
            <h1 className="text-2xl font-extrabold p-5">Sección 3</h1>
          </section>
          <section className="w-screen lg:w-[50vw] h-[60vh] lg:h-main bg-red-100">
            <h1 className="text-2xl font-extrabold p-5">Sección 4</h1>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
