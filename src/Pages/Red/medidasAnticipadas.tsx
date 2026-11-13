import { useEffect, useState } from "react";
import VueltaAtras from "../../components/vueltaAtras";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService } from "../../services/usuariosService";
import { LuInfo, LuUsersRound } from "react-icons/lu";

const TEXTO_EVITAR = "Para evitar en una emergencia:";
const TEXTO_ACOMPANANTE = "\n\nQuién quiero que me acompañe:";
const TEXTO_ATENCION = "\n\nCómo prefiero ser atendido:";

function separarMedidas(texto: string) {
  const inicioAcompanante = texto.indexOf(TEXTO_ACOMPANANTE);
  const inicioAtencion = texto.indexOf(TEXTO_ATENCION);
  if (!texto.startsWith(TEXTO_EVITAR) || inicioAcompanante === -1 || inicioAtencion === -1) {
    return { evitar: texto.trim(), acompanante: "", atencion: "" };
  }
  return {
    evitar: texto.slice(TEXTO_EVITAR.length, inicioAcompanante).trim(),
    acompanante: texto.slice(inicioAcompanante + TEXTO_ACOMPANANTE.length, inicioAtencion).trim(),
    atencion: texto.slice(inicioAtencion + TEXTO_ATENCION.length).trim(),
  };
}

export default function MedidasAnticipadas() {
  const { usuario } = useAuth();
  const [indicaciones, setIndicaciones] = useState({ evitar: "", acompanante: "", atencion: "" });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario?.id) return;
    let cancelado = false;
    const cargarIndicaciones = async () => {
      setCargando(true);
      setError(null);
      try {
        const adultos = await usuarioService.getAdultosMayoresVinculados(usuario.id);
        const adulto = adultos[0];
        if (!adulto) {
          if (!cancelado) setError("No se encontró un adulto mayor vinculado a esta cuenta.");
          return;
        }
        const datos = await usuarioService.getUsuarioById(adulto.id);
        if (!cancelado) setIndicaciones(separarMedidas(datos.medidasAnticipadas ?? ""));
      } catch (err) {
        console.error(err);
        if (!cancelado) setError("No se pudieron cargar las medidas anticipadas.");
      } finally {
        if (!cancelado) setCargando(false);
      }
    };
    void cargarIndicaciones();
    return () => { cancelado = true; };
  }, [usuario?.id]);

  return (
    <main id="contenido-principal" tabIndex={-1} className="mainBody gap-4">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Medidas anticipadas" />
        <section aria-label="Información sobre medidas anticipadas" className="flex w-full items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
          <LuInfo aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#4A7FBF]" />
          <p className="text-sm leading-6 text-gray-600">Estas medidas fueron registradas por el adulto y se muestran solo para consulta.</p>
        </section>
        {cargando && <p role="status" className="rounded-xl bg-white p-4 text-sm text-gray-600">Cargando las medidas anticipadas...</p>}
        <section aria-label="Medidas anticipadas registradas" className="flex w-full flex-col gap-4">
          <Tarjeta titulo="¿Algo para evitar por si ocurre un caso de emergencia?" valor={indicaciones.evitar} />
          <Tarjeta titulo="¿Quién querés que te acompañe?" valor={indicaciones.acompanante} />
          <Tarjeta titulo="¿Cómo preferís ser atendido?" valor={indicaciones.atencion} />
        </section>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </div>
    </main>
  );
}

function Tarjeta({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <article className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-3">
        <LuUsersRound aria-hidden="true" className="size-10 shrink-0 rounded-xl border border-gray-200 bg-gray-100 p-2 text-[#4A7FBF]" />
        <h2 className="text-lg font-semibold">{titulo}</h2>
      </div>
      <blockquote className="min-h-16 w-full whitespace-pre-wrap rounded-r-lg border-l-4 border-[#1550E0] bg-gray-100 p-4 text-base italic leading-6 text-[#16222C]">
        {valor ? `“${valor}”` : "El adulto todavía no registró una indicación."}
      </blockquote>
    </article>
  );
}
