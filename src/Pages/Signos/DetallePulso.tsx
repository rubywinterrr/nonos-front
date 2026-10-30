import { useEffect, useState } from "react";
import { MdFavorite } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import { medicionesService, type Medicion } from "../../services/medicionesService";
import { idDelAdultoQueSeMira } from "../../utils/adultoQueSeMira";
import { DIA_MS, diasDelPeriodo, diaYHora, hora } from "../../utils/formatoSignos";
import PantallaDetalleSigno from "../../components/PantallaDetalleSigno";
import DatoSigno from "../../components/DatoSigno";

// zona segura del pulso en reposo
const PULSO_MIN = 60;
const PULSO_MAX = 100;
// rango del gráfico (de abajo a arriba)
const GRAFICO_MIN = 40;
const GRAFICO_MAX = 130;
// si entre dos mediciones pasaron más de 30 minutos, la línea se corta (la pulsera no midió)
const CORTE_MS = 30 * 60 * 1000;

// posición en el dibujo (320 x 200): x según la hora, y según el valor
function posicionX(tiempo: number, desde: number, hasta: number) {
  return 30 + ((tiempo - desde) / (hasta - desde)) * 285;
}
function posicionY(valor: number) {
  const limitado = Math.min(GRAFICO_MAX, Math.max(GRAFICO_MIN, valor));
  return 10 + (1 - (limitado - GRAFICO_MIN) / (GRAFICO_MAX - GRAFICO_MIN)) * 165;
}

// arma los tramos de la línea ("x,y x,y ..."), cortando donde no hubo mediciones
function tramosDelGrafico(pulsos: Medicion[], desde: number, hasta: number) {
  const salto = Math.max(1, Math.floor(pulsos.length / 300));
  const tramos: string[] = [];
  let actual = "";
  let anterior = 0;
  // vienen del más nuevo al más viejo: se recorren al revés para dibujar de izquierda a derecha
  for (let i = pulsos.length - 1; i >= 0; i = i - salto) {
    const tiempo = new Date(pulsos[i].timestamp).getTime();
    if (actual !== "" && tiempo - anterior > CORTE_MS) {
      tramos.push(actual);
      actual = "";
    }
    actual = actual + `${posicionX(tiempo, desde, hasta).toFixed(1)},${posicionY(pulsos[i].valor).toFixed(1)} `;
    anterior = tiempo;
  }
  if (actual !== "") tramos.push(actual);
  return tramos;
}

// la primera etiqueta de abajo se alinea a la izquierda y la última a la derecha, para que no se corten
function anclaDeEtiqueta(i: number) {
  if (i === 0) return "start";
  if (i === 4) return "end";
  return "middle";
}

// cómo se nombra el período en las frases
function nombreDelPeriodo(periodo: string) {
  if (periodo === "semana") return "de la semana";
  if (periodo === "mes") return "del mes";
  return "de las últimas 24 hs";
}

