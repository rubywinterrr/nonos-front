import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { FaRegAddressCard } from "react-icons/fa";
import { LuEye, LuTriangleAlert } from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";
import {
  MdOutlineBloodtype,
  MdOutlineMedication,
  MdLockClock,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { PiCalendarCheck } from "react-icons/pi";
import { RiBookMarkedLine } from "react-icons/ri";
import CajaMed from "../../components/cajaMedicacion";
import { useState, useEffect } from "react";
import { medicamentosService, type Medicamento } from "../../services/medicamentosService";
import { condicionesService, type Condicion } from "../../services/condicionesService";
import calcularEdad from "../../utils/calcularEdad";

export default function Salud() {
  const { usuario } = useAuth();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [condiciones, setCondiciones] = useState<Condicion[]>([]);
  const [errorCondiciones, setErrorCondiciones] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;

    // trae la medicación y busca la fecha del cambio más reciente entre todos los medicamentos
    const fetchMedicamentos = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await medicamentosService.getMedicamentos(usuario.id);
        setMedicamentos(data);

        // si falla solo esta parte, la lista igual se muestra; solo se esconde la fecha
        try {
          let masReciente: string | null = null;
          for (const medicamento of data) {
            const cambios = await medicamentosService.getCambiosMedicamento(medicamento.id);
            if (cambios.length === 0) continue;

            // el back los manda del más nuevo al más viejo, así que el primero es el último cambio
            const fecha = cambios[0].fechaCambio;
            if (!masReciente || new Date(fecha).getTime() > new Date(masReciente).getTime()) {
              masReciente = fecha;
            }
          }
          setUltimaActualizacion(masReciente);
        } catch (err) {
          console.error(err);
        }
      } catch (err) {
        console.error(err);
        setError("Hubo un error al cargar la medicación");
      } finally {
        setLoading(false);
      }
    };

      // trae las condiciones médicas activas del usuario (alergias, enfermedades, etc.)
    const fetchCondiciones = async () => {
      setErrorCondiciones(null);
      try {
        const data = await condicionesService.getCondiciones(usuario.id);
        setCondiciones(data);
      } catch (err) {
        console.error(err);
        setErrorCondiciones("No se pudieron cargar las condiciones médicas");
      }
    };

    fetchMedicamentos();
    fetchCondiciones();
  }, [usuario]);

  return (
    <>
      <main className="mainBody ">
        <Header />
        <VueltaAtras titulo="Mi información médica" />
        <div className="w-full p-5 rounded-2xl flex items-start justify-start bg-gray-100 gap-5">
          <LuEye className="size-13 bg-gray-200 p-3 rounded-full text-gray-500" />
          <div className="flex flex-col items-start justify-start gap-1 max-w-70/100">
            <h1 className="font-semibold text-lg">Vista de solo lectura</h1>
            <p className="text-gray-500">
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
                <h1 className="text-xl font-bold">
                {usuario?.fechaNacimiento
                    ? `${calcularEdad(usuario.fechaNacimiento)} años`
                    : "Sin dato de edad"}
                  </h1>{" "}
              </div>
            </div>
            <div className="rounded-2xl bg-gray-100 w-full p-5 flex justify-start items-start gap-5">
              <MdOutlineBloodtype className="text-red-600 p-3 bg-gray-200/50 rounded-lg text-6xl" />
              <div className="flex flex-col gap-1 items-start justify-start">
                {" "}
                <p className="text-gray-600">Grupo y factor</p>
                <h1 className="text-xl font-bold">
                  Grupo de sangre {/* EL BACK NO TIENE ENDPOINT: grupo y factor */}
                </h1>
              </div>
            </div>
            <div className="rounded-2xl bg-gray-100 w-full p-5 flex justify-start items-center gap-5">
              <RiBookMarkedLine className="text-gray-500 p-3 bg-gray-200/50 rounded-lg text-6xl" />
              <div className="flex flex-col gap-1 items-start justify-start">
                {" "}
                <p className="text-gray-600">Cobertura / Prepaga</p>
                <h1 className="text-xl font-bold">
                  Cobertura {/* EL BACK NO TIENE ENDPOINT: cobertura / prepaga */}
                </h1>
                <p className="text-gray-600">
                  N° 0000000000 {/* EL BACK NO TIENE ENDPOINT: número de afiliado */}
                </p>
              </div>
            </div>

            {/* solo aparece si el usuario tiene alguna condición medica cargada (extra: antes vi que tenia alergia, pero el back no devuelve eso) */}
            {condiciones.length > 0 && (
              <div className="bg-[#FFDAD6] rounded-2xl flex items-start justify-start p-5 w-full gap-3">
                <LuTriangleAlert className="text-4xl text-red-700" />
                <div className="flex flex-col items-start justify-start max-w-80/100">
                  <h2 className="text-lg text-red-800 font-bold">
                    ¡ATENCIÓN MÉDICA! CONDICIONES A TENER EN CUENTA
                  </h2>
                  {condiciones.map((condicion) => (
                    <div key={condicion.id} className="flex flex-col">
                      <h3 className="text-2xl text-red-700 font-bold">
                        {condicion.nombre}
                      </h3>
                      {condicion.descripcion && (
                        <p className="text-red-800">{condicion.descripcion}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errorCondiciones && (
              <p role="alert" className="text-red-700">{errorCondiciones}</p>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-5 items-start justify-start">
          <h1 className="font-semibold text-xl flex items-center justify-start gap-1">
            <MdOutlineMedication className="text-gray-600 text-3xl" />{" "}
            Medicación habitual actual
          </h1>
          <p className="flex items-center justify-start gap-1 text-gray-600">
            <PiCalendarCheck className="text-2xl" />
            {ultimaActualizacion
              ? `Actualizado el ${new Date(ultimaActualizacion).toLocaleDateString("es-AR")}`
              : "Sin fecha de actualización registrada"}
            {/* PONER INFO FECHA DE ACTUALIZACION Y NOMBRE DOCTOR */}
            {/* NOMBRE DOCTOR: EL BACK NO TIENE ENDPOINT (no guarda quién hizo el cambio) */}
          </p>
          {loading && <p className="text-gray-600">Cargando medicación...</p>}
          {error && <p role="alert" className="text-red-700">{error}</p>}
          {!loading && !error && medicamentos.length === 0 && (
            <p className="text-gray-600">No hay medicación habitual registrada.</p>
          )}
          {medicamentos.map((medicamento) => (
            <CajaMed
              key={medicamento.id}
              nombre={medicamento.nombre}
              dosis={medicamento.dosis}
              horarios={medicamento.horariosDelDia}
            />
          ))}
        </div>
        <div className="bg-gray-100 rounded-2xl flex items-start justify-start p-6 w-full gap-3 text-gray-500">
          <MdLockClock className="size-8" />
          <p className="max-w-80/100">
            Esta información es solo para consulta, no controla las tomas. Para
            modificarla, consultá con tu cuidador o familiar.
          </p>
        </div>
        <h1 className="flex p-3 gap-3 bg-gray-200 rounded-2xl w-full items-center justify-center cursor-pointer hover:bg-gray-300 active:bg-gray-400">
          <MdOutlineSupportAgent className="size-8" /> Contactar a mi cuidador
          para cambios
        </h1>
      </main>
    </>
  );
}
