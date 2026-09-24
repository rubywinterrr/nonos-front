import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import iconAlerta from "../assets/Icon-Alerta.png";
import flecha from "../assets/Flecha.png";
import iconQR from "../assets/Icon-QR.png";
import iconTarjeta from "../assets/Icon-tarjeta.png";
import iconMed from "../assets/Icon-Medicina.png";

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
      <main className="min-h-main bg-main-blue w-screen flex flex-col items-baseline p-7 pb-[13vh] gap-10">
        <Header />
        <div>
          <h1 className="font-bold text-2xl mb-5">
            ¡Hola, {user?.nombre || "Usuario"}!
          </h1>
          <h2 className="text-xl text-gray-600">{obtenerFechaActual()}</h2>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 w-full">
          <h1 className="font-semibold text-2xl">
            Esta es tu condición de hoy
          </h1>
          <h2 className="text-1xl">Podés consultar tu estado abajo</h2>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-5 w-full">
          <div className="bg-white rounded-2xl w-full lg:w-25/100 md:w-60/100 min-h-30 p-4 shadow-md ">
            <ol className="list-inside list-disc">
              <li>0</li>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
            </ol>
          </div>
          <div className="bg-white rounded-2xl w-full lg:w-25/100 md:w-60/100 min-h-20 p-4 shadow-md hover:bg-gray-100 flex gap-5 cursor-pointer items-center">
            <div className="bg-[#E4E8F1] rounded-lg aspect-square w-15/100 m-1 flex items-center justify-center">
              <img src={iconTarjeta} alt="tarjeta" className="p-3" />
            </div>
            <div className="flex items-center w-80/100 justify-between bder">
              <div className="flex flex-col gap-1 justify-center">
                <h2 className="font-semibold text-xl">
                  Mi información de salud
                </h2>
                <p className="text-gray-500 text-md">
                  Ver medicamentos y datos
                </p>
              </div>
              <div className="aspect-square w-5/100 flex justify-end">
                <img src={flecha} alt="flecha" className="w-60/100" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl w-full lg:w-25/100 md:w-60/100 min-h-20 p-4 shadow-md hover:bg-gray-100 flex gap-5 cursor-pointer items-center">
            <div className="bg-[#E4E8F1] rounded-lg aspect-square w-15/100 m-1 flex items-center justify-center">
              <img src={iconMed} alt="Med" className="p-2 h-80/100" />
            </div>
            <div className="flex items-center w-80/100 justify-between">
              <div className="flex flex-col gap-1 justify-center">
                <h2 className="font-semibold text-xl">
                  Mis voluntades y cuidados
                </h2>
                <p className="text-gray-500 text-md">
                  Escribí tus preferencias
                </p>
              </div>
              <div className="aspect-square w-5/100 flex justify-end">
                <img src={flecha} alt="flecha" className="w-60/100" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl w-full lg:w-30/100 md:w-60/100 min-h-20 p-4 shadow-md hover:bg-gray-100 flex gap-5 cursor-pointer items-center">
            <div className="bg-[#E4E8F1] rounded-lg aspect-square w-15/100 m-1 flex items-center justify-center">
              <img src={iconQR} alt="QR" className="p-3" />
            </div>
            <div className="flex items-center w-80/100 justify-between">
              <div className="flex flex-col gap-1 justify-center">
                <h2 className="font-semibold text-xl">Mi código de pulsera</h2>
                <p className="text-gray-500 text-md">Ver código de 30 min</p>
              </div>
              <div className="aspect-square w-5/100 flex justify-end">
                <img src={flecha} alt="flecha" className="w-60/100" />
              </div>
            </div>
          </div>
          <NavLink
            className="bg-[#FF0000] rounded-2xl w-full md:w-30/100 min-h-30 p-5 md:p-8 shadow-md text-white cursor-pointer flex flex-col gap-3 justify-center items-center hover:bg-[#DE0000]"
            to={"/SOS"}
          >
            <div className="bg-[#FF2626] rounded-full h-18 aspect-square flex justify-center items-center">
              <img
                src={iconAlerta}
                alt="Alerta"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex flex-col gap-1 justify-center items-center">
              <h1 className="font-bold text-2xl">PEDIR AYUDA URGENTE</h1>
              <p className="font-bold text-md text-white/70 text-center">
                Presioná para notificar a tu familia y cuidadores
              </p>
            </div>
          </NavLink>
        </div>
      </main>
    </>
  );
}
