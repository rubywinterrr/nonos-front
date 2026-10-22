import { FondoBlanco } from "../../components/funcionFondoBlanco";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { IoMdHeart } from "react-icons/io";
import CajaPreferencias from "../../components/CajaPreferencias";
import { MdLock, MdCheck } from "react-icons/md";
import { LuCirclePlus } from "react-icons/lu";

export default function Cuidados() {
  FondoBlanco();
  return (
    <>
      <main className="mainBody bg-white">
        <Header />
        <VueltaAtras titulo="Mis voluntades y cuidados" />
        <section className="w-full flex flex-col gap-4">
          <div className="w-full rounded-2xl bg-gray-100 border border-gray-200 flex flex-col p-5 gap-5 pr-0">
            <div className="w-full flex gap-3 items-start justify-start">
              <IoMdHeart className="text-[#4A7FBF] p-2 bg-white border border-gray-200 rounded-xl size-12" />
              <div className="flex flex-col max-w-75/100 items-start justify-start">
                <h1 className="text-lg font-semibold">
                  Mis deseos en caso de emergencia
                </h1>
                <h2 className="text-[#4A7FBF]">
                  Medidas anticipadas de atención
                </h2>
              </div>
            </div>
            <p className="text-gray-500 pr-5">
              Aquí podés dejar indicaciones simples para que tu familia y el
              equipo médico sepan qué preferís en caso de emergencia. Podés
              modificarlas o actualizarlas cuando quieras.
            </p>
          </div>
          <CajaPreferencias
            titulo="¿Algo para evitar por si ocurre un caso de emergencia?"
            placeholder='Escriba aquí.
Ej: "En caso de que me internen, no quiero que me ingresen un tubo” '
          />
          <CajaPreferencias titulo="¿Quién querés que te acompañe?" />
          <CajaPreferencias titulo="¿Cómo preferís ser atendido?" />
        </section>
        <div className="flex w-full rounded-2xl bg-zinc-100 border border-gray-200 p-5 gap-4">
          <MdLock className="bg-white border border-gray-200 p-2.5 size-12 rounded-lg text-[#4A7FBF]" />
          <p className="max-w-75/100">
            Tu familia puede ver estas indicaciones desde su aplicación
            autorizada para respetarlas y comunicarlas ante cualquier atención
            médica.
          </p>
        </div>
        <h2 className="w-full rounded-2xl border-dashed border-3 text-lg p-5 border-gray-300 bg-white flex gap-3 items-center justify-center hover:bg-zinc-100 cursor-pointer active:bg-zinc-200">
          <LuCirclePlus className="text-[#4A7FBF] text-2xl"/>Agregar otra indicación o deseo
        </h2>
         <h2 className="w-full rounded-2xl text-lg p-5 bg-black text-white flex gap-3 items-center justify-center hover:bg-black/90 cursor-pointer active:bg-black/75">
          <MdCheck className="text-white text-2xl"/>Confirmar mis indicaciones
        </h2>
      </main>
    </>
  );
}
