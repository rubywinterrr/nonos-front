import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import {
  LuActivity,
  LuArrowLeft,
  LuCheck,
  LuCircleCheck,
  LuCircleX,
  LuDroplet,
  LuEye,
  LuHeart,
  LuHeartPulse,
  LuPill,
  LuPlus,
  LuShieldCheck,
  LuTriangleAlert,
  LuAccessibility,
} from "react-icons/lu";

function CondicionMedica({
  icono,
  children,
}: {
  icono: ReactNode;
  children: ReactNode;
}) {
  const [seleccionada, setSeleccionada] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={seleccionada}
      onClick={() => setSeleccionada((actual) => !actual)}
      className={`flex min-h-15 w-full cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 text-left text-[#16222C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#144BD3] ${
        seleccionada
          ? "border-[#144BD3] bg-[#C9D9F7] shadow-inner hover:bg-[#BCD0F3] active:bg-[#ADC4ED]"
          : "border-transparent bg-[#E7EDFB] hover:bg-[#D7E3FA] active:bg-[#C6D5F3]"
      }`}
    >
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center text-[#144BD3]"
      >
        {icono}
      </span>
      <span className="min-w-0 flex-1 text-base font-bold leading-6">
        {children}
      </span>
      {seleccionada && (
        <LuCheck
          aria-hidden="true"
          className="size-5 shrink-0 text-[#144BD3]"
        />
      )}
    </button>
  );
}

