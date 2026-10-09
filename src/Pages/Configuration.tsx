import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { VscGear } from "react-icons/vsc";
import AjustesTexto from "../components/AjusteTamaños";
import { MdOutlineNotifications, MdCheck } from "react-icons/md";
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
      </main>
    </>
  );
}
