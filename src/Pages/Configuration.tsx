import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { VscGear } from "react-icons/vsc";
import AjustesTexto from "../components/AjusteTamaños";
import { MdOutlineNotifications, MdCheck } from "react-icons/md";
import { Link } from "react-router-dom";
import { AiOutlineQuestionCircle } from "react-icons/ai";
export default function Config() {
  return (
    <>
      <main className="mainBody">
        <Header />
        <VueltaAtras titulo="Ajustes de accesibilidad" />
        <div className="rounded-2xl bg-white w-full p-7 gap-3 flex justify-start items-start">
          <VscGear className="bg-blue-600 rounded-full text-white p-3 text-5xl" />
          <div className="flex flex-col items-start justify-start max-w-85/100">
            <h1 className="text-xl font-semibold">
              Preferencias de tu aplicación
            </h1>
            <p className="text-gray-600">
              Configurá todo a tu manera. Los ajustes se aplicarán cuando
              guardes los cambios.
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-white w-full flex flex-col p-7 gap-5">
          <div className="w-full flex justify-start items-start gap-5 relative">
            <MdOutlineNotifications className="bg-blue-100/70 rounded-xl p-3 text-6xl text-blue-600 border border-blue-300/35" />
            <div className="flex flex-col items-start justify-start gap-2 pt-1">
              <h1 className="font-semibold text-xl">Notificaciones</h1>
              <p className="text-gray-500 text-lg">
                Elegí qué avisos querés recibir.
              </p>
            </div>
            <h3 className="bg-green-50 text-green-700 pl-2 pr-2 rounded-full border flex items-center gap-2 border-green-300/50 p-1 font-semibold absolute right-0 top-0">
              <MdCheck />
              Activadas
            </h3>
          </div>
          <div className="w-full h-20 rounded-2xl border border-gray-400 bg-gray 200"></div>
          <div className="w-full h-20 rounded-2xl border border-gray-400 bg-gray 200"></div>
          <div className="w-full h-20 rounded-2xl border border-gray-400 bg-gray 200"></div>
          <div className="w-full h-20 rounded-2xl border border-gray-400 bg-gray 200"></div>
          <div className="w-full h-20 rounded-2xl border border-gray-400 bg-gray 200"></div>
          <div className="w-full h-20 rounded-2xl border border-gray-400 bg-gray 200"></div>
        </div>
        <AjustesTexto />
        <div className="bg-white rounded-2xl w-full flex items-start justify-start p-7 gap-5 relative">
          <AiOutlineQuestionCircle className="text-blue-600 bg-gray-100 p-2 text-5xl rounded-lg border-gray-300 border" />
          <div className="flex flex-col items-start justify-start gap-1 max-w-80/100">
            <h1 className="font-semibold text-2xl">Ayuda</h1>
            <p className="text-gray-600">
              Cómo usar NONOS y resolver problemas con guías sencillas.
            </p>
          </div>
          <Link
            className="bg-white text-blue-700 p-2 rounded-lg border flex items-center gap-2 border-gray-300 font-semibold absolute right-4 top-4 cursor-pointer hover:bg-gray-100 active:bg-gray-200"
            to={"../ayuda"}
          >
            Ver ayuda
          </Link>
        </div>
        <div className="flex flex-col gap-3 p-5 items-center justify-center w-full bg-white rounded-2xl border border-gray-100">
          <p className="text-blue-600 font-black">Acerca de NONOS</p>
          <p className="font-bold text-lg">NONOS · Tecnología que acompaña</p>
          <p className=" text-gray-600">
            Versión 1.0 · Sistema seguro de acompañamiento
          </p>
        </div>
      </main>
    </>
  );
}
