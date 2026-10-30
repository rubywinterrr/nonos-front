import { MdOutlinePhone } from "react-icons/md";
import {
  LuCalendarDays,
  LuClock3,
  LuMessageSquareText,
  LuPhone,
  LuStethoscope,
} from "react-icons/lu";

interface TarjetaContactosProps {
  nombre: string;
  fotoContacto?: string;
  telefono: string;
  variante?: "familia";
  vinculo?: string;
  prioridad?: string;
  horario?: string;
  esMedico?: boolean;
}

function obtenerNombre(nombreCompleto: string): string {
  const partes = nombreCompleto.trim().split(/\s+/);
  const nombres = /^(dr|dra)\.?$/i.test(partes[0]) ? partes.slice(1) : partes;
  return nombres[0] || "";
}

function obtenerIniciales(nombreCompleto: string): string {
  const partes = nombreCompleto.trim().split(/\s+/);
  const nombres = /^(dr|dra)\.?$/i.test(partes[0]) ? partes.slice(1) : partes;
  const primeraInicial = nombres[0]?.charAt(0) || "";
  const ultimaInicial =
    nombres.length > 1 ? nombres[nombres.length - 1].charAt(0) : "";
  return `${primeraInicial}${ultimaInicial}`.toLocaleUpperCase("es-AR");
}

export default function TarjetaContactos({
  nombre,
  fotoContacto,
  telefono,
  variante,
  vinculo,
  prioridad,
  horario,
  esMedico = false,
}: TarjetaContactosProps) {
  if (variante === "familia") {
    return (
      <article className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-xs">
        <div className="flex min-w-0 items-start gap-2">
          {esMedico ? (
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E9EEF2]"
            >
              <LuStethoscope className="size-5 text-[#16222C]" />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E7EDFB] text-base font-semibold text-[#16222C]"
            >
              {obtenerIniciales(nombre)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-x-2">
              <h3 className="min-w-0 text-lg font-semibold leading-6">
                {nombre}
              </h3>
              {prioridad && (
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-sm font-semibold leading-5 ${prioridad === "Principal" ? "bg-[#BAEDD3] text-[#16222C]" : "bg-[#E7EDFB] text-[#435059]"}`}
                >
                  {prioridad}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold leading-5 text-[#435059]">
              {vinculo}
            </p>
            <p className="mt-1 text-base leading-6">{telefono}</p>
          </div>
        </div>
        {horario && (
          <p className="flex items-center gap-2 rounded-lg bg-[#E7EDFB] p-2 text-sm font-semibold leading-5 text-[#435059]">
            {esMedico ? (
              <LuCalendarDays aria-hidden="true" className="size-4 shrink-0" />
            ) : (
              <LuClock3 aria-hidden="true" className="size-4 shrink-0" />
            )}
            {horario}
          </p>
        )}
        {esMedico ? (
          <a
            href={`tel:${telefono}`}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-[#E7EDFB] px-3 text-base font-semibold text-[#0D328B] hover:bg-[#D3E0F8] active:border-[#1550E0] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
          >
            <LuPhone aria-hidden="true" className="size-4 shrink-0" />
            Llamar consultorio
          </a>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${telefono}`}
              aria-label={`Llamar a ${nombre}`}
              className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#B7C8F0] bg-[#1550E0] px-2 text-base font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            >
              <LuPhone aria-hidden="true" className="size-4 shrink-0" />
              Llamar
            </a>
            <a
              href={`sms:${telefono}`}
              aria-label={`Mensaje a ${nombre}`}
              className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-[#E7EDFB] px-2 text-base font-semibold text-[#0D328B] hover:bg-[#D3E0F8] active:border-[#1550E0] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            >
              <LuMessageSquareText
                aria-hidden="true"
                className="size-5 shrink-0 text-[#1550E0]"
              />
              Mensaje
            </a>
          </div>
        )}
      </article>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl flex flex-col gap-3 w-full h-40 items-center justify-center lg:w-32/100">
        <div className="w-full h-45/100 flex items-center p-1 gap-3 pl-6">
          <img
            className="border rounded-full aspect-square h-95/100 text-xs object-cover"
            src={fotoContacto}
            alt="Foto de contacto"
          />
          <div className="flex flex-col justify-baseline">
            <h1 className="font-bold text-2xl">{nombre}</h1>
            <p className="text-gray-500 text-md">Ubicación</p>
          </div>
        </div>
        <a
          href={`tel:${telefono}`}
          className="font-semibold text-xl w-90/100 h-30/100 rounded-xl bg-gray-300 flex items-center justify-center hover:bg-black hover:text-white active:scale-97 hover:scale-102 active:bg-gray-400 cursor-pointer gap-5"
        >
          {" "}
          <MdOutlinePhone className="text-2xl" />
          Llamar a {obtenerNombre(nombre)}
        </a>
      </div>
    </>
  );
}
