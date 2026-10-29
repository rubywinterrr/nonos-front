import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import CondicionMedica from "../../components/CondicionMedica";
import ContactoVinculado from "../../components/ContactoVinculado";
import {
  LuActivity,
  LuBrain,
  LuFootprints,
  LuShieldAlert,
  LuUsersRound,
} from "react-icons/lu";

export default function InfoAdulto() {
  return (
    <main className="mainBody gap-4">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Información del adulto" compacto />

        <section
          aria-label="Información personal de José Pérez"
          className="rounded-2xl bg-white p-5 shadow-xs"
        >
          <div className="flex items-center gap-4">
            <img
              src="/jose-perez-info-adulto.png"
              alt="José Pérez"
              className="size-16 shrink-0 rounded-full border-2 border-[#B7C8F0] object-cover"
            />
            <div>
              <h2 className="text-xl font-bold leading-7">José Pérez</h2>
              <p className="text-base font-semibold leading-6 text-[#435059]">
                Papá · 78 años
              </p>
            </div>
          </div>
          <dl className="mt-5 overflow-hidden rounded-xl border border-[#B7C8F0] bg-[#E7EDFB]">
            <div className="border-b border-[#B7C8F0] p-3">
              <dt className="text-xs leading-4 text-[#435059]">
                Documento (DNI)
              </dt>
              <dd className="text-sm font-semibold leading-5">7.842.119</dd>
            </div>
            <div className="border-b border-[#B7C8F0] p-3">
              <dt className="text-xs leading-4 text-[#435059]">Nacimiento</dt>
              <dd className="text-sm font-semibold leading-5">12/05/1946</dd>
            </div>
            <div className="border-b border-[#B7C8F0] p-3">
              <dt className="text-xs leading-4 text-[#435059]">
                Grupo y Factor
              </dt>
              <dd className="text-sm font-semibold leading-5">
                0 Positivo (0+)
              </dd>
            </div>
            <div className="border-b border-[#B7C8F0] p-3">
              <dt className="text-xs leading-4 text-[#435059]">
                Domicilio particular
              </dt>
              <dd className="text-sm font-semibold leading-5">
                Av. Rivadavia 4820, Caballito, CABA
              </dd>
            </div>
            <div className="p-3">
              <dt className="text-xs leading-4 text-[#435059]">
                Cobertura médica
              </dt>
              <dd className="text-sm font-semibold leading-5">
                PAMI (N° 1502938492)
              </dd>
              <dd className="text-xs leading-4 text-[#435059]">
                Plan Médico de Cabecera asignado
              </dd>
            </div>
          </dl>
        </section>

        <aside
          aria-label="Alerta médica crítica"
          className="rounded-lg border-2 border-[#D73B3E] bg-[#FFE9E7] p-3"
        >
          <div className="flex items-center gap-2 text-[#A92323]">
            <LuShieldAlert aria-hidden="true" className="size-5 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase leading-4">
                Registro crítico
              </p>
              <h2 className="text-sm font-bold leading-5">
                ¡ALERGIA CONFIRMADA!
              </h2>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-[#F1C8C5] bg-white p-3 text-xs leading-4 text-[#A92323]">
            <p className="font-semibold">
              Alergia severa a la Penicilina y derivados betalactámicos.
            </p>
            <p className="mt-2">
              No administrar sin autorización explícita de su médico de
              cabecera.
            </p>
          </div>
        </aside>

        <section
          aria-labelledby="condiciones-medicas"
          className="rounded-2xl bg-white p-4 shadow-xs"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id="condiciones-medicas"
              className="flex items-center gap-2 text-lg font-semibold leading-6"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#E7EDFB] text-[#1550E0]">
                <LuActivity aria-hidden="true" className="size-4" />
              </span>
              Condiciones Médicas
            </h2>
            <span className="rounded-full border border-[#D7DFE6] bg-white px-2 py-0.5 text-xs font-semibold">
              3 activas
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <CondicionMedica
              icono={<LuActivity aria-hidden="true" className="size-4" />}
              titulo="Hipertensión arterial"
              estado="Bajo control"
              descripcion="Diagnosticada y bajo tratamiento farmacológico diario."
            />
            <CondicionMedica
              icono={<LuFootprints aria-hidden="true" className="size-4" />}
              titulo="Movilidad reducida leve"
              estado="Asistencia"
              descripcion="Usa bastón canadiense para traslados y paseos fuera del hogar."
              colorIcono="verde"
            />
            <CondicionMedica
              icono={<LuBrain aria-hidden="true" className="size-4" />}
              titulo="Estado cognitivo estable"
              estado="Preservado"
              descripcion="No presenta deterioro cognitivo severo ni desorientación temporal."
              colorIcono="violeta"
            />
          </div>
        </section>

        <section
          aria-labelledby="personas-vinculadas"
          className="rounded-2xl bg-white p-4 shadow-xs"
        >
          <h2
            id="personas-vinculadas"
            className="flex items-center gap-2 text-lg font-semibold leading-6"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#E7EDFB] text-[#1550E0]">
              <LuUsersRound aria-hidden="true" className="size-4" />
            </span>
            Red de Personas Vinculadas
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            <ContactoVinculado
              nombre="Sofía Gómez"
              relacion="Hija · Contacto prioritario"
            />
            <ContactoVinculado
              nombre="María Rodríguez"
              relacion="Cuidadora · Lun a Vie 8:00 a 14:00"
            />
            <ContactoVinculado
              nombre="Dr. Esteban Martínez"
              relacion="Médico cabecera · Consultorio"
              detalle="San Cayetano"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
