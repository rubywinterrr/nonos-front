import { FondoBlanco } from "../../components/funcionFondoBlanco";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { IoMdHeart } from "react-icons/io";
import CajaPreferencias from "../../components/CajaPreferencias";
import { MdLock, MdCheck } from "react-icons/md";
import { LuCirclePlus } from "react-icons/lu";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService } from "../../services/usuariosService";

// PROVISORIO: el back guarda las medidas anticipadas en UN solo texto, así que las 3 casillas
// se juntan en un texto con títulos. Cuando el back tenga 3 campos separados, sacar esto.
const TITULO_EVITAR = "Para evitar en una emergencia:";
const TITULO_ACOMPANANTE = "\n\nQuién quiero que me acompañe:";
const TITULO_ATENCION = "\n\nCómo prefiero ser atendido:";

// junta las 3 respuestas en un solo texto con títulos, que se lee bien también en el QR
function armarTexto(evitar: string, acompanante: string, atencion: string) {
  return `${TITULO_EVITAR} ${evitar}${TITULO_ACOMPANANTE} ${acompanante}${TITULO_ATENCION} ${atencion}`;
}

// separa el texto guardado en las 3 respuestas, buscando dónde empieza cada título
function separarTexto(texto: string) {
  const inicioAcompanante = texto.indexOf(TITULO_ACOMPANANTE);
  const inicioAtencion = texto.indexOf(TITULO_ATENCION);

  // si el texto no tiene los títulos (por ejemplo, lo cargaron de otra forma), va entero a la primera casilla
  if (!texto.startsWith(TITULO_EVITAR) || inicioAcompanante === -1 || inicioAtencion === -1) {
    return { evitar: texto, acompanante: "", atencion: "" };
  }

  return {
    evitar: texto.slice(TITULO_EVITAR.length, inicioAcompanante).trim(),
    acompanante: texto.slice(inicioAcompanante + TITULO_ACOMPANANTE.length, inicioAtencion).trim(),
    atencion: texto.slice(inicioAtencion + TITULO_ATENCION.length).trim(),
  };
}

export default function Cuidados() {
  FondoBlanco();
  const { usuario } = useAuth();
  const [evitar, setEvitar] = useState("");
  const [acompanante, setAcompanante] = useState("");
  const [atencion, setAtencion] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;

    // trae las medidas anticipadas guardadas y las reparte en las 3 casillas
    const fetchMedidas = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await usuarioService.getUsuarioById(usuario.id);
        const partes = separarTexto(data.medidasAnticipadas ?? "");
        setEvitar(partes.evitar);
        setAcompanante(partes.acompanante);
        setAtencion(partes.atencion);
      } catch (err) {
        console.error(err);
        setError("Hubo un error al cargar tus indicaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchMedidas();
  }, [usuario]);

  // guarda las 3 respuestas en el back como un solo texto
  const handleConfirmar = async () => {
    if (!usuario) return;
    setGuardando(true);
    setError(null);
    setMensaje(null);

    try {
      const texto = armarTexto(evitar, acompanante, atencion);
      if (texto.length > 5000) {
        setError("Tus indicaciones son muy largas. Probá acortarlas un poco.");
        return;
      }
      await usuarioService.editarMedidasAnticipadas(usuario.id, texto);
      setMensaje("Tus indicaciones se guardaron");
    } catch (err) {
      console.error(err);
      setError("No se pudieron guardar tus indicaciones");
    } finally {
      setGuardando(false);
    }
  };

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
          {loading && <p>Cargando tus indicaciones...</p>}
          <CajaPreferencias
            titulo="¿Algo para evitar por si ocurre un caso de emergencia?"
            placeholder='Escriba aquí.
Ej: "En caso de que me internen, no quiero que me ingresen un tubo” '
            value={evitar}
            onChange={setEvitar}
          />
          <CajaPreferencias
            titulo="¿Quién querés que te acompañe?"
            value={acompanante}
            onChange={setAcompanante}
          />
          <CajaPreferencias
            titulo="¿Cómo preferís ser atendido?"
            value={atencion}
            onChange={setAtencion}
          />
        </section>
        <div className="flex w-full rounded-2xl bg-zinc-100 border border-gray-200 p-5 gap-4">
          <MdLock className="bg-white border border-gray-200 p-2.5 size-12 rounded-lg text-[#4A7FBF]" />
          <p className="max-w-75/100">
            Tu familia puede ver estas indicaciones desde su aplicación
            autorizada para respetarlas y comunicarlas ante cualquier atención
            médica.
          </p>
        </div>
        {/* el back no tiene dónde guardar INDICACIONES EXTRA: este botón queda sin conectar por ahora */}
        <h2 className="w-full rounded-2xl border-dashed border-3 text-lg p-5 border-gray-300 bg-white flex gap-3 items-center justify-center hover:bg-zinc-100 cursor-pointer active:bg-zinc-200">
          <LuCirclePlus className="text-[#4A7FBF] text-2xl"/>Agregar otra indicación o deseo
        </h2>
        {error && <p className="text-red-600">{error}</p>}
        {mensaje && <p className="text-green-700">{mensaje}</p>}
        <button
          onClick={handleConfirmar}
          disabled={guardando || loading}
          className="w-full rounded-2xl text-lg p-5 bg-black text-white flex gap-3 items-center justify-center hover:bg-black/90 cursor-pointer active:bg-black/75 disabled:opacity-50"
        >
          <MdCheck className="text-white text-2xl"/>
          {guardando ? "Guardando..." : "Confirmar mis indicaciones"}
        </button>
      </main>
    </>
  );
}
