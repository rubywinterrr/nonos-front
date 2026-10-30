import { useEffect, useState } from "react";
import { TbLungs } from "react-icons/tb";
import { useAuth } from "../../hooks/useAuth";
import { medicionesService, type Medicion } from "../../services/medicionesService";
import { idDelAdultoQueSeMira } from "../../utils/adultoQueSeMira";
import { DIA_MS, claveDelDia, diaCorto, diasDelPeriodo, hora, ultimosDias } from "../../utils/formatoSignos";
import PantallaDetalleSigno from "../../components/PantallaDetalleSigno";
import DatoSigno from "../../components/DatoSigno";

// por debajo de este valor el oxígeno se considera bajo
const MINIMO_SALUDABLE = 95;
// rango del gráfico (de abajo a arriba)
const GRAFICO_MIN = 88;
const GRAFICO_MAX = 100;

// posición vertical en el dibujo (alto 150) según el porcentaje
function posicionY(valor: number) {
  const limitado = Math.min(GRAFICO_MAX, Math.max(GRAFICO_MIN, valor));
  return 15 + (1 - (limitado - GRAFICO_MIN) / (GRAFICO_MAX - GRAFICO_MIN)) * 135;
}

// etiqueta del oxígeno según el valor
function estadoOxigeno(valor: number) {
  if (valor >= 98) return "Óptimo";
  if (valor >= MINIMO_SALUDABLE) return "Normal";
  return "Bajo";
}

