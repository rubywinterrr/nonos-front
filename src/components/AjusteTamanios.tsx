import { useEffect, useState } from "react";
import { leerTamanioGuardado, aplicarTamanioTexto, type TamanioTexto } from "../utils/tamanioTexto";

export default function AjustesTexto() {
  const [tamaño, setTamaño] = useState<TamanioTexto>(leerTamanioGuardado());

  useEffect(() => {
    aplicarTamanioTexto(tamaño);
  }, [tamaño]);

  return (
    <section aria-labelledby="titulo-tamanio-texto" className="flex w-full flex-col gap-3.5 rounded-3xl bg-white p-5 shadow-sm">
      <h2 id="titulo-tamanio-texto" className="text-2xl font-bold text-[#16222C]">Tamaño de la letra</h2>

      <div role="group" aria-labelledby="titulo-tamanio-texto" className="grid grid-cols-3 gap-2.5 text-center">
        <button
          type="button"
          aria-pressed={tamaño === "normal"}
          onClick={() => setTamaño("normal")}
          className={`flex min-w-0 min-h-22 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 px-1 py-3 transition-colors hover:bg-[#DCE6FA] active:bg-[#CCD9F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${tamaño === "normal" ? "border-[#144BD3] bg-[#E7EDFB] text-[#0E3494]" : "border-[#D7DFE6] bg-[#E9EEF2] text-[#16222C]"}`}
        >
          <span aria-hidden="true" className="text-xl font-bold">Aa</span>
          <span className="text-sm font-semibold">Normal</span>
        </button>

        <button
          type="button"
          aria-pressed={tamaño === "grande"}
          onClick={() => setTamaño("grande")}
          className={`flex min-w-0 min-h-22 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 px-1 py-3 transition-colors hover:bg-[#DCE6FA] active:bg-[#CCD9F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${tamaño === "grande" ? "border-[#144BD3] bg-[#E7EDFB] text-[#0E3494]" : "border-[#D7DFE6] bg-[#E9EEF2] text-[#16222C]"}`}
        >
          <span aria-hidden="true" className="text-2xl font-bold">Aa</span>
          <span className="text-sm font-semibold">Grande</span>
        </button>

        <button
          type="button"
          aria-pressed={tamaño === "muy_grande"}
          onClick={() => setTamaño("muy_grande")}
          className={`flex min-w-0 min-h-22 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 px-1 py-3 transition-colors hover:bg-[#DCE6FA] active:bg-[#CCD9F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${tamaño === "muy_grande" ? "border-[#144BD3] bg-[#E7EDFB] text-[#0E3494]" : "border-[#D7DFE6] bg-[#E9EEF2] text-[#16222C]"}`}
        >
          <span aria-hidden="true" className="text-3xl font-bold">Aa</span>
          <span className="text-sm font-semibold">Muy grande</span>
        </button>
      </div>
    </section>
  );
}