export default function ConfigCuenta2() {
  const [mostrarCampo, setMostrarCampo] = useState(false);
  const [nuevaCondicion, setNuevaCondicion] = useState("");
  const [condicionesAgregadas, setCondicionesAgregadas] = useState<string[]>(
    [],
  );
  const [respuestaAlergias, setRespuestaAlergias] = useState<
    "si" | "no" | null
  >(null);
  const [respuestaMedicacion, setRespuestaMedicacion] = useState<
    "si" | "no" | null
  >(null);
  const [medicacionesAdicionales, setMedicacionesAdicionales] = useState<
    number[]
  >([]);

  function agregarCondicion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const nombre = nuevaCondicion.trim();
    if (!nombre) return;
    setCondicionesAgregadas((actuales) => [...actuales, nombre]);
    setNuevaCondicion("");
    setMostrarCampo(false);
  }

  return (
    <main className="mainBody" >
      <header className="fixed inset-x-0 top-0 z-50 flex h-17 items-center border-b border-[#D7DFE6] bg-[#B7C8F0] px-4">
        <div className="mx-auto flex w-full max-w-lg items-center gap-2">
          <MdOutlineHealthAndSafety
            aria-hidden="true"
            className="size-7 text-[#00A5B5]"
          />
          <span className="text-xl font-bold">NONOS</span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
        <section
          aria-label="Progreso de registro"
          className="flex w-full flex-col gap-3 rounded-3xl bg-white p-5 shadow-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <strong className="flex items-center gap-1.5 text-lg font-semibold text-[#144BD3]">
              <LuCircleCheck aria-hidden="true" className="size-5 shrink-0" />
              Paso 2 de 2
            </strong>
            <span className="text-sm text-[#435059]">Salud y cuidados</span>
          </div>
          <progress
            value="100"
            max="100"
            aria-label="Progreso de registro"
            className="h-3 w-full overflow-hidden rounded-full accent-[#144BD3] [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-[#E7EDFB] [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-[#144BD3] [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-[#144BD3]"
          />
        </section>

        <section
          aria-labelledby="bienvenida-paso-dos"
          className="flex w-full items-start gap-4 rounded-3xl bg-white p-5 shadow-xs"
        >
          <LuHeartPulse
            aria-hidden="true"
            className="size-12 shrink-0 rounded-2xl bg-[#E8FAF1] p-3 text-[#007B46]"
          />
          <div className="min-w-0">
            <h1
              id="bienvenida-paso-dos"
              className="text-xl font-semibold leading-7"
            >
              ¡Ya casi terminamos!
            </h1>
            <p className="mt-1 text-base leading-6 text-[#435059]">
              Con esta información, los médicos actuarán de manera segura ante
              cualquier emergencia.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="alergias-conocidas"
          className="flex w-full flex-col gap-4 rounded-3xl bg-white p-5 shadow-xs"
        >
          <button
            id="alergias-conocidas"
            className="flex items-center gap-2.5 text-xl font-semibold leading-7"
          >
            <LuTriangleAlert
              aria-hidden="true"
              className="size-9 shrink-0 rounded-xl bg-[#F9E9E9] p-2 text-[#B3261E]"
            />
            Alergias conocidas
          </button>
          <p className="text-base leading-6">
            ¿Tenés alergia a algún medicamento o alimento?{" "}
            <span aria-hidden="true" className="text-red-600">
              *
            </span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={respuestaAlergias === "si"}
              onClick={() => setRespuestaAlergias("si")}
              className={`flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-2 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#144BD3] ${respuestaAlergias === "si" ? "border-[#144BD3] bg-[#C9D9F7] shadow-inner hover:bg-[#BCD0F3] active:bg-[#ADC4ED]" : "border-transparent bg-[#E7EDFB] hover:bg-[#D7E3FA] active:bg-[#C6D5F3]"}`}
            >
              <LuCircleCheck aria-hidden="true" className="size-5 shrink-0" />
              Sí, tengo
            </button>
            <button
              type="button"
              aria-pressed={respuestaAlergias === "no"}
              onClick={() => setRespuestaAlergias("no")}
              className={`flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-2 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#144BD3] ${respuestaAlergias === "no" ? "border-[#144BD3] bg-[#C9D9F7] shadow-inner hover:bg-[#BCD0F3] active:bg-[#ADC4ED]" : "border-transparent bg-[#E7EDFB] hover:bg-[#D7E3FA] active:bg-[#C6D5F3]"}`}
            >
              <LuCircleX aria-hidden="true" className="size-5 shrink-0" />
              No tengo
            </button>
          </div>
          {respuestaAlergias === "si" && (
            <div className="flex flex-col gap-2 pt-1">
              <label
                htmlFor="alergias"
                className="text-sm font-semibold leading-5 text-[#435059]"
              >
                Escribí tus alergias para que figuren destacadas:{" "}
                <span aria-hidden="true" className="text-red-600">
                  *
                </span>
              </label>
              <textarea
                id="alergias"
                required
                rows={3}
                placeholder="Ej: Alergia a la penicilina, aspirinas, mariscos, frutos secos..."
                className="min-h-24 w-full resize-y rounded-2xl bg-[#E7EDFB] p-4 text-base leading-6 text-[#16222C] inset-shadow-sm placeholder:text-[#435059] focus-visible:outline-2 focus-visible:outline-[#144BD3]"
              />
            </div>
          )}
        </section>

        <section
          aria-labelledby="condiciones-medicas"
          className="flex w-full flex-col gap-4 rounded-3xl bg-white p-5 shadow-xs"
        >
          <button
            id="condiciones-medicas"
            className="flex items-center gap-2.5 text-xl font-semibold leading-7"
          >
            <LuHeartPulse
              aria-hidden="true"
              className="size-9 shrink-0 rounded-xl bg-[#E7EDFB] p-2 text-[#144BD3]"
            />
            Condiciones médicas
          </button>
          <p className="text-base leading-6">
            Selecciona si tenés alguna de estas condiciones:
          </p>
          <div className="flex w-full flex-col gap-2.5 pb-2">
            <CondicionMedica icono={<LuActivity className="size-6" />}>
              Presión alta / Hipertensión
            </CondicionMedica>
            <CondicionMedica icono={<LuDroplet className="size-6" />}>
              Diabetes
            </CondicionMedica>
            <CondicionMedica icono={<LuHeart className="size-6" />}>
              Problemas cardíacos
            </CondicionMedica>
            <CondicionMedica icono={<LuAccessibility className="size-6" />}>
              Dificultad al caminar / Bastón
            </CondicionMedica>
            <CondicionMedica icono={<LuEye className="size-6" />}>
              Problemas de memoria o visión
            </CondicionMedica>
            {condicionesAgregadas.map((condicion, indice) => (
              <CondicionMedica
                key={indice}
                icono={<LuPlus className="size-6" />}
              >
                {condicion}
              </CondicionMedica>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setMostrarCampo(true)}
            className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#E7EDFB] px-3 text-base font-semibold text-[#0D328B] hover:bg-[#D7E3FA] active:bg-[#C6D5F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#144BD3]"
          >
            <LuPlus aria-hidden="true" className="size-5 shrink-0" />
            Agregar condición médica
          </button>
          {mostrarCampo && (
            <form onSubmit={agregarCondicion} className="flex flex-col gap-2">
              <label
                htmlFor="nueva-condicion"
                className="text-sm font-semibold text-[#435059]"
              >
                Nueva condición médica{" "}
                <span aria-hidden="true" className="text-red-600">
                  *
                </span>
              </label>
              <input
                id="nueva-condicion"
                required
                autoFocus
                value={nuevaCondicion}
                onChange={(evento) => setNuevaCondicion(evento.target.value)}
                placeholder="Escribí una condición médica"
                className="min-h-14 w-full rounded-2xl bg-[#E7EDFB] px-4 text-base text-[#16222C] placeholder:text-[#435059] focus-visible:outline-2 focus-visible:outline-[#144BD3]"
              />
              <button
                type="submit"
                className="min-h-12 cursor-pointer rounded-xl bg-[#144BD3] px-4 font-semibold text-white hover:bg-[#0D3EBA] active:bg-[#0A328F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D328B]"
              >
                Agregar
              </button>
            </form>
          )}
        </section>

        <section
          aria-labelledby="medicacion-diaria"
          className="flex w-full flex-col gap-4 rounded-3xl bg-white p-5 shadow-xs"
        >
          <h2
            id="medicacion-diaria"
            className="flex items-center gap-2.5 text-xl font-semibold leading-7"
          >
            <LuPill
              aria-hidden="true"
              className="size-9 shrink-0 rounded-xl bg-[#E8FAF1] p-2 text-[#007B46]"
            />
            Medicación diaria
          </h2>
          <p className="text-base leading-6">
            ¿Tomás alguna medicación o pastilla todos los días?{" "}
            <span aria-hidden="true" className="text-red-600">
              *
            </span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={respuestaMedicacion === "si"}
              onClick={() => setRespuestaMedicacion("si")}
              className={`flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-2 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#144BD3] ${respuestaMedicacion === "si" ? "border-[#144BD3] bg-[#C9D9F7] shadow-inner hover:bg-[#BCD0F3] active:bg-[#ADC4ED]" : "border-transparent bg-[#E7EDFB] hover:bg-[#D7E3FA] active:bg-[#C6D5F3]"}`}
            >
              <LuCircleCheck aria-hidden="true" className="size-5 shrink-0" />
              Sí, tengo
            </button>
            <button
              type="button"
              aria-pressed={respuestaMedicacion === "no"}
              onClick={() => setRespuestaMedicacion("no")}
              className={`flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-2 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#144BD3] ${respuestaMedicacion === "no" ? "border-[#144BD3] bg-[#C9D9F7] shadow-inner hover:bg-[#BCD0F3] active:bg-[#ADC4ED]" : "border-transparent bg-[#E7EDFB] hover:bg-[#D7E3FA] active:bg-[#C6D5F3]"}`}
            >
              <LuCircleX aria-hidden="true" className="size-5 shrink-0" />
              No tengo
            </button>
          </div>
          {respuestaMedicacion === "si" && (
            <div className="flex w-full flex-col gap-4">
              <label
                htmlFor="medicamentos"
                className="text-sm font-semibold leading-5 text-[#435059]"
              >
                Escribí los medicamentos y los mg para que figuren destacadas:{" "}
                <span aria-hidden="true" className="text-red-600">
                  *
                </span>
              </label>
              <input
                id="medicamentos"
                required
                type="text"
                placeholder="Ej: Lozartón 500mg"
                className="min-h-15 w-full rounded-2xl bg-[#E7EDFB] px-4 text-base text-[#16222C] inset-shadow-sm placeholder:text-[#435059] focus-visible:outline-2 focus-visible:outline-[#144BD3]"
              />
              {medicacionesAdicionales.map((numero) => (
                <input
                  key={numero}
                  required
                  type="text"
                  aria-label={`Medicación adicional ${numero} (obligatoria)`}
                  placeholder="Ej: Lozartón 500mg"
                  className="min-h-15 w-full rounded-2xl bg-[#E7EDFB] px-4 text-base text-[#16222C] inset-shadow-sm placeholder:text-[#435059] focus-visible:outline-2 focus-visible:outline-[#144BD3]"
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setMedicacionesAdicionales((actuales) => [
                    ...actuales,
                    actuales.length + 1,
                  ])
                }
                className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#E7EDFB] px-3 text-base font-semibold text-[#0D328B] hover:bg-[#D7E3FA] active:bg-[#C6D5F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#144BD3]"
              >
                <LuPlus aria-hidden="true" className="size-5 shrink-0" />
                Agregar otra medicación
              </button>
            </div>
          )}
        </section>

        <aside className="flex w-full items-center gap-3 rounded-2xl bg-[#E7EDFB] p-4">
          <LuShieldCheck
            aria-hidden="true"
            className="size-6 shrink-0 text-[#144BD3]"
          />
          <p className="text-sm font-semibold leading-5 text-[#435059]">
            ¡Listo! Podrás consultar esta información cuando quieras desde tu
            perfil.
          </p>
        </aside>

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-[#B7C8F0] bg-[#144BD3] px-3 text-lg font-bold text-white shadow-md hover:bg-[#0D3EBA] active:bg-[#0A328F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D328B]"
          >
            Guardar mi ficha médica
            <LuCheck aria-hidden="true" className="size-5 shrink-0" />
          </button>
          <Link
            to="/adulto/configurar-cuenta"
            className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#E7EDFB] px-3 text-lg font-semibold text-[#16222C] hover:bg-[#D7E3FA] active:bg-[#C6D5F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#144BD3]"
          >
            <LuArrowLeft aria-hidden="true" className="size-5 shrink-0" />
            Volver al paso anterior
          </Link>
        </div>
      </div>
    </main>
  );
}