// pantalla de detalle: oxígeno en sangre, con el promedio de cada día
export default function DetalleOxigeno() {
  const { usuario } = useAuth();
  const [periodo, setPeriodo] = useState("hoy");
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sinAdulto, setSinAdulto] = useState(false);
  const [cargadoEn, setCargadoEn] = useState(0);
  // la pulsera mide el oxígeno de noche (una vez por día), así que "Hoy" muestra igual los últimos 7 días
  const dias = Math.max(7, diasDelPeriodo(periodo));

  useEffect(() => {
    if (!usuario) return;
    const actual = usuario;

    // trae las mediciones de oxígeno del adulto que se está mirando
    const cargar = async () => {
      setError(null);
      const ahora = Date.now();
      try {
        const id = await idDelAdultoQueSeMira(actual);
        if (!id) {
          setSinAdulto(true);
          return;
        }
        const desde = new Date(ahora - dias * DIA_MS).toISOString();
        setMediciones(await medicionesService.getMediciones(id, "SPO2", desde));
        setCargadoEn(ahora);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos de oxígeno.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario, dias]);

  // ---------- promedio de cada día ----------
  const diasDelGrafico = ultimosDias(dias, cargadoEn).map((dia) => {
    let suma = 0;
    let cantidad = 0;
    for (const medicion of mediciones) {
      if (claveDelDia(medicion.timestamp) === dia.clave) {
        suma += medicion.valor;
        cantidad++;
      }
    }
    const promedio = cantidad > 0 ? Math.round(suma / cantidad) : null;
    return { ...dia, promedio };
  });
  const diasConDato = diasDelGrafico.filter((d) => d.promedio !== null);

  const ultimo = mediciones.length > 0 ? mediciones[0] : null;
  let sumaTotal = 0;
  let masBaja: Medicion | null = null;
  let masAlta: Medicion | null = null;
  for (const medicion of mediciones) {
    sumaTotal += medicion.valor;
    if (!masBaja || medicion.valor < masBaja.valor) masBaja = medicion;
    if (!masAlta || medicion.valor > masAlta.valor) masAlta = medicion;
  }
  const promedioTotal = mediciones.length > 0 ? Math.round(sumaTotal / mediciones.length) : null;
  const diasBajos = diasConDato.filter((d) => d.promedio !== null && d.promedio < MINIMO_SALUDABLE).length;

  // texto de "Lo que vemos"
  let loQueVemos = "";
  if (diasConDato.length > 0) {
    if (diasBajos === 0) {
      loQueVemos = `En los ${diasConDato.length} días con mediciones, el oxígeno estuvo en ${MINIMO_SALUDABLE} % o más. No hay descensos que requieran atención.`;
    } else {
      loQueVemos = `${diasBajos} de ${diasConDato.length} días tuvieron un promedio por debajo de ${MINIMO_SALUDABLE} %. Si se repite, conviene comentarlo con el médico.`;
    }
  }

  // ancho de cada día en el dibujo (300 de ancho)
  const paso = diasDelGrafico.length > 1 ? 270 / (diasDelGrafico.length - 1) : 0;
  let linea = "";
  diasDelGrafico.forEach((dia, i) => {
    if (dia.promedio !== null) linea = linea + `${(30 + i * paso).toFixed(1)},${posicionY(dia.promedio).toFixed(1)} `;
  });

  return (
    <PantallaDetalleSigno
      titulo="Oxígeno en sangre"
      periodo={periodo}
      onCambiarPeriodo={setPeriodo}
      cargando={cargando}
      error={error}
      sinAdulto={sinAdulto}
      loQueVemos={loQueVemos}
    >
      <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-xs" aria-label="Gráfico de oxígeno en sangre">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <TbLungs aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#E0F0FF] p-2 text-[#0B5FFF]" />
            Oxígeno en sangre
          </h2>
          {ultimo && (
            <span className="rounded-full bg-[#84F6E6]/30 px-2.5 py-1 text-xs font-bold text-[#006A61]">{estadoOxigeno(ultimo.valor)}</span>
          )}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{ultimo ? Math.round(ultimo.valor) : "—"}</span>
            <span className="text-lg font-semibold text-[#424656]">%</span>
          </p>
          {ultimo && <p className="text-sm font-semibold text-[#424656]">Medido {diaCorto(ultimo.timestamp)} · {hora(ultimo.timestamp)} hs</p>}
        </div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#424656]">Promedio por día · últimos {dias} días</p>

        {diasConDato.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#424656]">
            Sin mediciones en este período. La pulsera mide el oxígeno mientras la persona duerme.
          </p>
        ) : (
          <>
            <svg viewBox="0 0 320 175" role="img" aria-label={`Oxígeno: promedio diario de los últimos ${dias} días`} className="w-full">
              {/* franja saludable: 95 % o más */}
              <rect x="30" y={posicionY(GRAFICO_MAX)} width="285" height={posicionY(MINIMO_SALUDABLE) - posicionY(GRAFICO_MAX)} fill="#84F6E6" opacity="0.3" />
              <line x1="30" x2="315" y1={posicionY(MINIMO_SALUDABLE)} y2={posicionY(MINIMO_SALUDABLE)} stroke="#006A61" strokeDasharray="4 3" />
              {[88, 92, 96, 100].map((valor) => (
                <text key={valor} x="2" y={posicionY(valor) + 4} fontSize="10" fill="#424656">{valor}</text>
              ))}
              <polyline points={linea} fill="none" stroke="#1550E0" strokeWidth="2" strokeLinejoin="round" />
              {diasDelGrafico.map((dia, i) => (
                <g key={dia.clave}>
                  {dia.promedio !== null && (
                    <>
                      <circle cx={30 + i * paso} cy={posicionY(dia.promedio)} r="4" fill={dia.promedio < MINIMO_SALUDABLE ? "#BA1A1A" : "white"} stroke="#1550E0" strokeWidth="2" />
                      {dias <= 7 && (
                        <text x={30 + i * paso} y={posicionY(dia.promedio) - 9} fontSize="10" fontWeight="bold" fill="#0E1D28" textAnchor="middle">{dia.promedio}%</text>
                      )}
                    </>
                  )}
                  {/* en el mes se escribe 1 de cada 5 días para que no se encimen */}
                  {(dias <= 7 || i % 5 === 0 || i === diasDelGrafico.length - 1) && (
                    <text x={30 + i * paso} y="172" fontSize="10" fill="#424656" textAnchor="middle">{dia.etiqueta}</text>
                  )}
                </g>
              ))}
            </svg>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#424656]">
              <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#1550E0]" />Promedio del día</li>
              <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-0.5 w-4 bg-[#006A61]" />Mínimo saludable (95 %)</li>
            </ul>
          </>
        )}
      </section>

      <dl className="grid grid-cols-2 gap-2.5">
        <DatoSigno titulo="Último" valor={ultimo ? `${Math.round(ultimo.valor)} %` : "—"} aclaracion={ultimo ? `${hora(ultimo.timestamp)} hs · ${estadoOxigeno(ultimo.valor)}` : undefined} />
        <DatoSigno titulo="Promedio" valor={promedioTotal !== null ? `${promedioTotal} %` : "—"} aclaracion={`Últimos ${dias} días`} />
        <DatoSigno titulo="Más bajo" valor={masBaja ? `${Math.round(masBaja.valor)} %` : "—"} aclaracion={masBaja ? diaCorto(masBaja.timestamp) : undefined} />
        <DatoSigno titulo="Más alto" valor={masAlta ? `${Math.round(masAlta.valor)} %` : "—"} aclaracion={masAlta ? diaCorto(masAlta.timestamp) : undefined} />
      </dl>
    </PantallaDetalleSigno>
  );
}
