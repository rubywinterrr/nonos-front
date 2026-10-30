import { useEffect, useState } from "react";
import { LuMoon } from "react-icons/lu";
import { MdCheck } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import { medicionesService, type Medicion } from "../../services/medicionesService";
import { idDelAdultoQueSeMira } from "../../utils/adultoQueSeMira";
import { DIA_MS, diaCorto, diasDelPeriodo, hora, horasYMinutos } from "../../utils/formatoSignos";
import PantallaDetalleSigno from "../../components/PantallaDetalleSigno";
import DatoSigno from "../../components/DatoSigno";

// a partir de cuántos minutos dormidos se considera "sueño reparador"
const SUENO_REPARADOR = 7 * 60;

// minutos de cada etapa de una noche
interface Etapas {
  profundo: number;
  rem: number;
  ligero: number;
  despierto: number;
}

// suma los minutos de cada etapa que guardó el back (metadata.etapas)
// Google manda tipos como "DEEP", "REM", "LIGHT" o "AWAKE"; lo que no se reconoce cuenta como ligero
function etapasDeLaNoche(sueno: Medicion) {
  const etapas: Etapas = { profundo: 0, rem: 0, ligero: 0, despierto: 0 };
  const lista = sueno.metadata?.etapas ?? [];
  for (const etapa of lista) {
    const tipo = etapa.tipo.toUpperCase();
    if (tipo.includes("DEEP")) etapas.profundo += etapa.minutos;
    else if (tipo.includes("REM")) etapas.rem += etapa.minutos;
    else if (tipo.includes("AWAKE") || tipo.includes("WAKE")) etapas.despierto += etapa.minutos;
    else etapas.ligero += etapa.minutos;
  }
  return etapas;
}

// porcentaje de una etapa respecto del total de la noche
function porcentaje(minutos: number, total: number) {
  if (total === 0) return 0;
  return Math.round((minutos / total) * 100);
}

