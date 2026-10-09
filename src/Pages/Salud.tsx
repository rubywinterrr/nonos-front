import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { FaRegAddressCard } from "react-icons/fa";
import { LuEye, LuTriangleAlert } from "react-icons/lu";
import { useAuth } from "../hooks/useAuth";
import { MdOutlineBloodtype, MdOutlineMedication } from "react-icons/md";
import { PiCalendarCheck } from "react-icons/pi";
import { RiBookMarkedLine } from "react-icons/ri";
import CajaMed from "../components/cajaMedicacion";

export default function Salud() {
  const { usuario } = useAuth();
  return (
    <>
      <main className="mainBody">
        <Header />
        <VueltaAtras titulo="Mi información médica" />
        <div className="w-full p-5 rounded-2xl flex items-start justify-start bg-gray-100 gap-5">
          <LuEye className="text-6xl bg-gray-200 p-3 rounded-full text-gray-500" />
          <div className="flex flex-col items-start justify-start gap-1 max-w-80/100">
            <h1 className="font-semibold text-xl">Vista de solo lectura</h1>
            <p className="text-gray-500 text-lg">
              Podés mostrar esta pantalla al médico o farmacéutico.
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <span className="flex justify-between items-center">
            <h1 className="font-semibold flex items-center justify-start gap-5 text-2xl">
              <FaRegAddressCard className="text-gray-500" />
              Datos personales
            </h1>
            <h2 className="bg-gray-100 text-gray-600 rounded-full p-2 font-semibold pr-3 pl-3">
              Titular
            </h2>
          </span>
          <div className="w-full bg-white rounded-2xl flex flex-col gap-5 p-5">
            <div className="rounded-2xl bg-gray-100 w-full p-5 flex justify-between items-start">
              <div className="flex flex-col gap-1 items-start justify-start">
                <p className="text-gray-600">Nombre completo</p>
                <h1 className="text-xl font-bold">
                  {usuario?.nombreCompleto || "Usuario"}
                </h1>
              </div>
              <div className="flex flex-col gap-1 items-end justify-end">
                <p className="text-gray-600">Edad</p>
                <h1 className="text-xl font-bold">(num años)</h1>{" "}
                {/* PONER INFO EDAD */}
              </div>
            </div>
            <div className="rounded-2xl bg-gray-100 w-full p-5 flex justify-start items-start gap-5">
              <MdOutlineBloodtype className="text-red-600 p-3 bg-gray-200/50 rounded-lg text-6xl" />
              <div className="flex flex-col gap-1 items-start justify-start">
                {" "}
                <p className="text-gray-600">Grupo y factor</p>
                <h1 className="text-xl font-bold">
                  Grupo de sangre {/* PONER INFO GRUPO DE SANGRE */}
                </h1>
              </div>
            </div>
            <div className="rounded-2xl bg-gray-100 w-full p-5 flex justify-start items-center gap-5">
              <RiBookMarkedLine className="text-gray-500 p-3 bg-gray-200/50 rounded-lg text-6xl" />
              <div className="flex flex-col gap-1 items-start justify-start">
                {" "}
                <p className="text-gray-600">Cobertura / Prepaga</p>
                <h1 className="text-xl font-bold">
                  Cobertura {/* PONER INFO COBERTURA */}
                </h1>
                <p className="text-gray-600">
                  N° 0000000000 {/* PONER INFO COBERTURA */}
                </p>
              </div>
            </div>

            {/* SOLO APARECE SI TIENE UNA ALERGIA O ATENCION MEDICA */}
            <div className="bg-[#FFDAD6] rounded-2xl flex items-start justify-start p-5 w-full gap-3">
              {" "}
              <LuTriangleAlert className="text-4xl text-red-700" />
              <div className="flex flex-col items-start justify-start max-w-80/100">
                <h2 className="text-lg text-red-800 font-bold">
                  ¡ATENCIÓN MÉDICA! ALERGIA CONFIRMADA
                </h2>
                <h1 className="text-2xl text-red-700 font-bold">
                  Alergia a la Penicilina
                </h1>
                <p className="text-red-800">
                  No administrar penicilinas ni derivados betalactámicos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5 items-start justify-start">
          <h1 className="font-semibold text-xl flex items-center justify-start gap-1">
            <MdOutlineMedication className="text-gray-600 text-3xl" />{" "}
            Medicación habitual actual
          </h1>
          <p className="flex items-center justify-start gap-1 text-gray-600">
            <PiCalendarCheck className=" text-2xl" /> Actualizado el ([fecha]
            por [doctor]){" "}
            {/* PONER INFO FECHA DE ACTUALIZACION Y NOMBRE DOCTOR */}
          </p>
        <CajaMed />
        <CajaMed />
        <CajaMed />
        </div>
      </main>
    </>
  );
}
