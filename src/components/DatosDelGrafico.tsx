interface Props {
  periodo: string;
  medida: string;
  filas: { etiqueta: string; valor: string }[];
}

export default function DatosDelGrafico({ periodo, medida, filas }: Props) {
  return (
    <details className="rounded-xl border border-[#B7C8F0] bg-[#F6F8FA] px-3 text-sm text-[#16222C]">
      <summary className="min-h-11 cursor-pointer py-3 font-bold text-[#0D328B]">
        Ver datos del gráfico
      </summary>
      <table className="w-full table-fixed text-left">
        <caption className="sr-only">{medida} por {periodo.toLowerCase()}</caption>
        <thead>
          <tr>
            <th scope="col" className="p-2">{periodo}</th>
            <th scope="col" className="p-2">{medida}</th>
          </tr>
        </thead>
        <tbody>
          {filas.map(({ etiqueta, valor }, i) => (
            <tr key={i} className="border-t border-[#B7C8F0]">
              <th scope="row" className="break-words p-2 font-normal">{etiqueta}</th>
              <td className="break-words p-2">{valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