// pantalla de detalle: la última noche por etapas (hoy) o las horas de cada noche (semana y mes)
export default function DetalleSueno() {
  const { usuario } = useAuth();
  const [periodo, setPeriodo] = useState("hoy");
  const [suenos, setSuenos] = useState<Medicion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sinAdulto, setSinAdulto] = useState(false);
  const dias = diasDelPeriodo(periodo);

  useEffect(() => {
    if (!usuario) return;
    const actual = usuario;

    // trae las noches del período (en "Hoy" se busca en 7 días, por si anoche no durmió con la pulsera)
    const cargar = async () => {
      setError(null);
      try {
        const id = await idDelAdultoQueSeMira(actual);
        if (!id) {
          setSinAdulto(true);
          return;
        }
        const desde = new Date(Date.now() - Math.max(7, dias) * DIA_MS).toISOString();
        setSuenos(await medicionesService.getMediciones(id, "SUENO", desde));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos de sueño.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario, dias]);

  const esHoy = periodo === "hoy";

  // ---------- última noche ----------
  const ultima = suenos.length > 0 ? suenos[0] : null;
  let etapas: Etapas = { profundo: 0, rem: 0, ligero: 0, despierto: 0 };
  let horaDespertar = "";
  let dormido = 0;
  if (ultima) {
    etapas = etapasDeLaNoche(ultima);
    horaDespertar = hora(new Date(ultima.timestamp).getTime() + ultima.valor * 60000);
    dormido = ultima.valor - etapas.despierto;
  }
  const tieneEtapas = etapas.profundo + etapas.rem + etapas.ligero + etapas.despierto > 0;
  const total = ultima ? ultima.valor : 0;

  // ---------- varias noches (semana y mes), de la más vieja a la más nueva ----------
  const noches = [...suenos].reverse();
  let suma = 0;
  let masLarga: Medicion | null = null;
  let masCorta: Medicion | null = null;
  for (const noche of noches) {
    suma += noche.valor;
    if (!masLarga || noche.valor > masLarga.valor) masLarga = noche;
    if (!masCorta || noche.valor < masCorta.valor) masCorta = noche;
  }
  const promedio = noches.length > 0 ? Math.round(suma / noches.length) : 0;
  const maximo = masLarga ? masLarga.valor : 0;

  // texto de "Lo que vemos"
  let loQueVemos = "";
  if (esHoy && ultima) {
    loQueVemos = `La última noche fueron ${horasYMinutos(dormido)} de sueño, de ${hora(ultima.timestamp)} a ${horaDespertar} hs.`;
    if (tieneEtapas) {
      loQueVemos += ` El sueño profundo fue el ${porcentaje(etapas.profundo, total)} % de la noche y hubo ${etapas.despierto} min despierto.`;
    }
  }
  if (!esHoy && noches.length > 0) {
    loQueVemos = `En ${noches.length} noches registradas, el promedio fue de ${horasYMinutos(promedio)} por noche.`;
  }

  return (
    <PantallaDetalleSigno
      titulo="Descanso y sueño"
      periodo={periodo}
      onCambiarPeriodo={setPeriodo}
      cargando={cargando}
      error={error}
      sinAdulto={sinAdulto}
      loQueVemos={loQueVemos}
    >
      <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-xs" aria-label="Gráfico de sueño">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <LuMoon aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#E0F0FF] p-2 text-[#0B5FFF]" />
            Descanso y sueño
          </h2>
          <p className="text-xs text-[#424656]">{esHoy ? "Noche anterior" : `Últimos ${dias} días`}</p>
        </div>

        {!ultima && (
          <p className="py-8 text-center text-sm text-[#424656]">
            Todavía no hay registros de sueño. La pulsera los registra cuando la persona duerme con ella puesta.
          </p>
        )}

        {esHoy && ultima && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-4xl font-bold">{horasYMinutos(dormido)}</p>
              {dormido >= SUENO_REPARADOR && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#84F6E6]/30 px-2.5 py-1 text-xs font-bold text-[#006A61]">
                  <MdCheck aria-hidden="true" className="size-3" />
                  Sueño reparador
                </span>
              )}
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#424656]">
              {diaCorto(ultima.timestamp)} · {hora(ultima.timestamp)} a {horaDespertar} hs
            </p>

            {/* el back guarda cuántos minutos hubo de cada etapa (no a qué hora), por eso se muestran como una barra repartida */}
            {tieneEtapas ? (
              <>
                <div role="img" aria-label="Reparto de la noche por etapas" className="flex h-8 w-full overflow-hidden rounded-lg">
                  <div className="bg-[#0B2E8A]" style={{ width: `${porcentaje(etapas.profundo, total)}%` }} />
                  <div className="bg-[#1550E0]" style={{ width: `${porcentaje(etapas.rem, total)}%` }} />
                  <div className="bg-[#B9D2FF]" style={{ width: `${porcentaje(etapas.ligero, total)}%` }} />
                  <div className="bg-[#F5A524]" style={{ width: `${porcentaje(etapas.despierto, total)}%` }} />
                </div>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#424656]">
                  <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#0B2E8A]" />Profundo</li>
                  <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#1550E0]" />REM</li>
                  <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#B9D2FF]" />Ligero</li>
                  <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#F5A524]" />Despierto</li>
                </ul>
              </>
            ) : (
              <p className="text-sm text-[#424656]">Esta noche no trae el detalle de las etapas del sueño.</p>
            )}
          </>
        )}

        {!esHoy && noches.length > 0 && (
          <>
            <p className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{horasYMinutos(promedio)}</span>
              <span className="text-base font-semibold text-[#424656]">por noche</span>
            </p>
            <div role="img" aria-label={`Horas de sueño de cada noche de los últimos ${dias} días`} className="flex h-40 items-end gap-1 border-b border-[#D4E4F3]">
              {noches.map((noche) => (
                <div
                  key={noche.id}
                  title={`${diaCorto(noche.timestamp)}: ${horasYMinutos(noche.valor)}`}
                  className={`min-w-0 flex-1 rounded-t ${noche.valor >= SUENO_REPARADOR ? "bg-[#1550E0]" : "bg-[#B9D2FF]"}`}
                  style={{ height: `${maximo > 0 ? Math.max(2, (noche.valor / maximo) * 100) : 2}%` }}
                />
              ))}
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#424656]">
              <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#1550E0]" />7 h o más</li>
              <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#B9D2FF]" />Menos de 7 h</li>
            </ul>
          </>
        )}
      </section>

      {esHoy && ultima && tieneEtapas && (
        <dl className="grid grid-cols-2 gap-2.5">
          <DatoSigno titulo="Sueño profundo" valor={horasYMinutos(etapas.profundo)} aclaracion={`${porcentaje(etapas.profundo, total)} % de la noche`} />
          <DatoSigno titulo="Sueño REM" valor={horasYMinutos(etapas.rem)} aclaracion={`${porcentaje(etapas.rem, total)} % de la noche`} />
          <DatoSigno titulo="Sueño ligero" valor={horasYMinutos(etapas.ligero)} aclaracion={`${porcentaje(etapas.ligero, total)} % de la noche`} />
          <DatoSigno titulo="Despierto" valor={`${etapas.despierto} min`} aclaracion={`${porcentaje(etapas.despierto, total)} % de la noche`} />
        </dl>
      )}

      {!esHoy && noches.length > 0 && (
        <dl className="grid grid-cols-2 gap-2.5">
          <DatoSigno titulo="Promedio" valor={horasYMinutos(promedio)} aclaracion="por noche" />
          <DatoSigno titulo="Noches registradas" valor={String(noches.length)} aclaracion={`de ${dias} días`} />
          <DatoSigno titulo="Noche más larga" valor={masLarga ? horasYMinutos(masLarga.valor) : "—"} aclaracion={masLarga ? diaCorto(masLarga.timestamp) : undefined} />
          <DatoSigno titulo="Noche más corta" valor={masCorta ? horasYMinutos(masCorta.valor) : "—"} aclaracion={masCorta ? diaCorto(masCorta.timestamp) : undefined} />
        </dl>
      )}
    </PantallaDetalleSigno>
  );
}
