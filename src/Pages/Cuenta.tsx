import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { useAuth } from "../hooks/useAuth";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { FiSmartphone, FiPlus } from "react-icons/fi";
import { GrEmptyCircle } from "react-icons/gr";
import { HiMiniSignal } from "react-icons/hi2";
import { IoWatchOutline } from "react-icons/io5";
import { IoIosLink } from "react-icons/io";

import Desplegable from "../components/menuDesplegable";

export default function PagCuenta() {
  const { logout } = useAuth();


  return (
    <>
      <main className="mainBody gap-5">
        <Header />
        <VueltaAtras titulo="Mi Cuenta" />
        <div className="bg-white rounded-2xl flex flex-col gap-1 p-5 w-full min-h-50">
          <div className="flex gap-2 items-center">
            <img
              src="/fotoPerfil_1.jpeg"
              alt="foto de perfil"
              className="rounded-full aspect-square h-12 bg-center bg-cover"
            />
            <div className="flex flex-col items-start justify-center">
              <span className="flex items-center gap-2">
                <h1 className="font-semibold text-lg">Nombre</h1>
                <p className="p-0.5 px-3 text-xs font-semibold text-emerald-800 bg-green-50 border border-green-300 rounded-full">
                  Titular
                </p>
              </span>
              <p className="text-gray-500 text-sm">Edad • Adulto Mayor</p>
            </div>
          </div>
          <span className="w-full border-t border-t-gray-200 py-1 mt-3" />
          <div className=" pt-3 inline-flex flex-col justify-start items-start gap-2.5">
            <div className="flex justify-start items-start gap-2.5">
              <MdOutlineEmail className="text-blue-600" />
              <div className="flex flex-col justify-start items-start">
                <div className="flex flex-col justify-start items-start">
                  <div className="justify-center text-slate-500 text-xs font-semibold  uppercase leading-4">
                    CORREO ELECTRÓNICO
                  </div>
                </div>
                <div className="justify-center text-slate-900 text-sm font-semibold leading-5">
                  email
                </div>
              </div>
            </div>
            <div className="flex justify-start items-start gap-2.5">
              <MdOutlinePhone className="text-blue-600" />
              <div className="flex flex-col justify-start items-start">
                <div className="justify-center text-slate-500 text-xs font-semibold  uppercase leading-4">
                  TELÉFONO VINCULADO
                </div>
                <div className="justify-center text-slate-900 text-sm font-semibold leading-5">
                  numero
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full rounded-2xl bg-white p-5 gap-5 flex flex-col items-start justify-start">
          <div className="flex w-full gap-2">
            <FiSmartphone className="size-8 bg-blue-50 text-blue-600 rounded-full p-2 stroke-2" />
            <div className="flex flex-col max-w-80/100">
              <h1 className="font-bold">Pulsera y botón</h1>
              <p className="text-gray-700 text-sm">
                Dispositivos de cuidado de José: botón de emergencia y pulsera
                de salud.
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl w-full flex flex-col items-start justify-start gap-2 border border-gray-200 ">
            <h1 className="font-bold inline-flex items-center justify-start gap-2 -translate-x-1">
              <GrEmptyCircle className="size-8 text-blue-700 stroke-2 bg-blue-50 rounded-full p-1.5" />
              Botón de emergencia
            </h1>
            <p className="text-gray-700 text-sm">
              El botón físico envía la misma alerta prioritaria que el botón de
              la aplicación.
            </p>{" "}
            {/* ESTA CAJA INDICA SI HAY BOTON O NO, PONGO ESTO PERO VA INFO*/}
            <div className="border border-dashed border-gray-300 w-full flex flex-col items-center justify-center text-center gap-2 rounded-lg p-5">
              <HiMiniSignal className="text-gray-500 bg-gray-200 rounded-full size-9 p-2" />
              <h2 className="font-bold text-sm">
                No hay ningún botón registrado
              </h2>
              <p className="text-gray-500 text-xs">
                Registrá el código para que sus pedidos de ayuda lleguen a tu
                red.
              </p>
            </div>
            <div className="flex flex-col gap-2 my-3 w-full">
              <h2 className="text-gray-600 font-semibold text-sm">
                IDENTIFICADOR DEL BOTÓN
              </h2>
              <input
                type="text"
                className="border border-gray-200 rounded-lg text-sm p-3 w-full"
                placeholder="Ej: NONOS-8492 o MAC"
              />
              <button className="bg-blue-700 font-medium items-center justify-center flex gap-3 hover:bg-blue-800 active:bg-blue-800 hover:scale-102 active:scale-99 text-white text-lg rounded-2xl w-full h-14 cursor-pointer">
                <FiPlus className="stroke-2 size-6" />
                Registrar botón
              </button>
            </div>
          </div>
          <div className="self-stretch p-3.5 bg-white rounded-2xl outline  outline-slate-200 inline-flex flex-col justify-start items-start gap-[2.70px]">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="size- inline-flex gap-2 justify-start items-center mb-2">
                <IoWatchOutline className="text-blue-600 size-6 bg-blue-50 rounded-full p-1" />
                <h1 className=" text-gray-900 text-sm font-bold flex items-center justify-start">
                  Pulsera inteligente (Salud y caídas)
                </h1>
              </div>
            </div>
            <div className="self-stretch pb-2.5 flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-slate-500 text-xs font-normal ">
                Compartís solo los datos que autorices. Se usan para detectar
                caídas, frecuencia cardíaca anormal y avisar a la red.
              </div>
            </div>
            <div className="self-stretch min-h-12 px-4 py-3.5 bg-white rounded-xl shadow-xs border border-emerald-300 inline-flex justify-center items-center gap-2">
              <button className="text-center gap-2 justify-center text-blue-700 text-xs font-bold flex items-center justiy-start">
                <IoIosLink /> Conectar con Google Health / Fitbit
              </button>
            </div>
          </div>
        </div>

        <Desplegable />
      </main>

      <button
        onClick={logout}
        className="mt-6 bg-red-600 text-white font-semibold rounded-xl px-6 py-3 cursor-pointer"
      >
        Cerrar sesión
      </button>
    </>
  );
}
