interface Props {
  titulo: string;
  valor: string;
  aclaracion?: string;
}

// tarjetita celeste de las pantallas de detalle: "Mínimo · 64 lpm · 04:30 hs"
export default function DatoSigno({ titulo, valor, aclaracion }: Props) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 rounded-2xl bg-[#EBF5FF] p-3.5">
      <dt className="text-xs text-[#424656]">{titulo}</dt>
      <dd className="text-xl font-bold">{valor}</dd>
      {aclaracion && <dd className="text-xs text-[#424656]">{aclaracion}</dd>}
    </div>
  );
}
