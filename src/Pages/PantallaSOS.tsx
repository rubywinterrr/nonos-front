import Header from "../components/Header";  
import { RxCross2 } from "react-icons/rx";
import { MdOutlinePhone, MdNotificationsActive, MdOutlineHealthAndSafety, MdOutlinePeopleAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import VueltaAtras from "../components/vueltaAtras";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { usuarioService, type Vinculo } from "../services/usuariosService";

//import Boton1 from "../components/boton1";

// Pantalla de emergencia.
// Centraliza la acción de alerta y comunica al usuario el aviso inmediato a contactos.
export default function SOS() {
  const { usuario } = useAuth();
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;

    const fetchVinculos = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await usuarioService.getVinculos(usuario.id);
        // solo los de emergencia, que son los que reciben el aviso del SOS
        setVinculos(data.filter((vinculo) => vinculo.esContactoEmergencia));
      } catch (err) {
        console.error(err);
        setError("Hubo un error al cargar los contactos notificados");
      } finally {
        setLoading(false);
      }
    };

    fetchVinculos();
  }, [usuario]);

  const nombresFormateados = new Intl.ListFormat("es", {
    style: "long",
    type: "conjunction",
  }).format(vinculos.map((vinculo) => vinculo.familiar.nombreCompleto.split(" ")[0]));

  return (
    <>
      <main className="mainBody gap-7">
        <Header />
        <section className="w-full flex flex-col lg:flex-row items-baseline gap-3 lg:items-center lg:gap-25">
          <section className="w-full flex flex-col lg:w-50/100 gap-8">
            <VueltaAtras />
            <div className="w-full flex justify-center items-center">
              <h1 className="bg-[#D6E0F1] rounded-full w-65/100 xl:w-45/100 h-10 flex justify-center items-center text-1xl font-semibold shadow-lg gap-3">
                <FaCheckCircle className="text-xl" />
                EMERGENCIA ENVIADA
              </h1>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              <div className="flex flex-col items-center justify-center w-80/100 gap-3">
                <div className="flex items-center justify-center bg-black rounded-full h-20 aspect-square text-white text-5xl">
                  <MdNotificationsActive />
                </div>
                <h1 className="text-2xl font-semibold">Ya pediste ayuda</h1>
                <p className="font-semibold text-xl text-gray-500 text-center">
                  Avisamos a {nombresFormateados}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl min-h-40 w-full flex flex-col items-center gap-3 p-5">
              <div className="flex justify-between items-center w-full">
                <h1 className="font-medium text-lg flex items-center">
                  <MdOutlinePeopleAlt className="mr-2 text-2xl" />
                  Contactos notificados
                </h1>
                <p className="text-gray-500">
                  {vinculos.length} de {vinculos.length}
                </p>
              </div>
              <div className="w-full">
                <div className="border border-gray-300 w-full rounded-full"></div>
              </div>
              <ol className="w-full flex flex-col gap-2 p-3 lg:flex-row flex-wrap">
                {loading && <p>Cargando contactos...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {vinculos.map((vinculo) => (
                  <li key={vinculo.id} className="bg-[#EFF4FC] rounded-lg h-20 w-full p-3 lg:w-49/100">
                    {vinculo.familiar.nombreCompleto}
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <section className="w-full flex flex-col  lg:w-40/100 gap-10 lg:gap-25 lg:mt-10">
            <h1 className="bg-[#EFF4FC] rounded-2xl h-18 lg:h-15 w-full  text-sm flex gap-3 items-center p-5">
              <MdOutlineHealthAndSafety className="text-5xl" />
              Mantené la calma. Si se trató de un error podés cancelar en
              cualquier momento.
            </h1>
            <div className="flex flex-col gap-3 w-full">
              <button className="bg-red-600 rounded-2xl w-full  h-18 flex items-center justify-center text-lg p-5 gap-3 text-white font-semibold cursor-pointer">
                {" "}
                <MdOutlinePhone className="text-3xl" /> Llamar al 107
                (Emergencias Médicas)
              </button>
              <button className="bg-[#E9EEF6] rounded-2xl w-full  h-18 flex items-center justify-center text-lg p-5 gap-3 font-semibold cursor-pointer">
                {" "}
                <RxCross2 className="text-3xl" /> Fue una falsa alarma (Cancelar
                alerta)
              </button>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
