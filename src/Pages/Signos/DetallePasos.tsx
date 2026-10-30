import { useEffect, useState } from "react";
import { MdDirectionsWalk } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import { medicionesService, type Medicion } from "../../services/medicionesService";
import { idDelAdultoQueSeMira } from "../../utils/adultoQueSeMira";
import { DIA_MS, claveDelDia, diaCorto, diasDelPeriodo, ultimosDias } from "../../utils/formatoSignos";
import PantallaDetalleSigno from "../../components/PantallaDetalleSigno";
import DatoSigno from "../../components/DatoSigno";

// meta de pasos diaria (fija hasta que el back permita guardarla por persona)
const META_PASOS = 3000;

// una barra del gráfico: su texto de abajo y la cantidad de pasos
interface Barra {
  clave: string;
  etiqueta: string;
  pasos: number;
  // fecha del día (solo en semana y mes)
  fecha: number;
}

// suma los pasos de cada hora de hoy (0 a 23)
function pasosPorHora(pasos: Medicion[]) {
  const barras: Barra[] = [];
  for (let h = 0; h < 24; h++) {
    barras.push({ clave: String(h), etiqueta: String(h), pasos: 0, fecha: 0 });
  }
  for (const paso of pasos) {
    const horaDelPaso = new Date(paso.timestamp).getHours();
    barras[horaDelPaso].pasos += paso.valor;
  }
  return barras;
}

// suma los pasos de cada día del período
function pasosPorDia(pasos: Medicion[], dias: number, ahora: number) {
  return ultimosDias(dias, ahora).map((dia) => {
    let total = 0;
    for (const paso of pasos) {
      if (claveDelDia(paso.timestamp) === dia.clave) total += paso.valor;
    }
    return { clave: dia.clave, etiqueta: dia.etiqueta, pasos: total, fecha: dia.fecha };
  });
}

