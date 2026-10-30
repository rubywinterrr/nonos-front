import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VueltaAtras from "../../components/vueltaAtras";
import Header from "../../components/Header";
import { LuArrowRight, LuPhone } from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService, type AdultoMayorVinculado } from "../../services/usuariosService";
import { guardarAdultoSeleccionado, leerAdultoSeleccionado } from "../../utils/adultoQueSeMira";
import calcularEdad from "../../utils/calcularEdad";

// iniciales del nombre para cuando no hay foto (ej: "Elena Blanco" → "EB")
function iniciales(nombre: string) {
  const partes = nombre.trim().split(" ");
  let resultado = "";
  for (const parte of partes) {
    if (parte.length > 0) resultado = resultado + parte[0];
  }
  return resultado.slice(0, 2).toUpperCase();
}

// pantalla del cuidador/familiar: lista de adultos mayores que tiene a cargo.
// Al tocar uno, queda elegido y todas las pantallas pasan a mostrar sus datos
export default function AdultosACargo() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [adultos, setAdultos] = useState<AdultoMayorVinculado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    const id = usuario.id;

    // trae los adultos vinculados
    const cargar = async () => {
      try {
        setAdultos(await usuarioService.getAdultosMayoresVinculados(id));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los adultos a cargo.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario]);

  // el que se está mirando: el elegido, o el primero si nunca eligió
  const elegido = leerAdultoSeleccionado();
  let idMirado = elegido;
  if (!adultos.some((a) => a.id === elegido) && adultos.length > 0) idMirado = adultos[0].id;

  // elige al adulto y abre su información
  const verAdulto = (id: string) => {
    guardarAdultoSeleccionado(id);
    navigate("../info/adulto");
  };

  return (
    <>
      <main className="mainBody text-[#0E1D28]">
        <Header />
        <VueltaAtras titulo="Adultos mayores a cargo" compacto />

        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          {cargando && <p className="text-center text-[#424656]">Cargando…</p>}
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
          {!cargando && !error && adultos.length === 0 && (
            <p className="rounded-2xl bg-white p-5">
              Todavía no estás vinculado a ningún adulto mayor. Pedile que te invite desde NONOS con tu mail.
            </p>
          )}

          {adultos.map((adulto) => (
            <article key={adulto.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {adulto.fotoUrl ? (
                    <img src={adulto.fotoUrl} alt="" className="size-12 shrink-0 rounded-full bg-[#D4E4F3] object-cover" />
                  ) : (
                    <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#EBF5FF] font-semibold text-[#424656]">
                      {iniciales(adulto.nombreCompleto)}
                    </span>
                  )}
                  <div>
                    <h2 className="text-lg font-bold">{adulto.nombreCompleto}</h2>
                    {adulto.fechaNacimiento && <p className="text-sm text-[#424656]">{calcularEdad(adulto.fechaNacimiento)} años</p>}
                  </div>
                </div>
                {adulto.id === idMirado && (
                  <span className="flex items-center gap-1 rounded-full border border-[#006A61]/30 bg-[#84F6E6]/30 px-2 py-0.5 text-xs font-bold uppercase text-[#006A61]">
                    <span aria-hidden="true" className="size-2 rounded-full bg-[#006A61]" />
                    Viendo ahora
                  </span>
                )}
              </div>

              {adulto.telefono && (
                <a href={`tel:${adulto.telefono}`} className="flex items-center gap-2 text-sm hover:underline">
                  <LuPhone aria-hidden="true" className="size-4 shrink-0" />
                  {adulto.telefono}
                </a>
              )}

              {/* el que se está mirando lleva el botón azul fuerte; los demás, el claro */}
              <button
                type="button"
                onClick={() => verAdulto(adulto.id)}
                className={`flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${adulto.id === idMirado
                    ? "bg-[#1550E0] text-white hover:bg-[#1245BF] active:bg-[#0F389D]"
                    : "bg-[#EBF5FF] text-[#0E1D28] hover:bg-[#DCEBFA] active:bg-[#CBDEF2]"
                  }`}
              >
                Ver información específica
                <LuArrowRight aria-hidden="true" className="size-4 shrink-0" />
              </button>
            </article>
          ))}

          <p className="text-center text-xs font-semibold text-[#424656]">
            ¿Querés agregar un adulto mayor? Él deberá enviarte una invitación desde NONOS a tu mail.
          </p>
        </div>
      </main>
    </>
  );
}