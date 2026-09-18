import Header from "../components/Header";
import Footer from "../components/cajaAbajo";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Página principal de inicio del usuario.
// Presenta una estructura de bloques con secciones de contenido y el layout base del sistema.
export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      <main className="flex flex-col w-screen">
        <section className="min-h-main bg-main-blue w-screen flex flex-col items-baseline p-7 pb-[13vh] gap-10">
          <Header />
          <div>
            <h1 className="font-bold text-2xl mb-5">
              ¡Hola {user?.nombre || "Usuario"}!
            </h1>
            <h2 className="text-xl text-gray-600">{obtenerFechaActual()}</h2>
          </div>
          <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-5 w-full">
            <div className="bg-white rounded-2xl w-full lg:w-25/100 md:w-60/100 min-h-30 p-4 shadow-md">
              <ol className="list-inside list-disc">
                <li>0</li>
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
              </ol>
            </div>
            <div className="bg-white rounded-2xl w-full lg:w-25/100 md:w-60/100 min-h-20 p-4 shadow-md">
              2
            </div>
            <div className="bg-white rounded-2xl w-full lg:w-25/100 md:w-60/100 min-h-20 p-4 shadow-md">
              3
            </div>
            <div className="bg-white rounded-2xl w-full lg:w-30/100 md:w-60/100 min-h-20 p-4 shadow-md">
              4
            </div>
            <div
              className="bg-[#FF0000] rounded-2xl w-full md:w-30/100 h-30 p-4 shadow-md text-white cursor-pointer"
              onClick={() => navigate("/SOS")}
            >
              Emergencia
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
