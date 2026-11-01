interface Props {
  // dónde apunta el globo, en % del ancho y del alto del gráfico (0 a 100)
  izquierda: number;
  arriba: number;
  // texto grande ("88 lpm") y texto chico ("11:15 hs")
  titulo: string;
  detalle: string;
}

// globo oscuro que aparece sobre un punto o una barra del gráfico al tocarlo (componente "Gráfico" del Figma).
// Va adentro de un contenedor con "relative"; la flechita apunta al dato
export default function GloboGrafico({ izquierda, arriba, titulo, detalle }: Props) {
  // cerca de los bordes el globo se corre para adentro, así no se corta
  let correr = "-translate-x-1/2";
  let flecha = "left-1/2 -translate-x-1/2";
  if (izquierda < 20) {
    correr = "-translate-x-4";
    flecha = "left-3";
  }
  if (izquierda > 80) {
    correr = "-translate-x-[calc(100%-1rem)]";
    flecha = "right-3";
  }

  return (
    <div
      role="status"
      className={`pointer-events-none absolute z-10 -translate-y-[calc(100%+12px)] ${correr}`}
      style={{ left: `${izquierda}%`, top: `${arriba}%` }}
    >
      <div className="relative whitespace-nowrap rounded-lg bg-[#16222C] px-3 py-1.5 text-white shadow-md">
        <p className="text-base font-bold leading-5">{titulo}</p>
        <p className="text-xs leading-4 text-[#D4E4F3]">{detalle}</p>
        <span aria-hidden="true" className={`absolute -bottom-1.5 size-3 rotate-45 bg-[#16222C] ${flecha}`} />
      </div>
    </div>
  );
}