// pantalla de detalle: frecuencia cardíaca con gráfico, mínimo, máximo y promedios
export default function DetallePulso() {
  const { usuario } = useAuth();
  const [periodo, setPeriodo] = useState("hoy");
  const [pulsos, setPulsos] = useState<Medicion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sinAdulto, setSinAdulto] = useState(false);
  const [cargadoEn, setCargadoEn] = useState(0);
  const dias = diasDelPeriodo(periodo);

  useEffect(() => {
    if (!usuario) return;
    const actual = usuario;

    // trae los pulsos del período del adulto que se está mirando
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
        setPulsos(await medicionesService.getMediciones(id, "FRECUENCIA_CARDIACA", desde));
        setCargadoEn(ahora);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos del pulso.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario, dias]);

  // ---------- cuentas ----------
  const ultimo = pulsos.length > 0 ? pulsos[0] : null;
  let minimo: Medicion | null = null;
  let maximo: Medicion | null = null;
  let suma = 0;
  let fueraDeZona = 0;
  let sumaNoche = 0;
  let cantidadNoche = 0;
  for (const pulso of pulsos) {
    if (!minimo || pulso.valor < minimo.valor) minimo = pulso;
    if (!maximo || pulso.valor > maximo.valor) maximo = pulso;
    suma += pulso.valor;
    if (pulso.valor < PULSO_MIN || pulso.valor > PULSO_MAX) fueraDeZona++;
    // "en reposo": las mediciones de la madrugada (de 00 a 06 hs), cuando la persona suele dormir
    if (new Date(pulso.timestamp).getHours() < 6) {
      sumaNoche += pulso.valor;
      cantidadNoche++;
    }
  }
  const promedio = pulsos.length > 0 ? Math.round(suma / pulsos.length) : null;
  const promedioNoche = cantidadNoche > 0 ? Math.round(sumaNoche / cantidadNoche) : null;
  const enZona = ultimo !== null && ultimo.valor >= PULSO_MIN && ultimo.valor <= PULSO_MAX;

  // texto de "Lo que vemos", armado solo con los datos
  let loQueVemos = "";
  if (minimo && maximo) {
    const extremos = `El más alto fue ${Math.round(maximo.valor)} lpm (${diaYHora(maximo.timestamp)}) y el más bajo ${Math.round(minimo.valor)} lpm (${diaYHora(minimo.timestamp)}).`;
    if (fueraDeZona === 0) {
      loQueVemos = `Todos los valores ${nombreDelPeriodo(periodo)} estuvieron dentro de la zona segura (60-100 lpm). ${extremos}`;
    } else {
      loQueVemos = `${fueraDeZona} de ${pulsos.length} mediciones ${nombreDelPeriodo(periodo)} estuvieron fuera de la zona segura (60-100 lpm). ${extremos} Si se repite, conviene comentarlo con el médico.`;
    }
  }

  // rango del gráfico y las 5 etiquetas de abajo
  const hasta = cargadoEn;
  const desde = hasta - dias * DIA_MS;
  const etiquetas = [0, 1, 2, 3, 4].map((i) => desde + (i / 4) * (hasta - desde));

  return (
    <PantallaDetalleSigno
      titulo="Frecuencia cardíaca"
      periodo={periodo}
      onCambiarPeriodo={setPeriodo}
      cargando={cargando}
      error={error}
      sinAdulto={sinAdulto}
      loQueVemos={loQueVemos}
    >
      <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-xs" aria-label="Gráfico de frecuencia cardíaca">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <MdFavorite aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#FFDBD2] p-2 text-[#AD2B00]" />
          Frecuencia cardíaca
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{ultimo ? Math.round(ultimo.valor) : "—"}</span>
            <span className="text-lg font-semibold text-[#424656]">lpm</span>
          </p>
          {ultimo && (
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${enZona ? "bg-[#84F6E6]/30 text-[#006A61]" : "bg-[#FFDBD2] text-[#AD2B00]"}`}>
              {enZona ? "En zona segura" : "Fuera de zona"}
            </span>
          )}
        </div>

        {pulsos.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#424656]">Sin mediciones de pulso en este período.</p>
        ) : (
          <>
            <svg viewBox="0 0 320 200" role="img" aria-label={`Pulso ${nombreDelPeriodo(periodo)}: entre ${minimo ? Math.round(minimo.valor) : ""} y ${maximo ? Math.round(maximo.valor) : ""} lpm`} className="w-full">
              {/* zona segura: de 60 a 100 lpm */}
              <rect x="30" y={posicionY(PULSO_MAX)} width="285" height={posicionY(PULSO_MIN) - posicionY(PULSO_MAX)} fill="#84F6E6" opacity="0.3" />
              {/* líneas guía con su valor */}
              {[40, 70, 100, 130].map((valor) => (
                <g key={valor}>
                  <line x1="30" x2="315" y1={posicionY(valor)} y2={posicionY(valor)} stroke="#D4E4F3" strokeDasharray="3 3" />
                  <text x="2" y={posicionY(valor) + 4} fontSize="10" fill="#424656">{valor}</text>
                </g>
              ))}
              {tramosDelGrafico(pulsos, desde, hasta).map((tramo, i) => (
                <polyline key={i} points={tramo} fill="none" stroke="#1550E0" strokeWidth="2" strokeLinejoin="round" />
              ))}
              {minimo && (
                <circle cx={posicionX(new Date(minimo.timestamp).getTime(), desde, hasta)} cy={posicionY(minimo.valor)} r="4" fill="white" stroke="#006A61" strokeWidth="2" />
              )}
              {maximo && (
                <circle cx={posicionX(new Date(maximo.timestamp).getTime(), desde, hasta)} cy={posicionY(maximo.valor)} r="4" fill="#1550E0" />
              )}
              {etiquetas.map((tiempo, i) => (
                <text key={i} x={posicionX(tiempo, desde, hasta)} y="195" fontSize="10" fill="#424656" textAnchor={anclaDeEtiqueta(i)}>
                  {periodo === "hoy" ? hora(tiempo) : new Date(tiempo).getDate()}
                </text>
              ))}
            </svg>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#424656]">
              <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#1550E0]" />Pulso</li>
              <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-sm bg-[#84F6E6]" />Zona segura (60-100)</li>
              <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full border-2 border-[#006A61]" />Mínimo</li>
            </ul>
          </>
        )}
      </section>

      <dl className="grid grid-cols-2 gap-2.5">
        <DatoSigno titulo="Mínimo" valor={minimo ? `${Math.round(minimo.valor)} lpm` : "—"} aclaracion={minimo ? diaYHora(minimo.timestamp) : undefined} />
        <DatoSigno titulo="Máximo" valor={maximo ? `${Math.round(maximo.valor)} lpm` : "—"} aclaracion={maximo ? diaYHora(maximo.timestamp) : undefined} />
        <DatoSigno titulo="Promedio" valor={promedio !== null ? `${promedio} lpm` : "—"} aclaracion={`${pulsos.length} mediciones`} />
        <DatoSigno titulo="En reposo" valor={promedioNoche !== null ? `${promedioNoche} lpm` : "—"} aclaracion="Promedio de 00 a 06 hs" />
      </dl>
    </PantallaDetalleSigno>
  );
}
