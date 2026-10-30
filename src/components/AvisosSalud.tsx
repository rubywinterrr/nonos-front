import { useState } from "react";
import { alertasService, type Alerta } from "../services/alertasService";
import { LuTriangleAlert, LuInfo, LuPartyPopper } from "react-icons/lu";

interface Props {
  alertas: Alerta[];
  // se llama cuando el adulto responde un aviso, para sacarlo de la lista del Home
  onRespondida: (id: string) => void;
}

// lee un número de datosContexto (el back guarda ahí el valor medido y el promedio de la persona)
function numeroDelContexto(alerta: Alerta, clave: string) {
  if (!alerta.datosContexto) return null;
  const valor = alerta.datosContexto[clave];
  if (typeof valor === "number") return valor;
  return null;
}

// "más alto" o "más bajo" que lo habitual, comparando lo medido con el promedio
function comparacion(alerta: Alerta) {
  const medido = numeroDelContexto(alerta, "valorMedido");
  const promedio = numeroDelContexto(alerta, "promedio");
  if (medido === null || promedio === null) return "distinto";
  if (medido > promedio) return "más alto";
  return "más bajo";
}

// título y recomendación que ve el adulto según el tipo de aviso
function textoDelAviso(alerta: Alerta) {
  const medido = numeroDelContexto(alerta, "valorMedido");

  if (alerta.tipo === "FC_ELEVADA" || alerta.tipo === "FC_BAJA") {
    let titulo = `Tu pulso está ${comparacion(alerta)} que lo habitual`;
    if (alerta.tipo === "FC_BAJA") titulo = "Tu pulso está más bajo que lo habitual";
    return {
      titulo,
      detalle: medido !== null ? `Se midió ${Math.round(medido)} lpm.` : "",
      recomendacion: "Sentate, descansá unos minutos y respirá tranquilo. Si te sentís mal, pedí ayuda.",
    };
  }
  if (alerta.tipo === "SP02_BAJO") {
    return {
      titulo: "El oxígeno en sangre está más bajo que lo habitual",
      detalle: medido !== null ? `Se midió ${Math.round(medido)} %.` : "",
      recomendacion: "Quedate en reposo. Si te falta el aire o te mareás, pedí ayuda.",
    };
  }
  if (alerta.tipo === "LOGRO_POSITIVO") {
    return {
      titulo: "¡Hoy caminaste más que de costumbre!",
      detalle: "",
      recomendacion: "Seguí así, y acordate de tomar agua.",
    };
  }
  if (alerta.tipo === "MEDICACION_STOCK_BAJO") {
    return {
      titulo: "Te quedan pocas pastillas",
      detalle: "",
      recomendacion: "Avisale a tu familia o cuidador para reponerlas.",
    };
  }
  // CAMBIO_DE_RUTINA: sueño o pasos distintos a lo normal
  let titulo = "Hoy tu rutina fue distinta a la de siempre";
  if (alerta.datosContexto?.tipoMedicion === "SUENO") titulo = "Dormiste distinto que de costumbre";
  if (alerta.datosContexto?.tipoMedicion === "PASOS") titulo = "Hoy te moviste menos que de costumbre";
  return {
    titulo,
    detalle: "",
    recomendacion: "Si te sentís bien, no hace falta hacer nada.",
  };
}

// avisos del Home cuando los datos de la pulsera salen de lo normal, con lo que conviene hacer
export default function AvisosSalud({ alertas, onRespondida }: Props) {
  const [respondiendo, setRespondiendo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // el SOS ya tiene su propia pantalla; acá solo van los avisos de los datos que todavía no respondió
  // (si dijo "Necesito ayuda" el back la deja pendiente pero con confirmadaEn, y ya avisó a su familia)
  const avisos = alertas.filter(
    (a) => a.estado === "PENDIENTE" && a.tipo !== "SOS_DIRECTO" && a.confirmadaEn === null
  );

  // le dice al back si está bien (se resuelve) o si necesita ayuda (se avisa a la familia)
  const responder = async (id: string, estaBien: boolean) => {
    setRespondiendo(id);
    setError(null);
    try {
      await alertasService.confirmarAlerta(id, estaBien);
      onRespondida(id);
    } catch (err) {
      console.error(err);
      setError("No se pudo enviar tu respuesta. Probá de nuevo.");
    } finally {
      setRespondiendo(null);
    }
  };

  if (avisos.length === 0) return null;

  return (
    <section className="flex w-full min-w-0 flex-col gap-3" aria-label="Avisos de salud">
      {avisos.map((aviso) => {
        const texto = textoDelAviso(aviso);
        const esCritico = aviso.categoria === "CRITICO";
        const esLogro = aviso.tipo === "LOGRO_POSITIVO";

        // colores e ícono según qué tan importante es
        let estilo = "border-[#1550E0]/30 bg-[#EBF5FF] text-[#0E1D28]";
        let icono = <LuInfo aria-hidden="true" className="size-6 shrink-0 text-[#1550E0]" />;
        if (esCritico) {
          estilo = "border-[#BA1A1A]/40 bg-[#FFDAD6] text-[#93000A]";
          icono = <LuTriangleAlert aria-hidden="true" className="size-6 shrink-0 text-[#BA1A1A]" />;
        }
        if (esLogro) {
          estilo = "border-[#006A61]/30 bg-[#84F6E6]/30 text-[#00201D]";
          icono = <LuPartyPopper aria-hidden="true" className="size-6 shrink-0 text-[#006A61]" />;
        }

        return (
          <article key={aviso.id} role={esCritico ? "alert" : undefined} className={`flex flex-col gap-3 rounded-2xl border p-4 ${estilo}`}>
            <div className="flex items-start gap-3">
              {icono}
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold leading-snug">{texto.titulo}</h2>
                {texto.detalle && <p className="text-sm">{texto.detalle}</p>}
                <p className="text-base">{texto.recomendacion}</p>
              </div>
            </div>

            {esCritico ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={respondiendo === aviso.id}
                  onClick={() => responder(aviso.id, true)}
                  className="min-h-12 cursor-pointer rounded-xl bg-white font-bold text-[#006A61] hover:bg-gray-100 active:bg-gray-200 disabled:cursor-wait disabled:opacity-70"
                >
                  Estoy bien
                </button>
                <button
                  type="button"
                  disabled={respondiendo === aviso.id}
                  onClick={() => responder(aviso.id, false)}
                  className="min-h-12 cursor-pointer rounded-xl bg-[#BA1A1A] font-bold text-white hover:bg-[#93000A] active:bg-[#690005] disabled:cursor-wait disabled:opacity-70"
                >
                  Necesito ayuda
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={respondiendo === aviso.id}
                onClick={() => responder(aviso.id, true)}
                className="min-h-12 w-full cursor-pointer rounded-xl bg-white font-bold text-[#1550E0] hover:bg-gray-100 active:bg-gray-200 disabled:cursor-wait disabled:opacity-70"
              >
                Entendido
              </button>
            )}
          </article>
        );
      })}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
    </section>
  );
}
