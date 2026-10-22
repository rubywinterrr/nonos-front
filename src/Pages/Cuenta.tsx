import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { useAuth } from "../hooks/useAuth";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";

export default function PagCuenta() {
  const { logout } = useAuth();

  return (
    <>
      <main className="mainBody">
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
                <p className="p-0.5 px-3 bg-green-50 border border-green-300 rounded-full">
                  Titular
                </p>
              </span>
              <p className="text-gray-500 text-sm">Edad • Adulto Mayor</p>
            </div>
          </div>
          <span className="w-full border-t border-t-gray-200 py-1 mt-3" />
          <div className=" pt-3 inline-flex flex-col justify-start items-start gap-2.5">
            <div className="flex justify-start items-start gap-2.5">
              <MdOutlineEmail />
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
              <MdOutlinePhone />
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