// pantalla de detalle: pasos por hora (hoy) o por día (semana y mes)
export default function DetallePasos() {
  const { usuario } = useAuth();
  const [periodo, setPeriodo] = useState("hoy");
  const [pasos, setPasos] = useState<Medicion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sinAdulto, setSinAdulto] = useState(false);
  const [cargadoEn, setCargadoEn] = useState(0);
  const dias = diasDelPeriodo(periodo);

  useEffect(() => {
    if (!usuario) return;
    const actual = usuario;

    // trae los pasos desde las 00:00 del primer día del período
    const cargar = async () => {
      setError(null);
      const ahora = Date.now();
      try {
        const id = await idDelAdultoQueSeMira(actual);
        if (!id) {
          setSinAdulto(true);
          return;
        }
        const inicio = new Date(ahora - (dias - 1) * DIA_MS);
        inicio.setHours(0, 0, 0, 0);
        setPasos(await medicionesService.getMediciones(id, "PASOS", inicio.toISOString()));
        setCargadoEn(ahora);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los pasos.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario, dias]);

  // ---------- cuentas ----------
  const esHoy = periodo === "hoy";
  const barras = esHoy ? pasosPorHora(pasos) : pasosPorDia(pasos, dias, cargadoEn);

  let total = 0;
  let masActiva: Barra | null = null;
  for (const barra of barras) {
    total += barra.pasos;
    if (barra.pasos > 0 && (!masActiva || barra.pasos > masActiva.pasos)) masActiva = barra;
  }
  const maximo = masActiva ? masActiva.pasos : 0;
  const promedioPorDia = Math.round(total / dias);
  const porcentajeMeta = Math.round((promedioPorDia / META_PASOS) * 100);
  const diasConMeta = barras.filter((b) => b.pasos >= META_PASOS).length;

  // hoy: mañana (06 a 12) y tarde (12 a 20)
  let manana = 0;
  let tarde = 0;
  if (esHoy) {
    for (const barra of barras) {
      const h = Number(barra.clave);
      if (h >= 6 && h < 12) manana += barra.pasos;
      if (h >= 12 && h < 20) tarde += barra.pasos;
    }
  }

  // texto de "Lo que vemos"
  let loQueVemos = "";
  if (masActiva && total > 0) {
    const porcentaje = Math.round((masActiva.pasos / total) * 100);
    if (esHoy) {
      const h = Number(masActiva.clave);
      loQueVemos = `El momento más activo fue entre las ${h}:00 y las ${h + 1}:00, con ${masActiva.pasos.toLocaleString("es-AR")} pasos (${porcentaje} % del día).`;
      if (total >= META_PASOS) loQueVemos += " La meta del día ya está cumplida.";
      else loQueVemos += ` Faltan ${(META_PASOS - total).toLocaleString("es-AR")} pasos para la meta.`;
    } else {
      loQueVemos = `En promedio fueron ${promedioPorDia.toLocaleString("es-AR")} pasos por día. La meta se cumplió ${diasConMeta} de ${dias} días.`;
    }
  }

  return (
    <PantallaDetalleSigno
      titulo="Movilidad y actividad"
      periodo={periodo}
      onCambiarPeriodo={setPeriodo}
      cargando={cargando}
      error={error}
      sinAdulto={sinAdulto}
      loQueVemos={loQueVemos}
    >
      <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-xs" aria-label="Gráfico de pasos">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <MdDirectionsWalk aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#84F6E6]/30 p-2 text-[#006A61]" />
            Movilidad y actividad
          </h2>
          <span className="rounded-full bg-[#E0F0FF] px-2.5 py-1 text-xs font-bold text-[#0049CC]">{porcentajeMeta}% meta</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{(esHoy ? total : promedioPorDia).toLocaleString("es-AR")}</span>
            <span className="text-base font-semibold text-[#424656]">{esHoy ? "pasos de hoy" : "pasos por día"}</span>
          </p>
          <p className="text-sm font-semibold text-[#424656]">Meta: {META_PASOS.toLocaleString("es-AR")}</p>
        </div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#424656]">{esHoy ? "Hoy · pasos por hora" : `Últimos ${dias} días · pasos por día`}</p>

        {total === 0 ? (
          <p className="py-8 text-center text-sm text-[#424656]">Sin pasos registrados en este período.</p>
        ) : (
          <>
            {/* barras: la altura de cada una es su porcentaje respecto de la más alta */}
            <div role="img" aria-label={esHoy ? "Pasos por hora de hoy" : `Pasos por día de los últimos ${dias} días`} className="flex h-40 items-end gap-0.5 border-b border-[#D4E4F3]">
              {barras.map((barra) => (
                <div
                  key={barra.clave}
                  title={`${barra.etiqueta}: ${barra.pasos} pasos`}
                  className={`min-w-0 flex-1 rounded-t ${masActiva && barra.clave === masActiva.clave ? "bg-[#1550E0]" : "bg-[#B9D2FF]"}`}
                  style={{ height: `${maximo > 0 ? Math.max(2, (barra.pasos / maximo) * 100) : 2}%` }}
                />
              ))}
            </div>
            <div className="flex gap-0.5 text-[0.65rem] text-[#424656]">
              {barras.map((barra, i) => (
                <span key={barra.clave} className="min-w-0 flex-1 text-center">
                  {/* se escribe 1 etiqueta de cada tantas para que no se encimen */}
                  {(esHoy && i % 4 === 0) || (!esHoy && dias <= 7) || (!esHoy && i % 5 === 0) ? barra.etiqueta : ""}
                </span>
              ))}
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#424656]">
              <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#1550E0]" />Momento más activo</li>
              <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#B9D2FF]" />Resto</li>
            </ul>
          </>
        )}
      </section>

      {esHoy ? (
        <dl className="grid grid-cols-2 gap-2.5">
          <DatoSigno
            titulo="Más activo"
            valor={masActiva ? `${masActiva.clave}:00 hs` : "—"}
            aclaracion={masActiva ? `${masActiva.pasos.toLocaleString("es-AR")} pasos` : undefined}
          />
          <DatoSigno titulo="Mañana (06 a 12 hs)" valor={manana.toLocaleString("es-AR")} aclaracion="pasos" />
          <DatoSigno titulo="Tarde (12 a 20 hs)" valor={tarde.toLocaleString("es-AR")} aclaracion="pasos" />
          <DatoSigno
            titulo="Meta diaria"
            valor={`${porcentajeMeta} %`}
            aclaracion={total >= META_PASOS ? "Cumplida" : `Faltan ${(META_PASOS - total).toLocaleString("es-AR")} pasos`}
          />
        </dl>
      ) : (
        <dl className="grid grid-cols-2 gap-2.5">
          <DatoSigno
            titulo="Día más activo"
            valor={masActiva ? masActiva.pasos.toLocaleString("es-AR") : "—"}
            aclaracion={masActiva ? diaCorto(masActiva.fecha) : undefined}
          />
          <DatoSigno titulo="Promedio por día" valor={promedioPorDia.toLocaleString("es-AR")} aclaracion="pasos" />
          <DatoSigno titulo="Total" valor={total.toLocaleString("es-AR")} aclaracion={`en ${dias} días`} />
          <DatoSigno titulo="Meta cumplida" valor={`${diasConMeta} de ${dias}`} aclaracion="días" />
        </dl>
      )}
    </PantallaDetalleSigno>
  );
}
