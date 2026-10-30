import { Link } from "react-router-dom";
import VueltaAtras from "../../components/vueltaAtras";
import Header from "../../components/Header";
import { LuActivity, LuArrowRight, LuCalendarDays, LuMapPin, LuShieldCheck, LuTriangleAlert } from "react-icons/lu";

// HARDCODEADO: reemplazar con los vínculos del usuario (adultos mayores que tiene a cargo)
// el back todavía no tiene estado del turno (activo / programado / pasiva) ni la dirección
const adultos = [
  {
    id: "1",
    nombre: "José Perez",
    edad: 78,
    foto: "/jose-perez-contactos.jpeg",
    estado: "activo",
    direccion: "Av. Rivadavia 4820, Caballito, CABA",
    detalle: "Turno en curso · En domicilio",
    alerta: "Alergia a Penicilina",
  },
  {
    id: "2",
    nombre: "Elena Blanco",
    edad: 84,
    foto: "",
    estado: "programado",
    direccion: "Yerbal 2140, Flores",
    detalle: "Próximo turno: Mañana sábado 15:00 hs",
    alerta: "",
  },
  {
    id: "3",
    nombre: "Mario Lucero",
    edad: 81,
    foto: "",
    estado: "pasiva",
    direccion: "Rojas 340, Caballito",
    detalle: "Guardia pasiva de respaldo",
    alerta: "",
  },
];

// iniciales del nombre para cuando no hay foto (ej: "Elena Blanco" → "EB")
function iniciales(nombre: string) {
  const partes = nombre.split(" ");
  let resultado = "";
  for (const parte of partes) {
    resultado = resultado + parte[0];
  }
  return resultado.slice(0, 2).toUpperCase();
}

// ícono de la segunda línea según el estado del turno
function iconoDetalle(estado: string) {
  if (estado === "activo") return <LuActivity aria-hidden="true" className="size-4 shrink-0" />;
  if (estado === "programado") return <LuCalendarDays aria-hidden="true" className="size-4 shrink-0" />;
  return <LuShieldCheck aria-hidden="true" className="size-4 shrink-0" />;
}

// pantalla del cuidador/familiar: lista de adultos mayores que tiene a cargo
export default function AdultosACargo() {
  return (
    <>
      <main className="mainBody text-[#0E1D28]">
        <Header />
        <VueltaAtras titulo="Adultos mayores a cargo" compacto />

        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          {adultos.map((adulto) => (
            <article key={adulto.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {adulto.foto ? (
                    <img src={adulto.foto} alt="" className="size-12 shrink-0 rounded-full bg-[#D4E4F3] object-cover" />
                  ) : (
                    <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#EBF5FF] font-semibold text-[#424656]">
                      {iniciales(adulto.nombre)}
                    </span>
                  )}
                  <div>
                    <h2 className="text-lg font-bold">{adulto.nombre}</h2>
                    <p className="text-sm text-[#424656]">{adulto.edad} años</p>
                  </div>
                </div>

                {adulto.estado === "activo" ? (
                  <span className="flex items-center gap-1 rounded-full border border-[#006A61]/30 bg-[#84F6E6]/30 px-2 py-0.5 text-xs font-bold uppercase text-[#006A61]">
                    <span aria-hidden="true" className="size-2 rounded-full bg-[#006A61]" />
                    {adulto.estado}
                  </span>
                ) : (
                  <span className="rounded-full border border-[#B9C6D5] bg-[#EBF5FF] px-2 py-0.5 text-xs font-bold uppercase text-[#424656]">
                    {adulto.estado}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 text-sm">
                <p className="flex items-center gap-2">
                  <LuMapPin aria-hidden="true" className="size-4 shrink-0" />
                  {adulto.direccion}
                </p>
                <p className="flex items-center gap-2 text-[#424656]">
                  {iconoDetalle(adulto.estado)}
                  {adulto.detalle}
                </p>
              </div>

              {adulto.alerta && (
                <p className="flex items-center gap-2 rounded-lg border border-[#BA1A1A]/50 bg-[#FFDAD6] px-3 py-2 text-sm text-[#93000A]">
                  <LuTriangleAlert aria-hidden="true" className="size-4 shrink-0" />
                  <span>
                    <span className="font-bold">Atención:</span> {adulto.alerta}
                  </span>
                </p>
              )}

              {/* el de turno activo lleva el botón azul fuerte; los demás, el claro */}
              <Link
                to="../info/adulto"
                className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${
                  adulto.estado === "activo"
                    ? "bg-[#1550E0] text-white hover:bg-[#1245BF] active:bg-[#0F389D]"
                    : "bg-[#EBF5FF] text-[#0E1D28] hover:bg-[#DCEBFA] active:bg-[#CBDEF2]"
                }`}
              >
                Ver información específica
                <LuArrowRight aria-hidden="true" className="size-4 shrink-0" />
              </Link>
            </article>
          ))}

          <p className="text-center text-xs font-semibold text-[#424656]">
            ¿Querés agregar un adulto mayor? Él deberá enviarte un mail para vincular la conexión mediante NONOS.
          </p>
        </div>
      </main>
    </>
  );
}