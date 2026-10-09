import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";

export default function AjustesTexto() {
  const [tamaño, setTamaño] = useState<"normal" | "grande" | "muy_grande">(
    "grande",
  );

  useEffect(() => {
    if (tamaño === "normal") {
      document.documentElement.style.fontSize = "15px";
    } else if (tamaño === "grande") {
      document.documentElement.style.fontSize = "16px";
    } else if (tamaño === "muy_grande") {
      document.documentElement.style.fontSize = "17px";
    }
  }, [tamaño]);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 w-full border border-gray-100">
      <div className="flex gap-4 items-center mb-6">
        <div className="bg-[#EEF4FF] text-blue-600 rounded-2xl w-16 h-16 flex items-center justify-center text-3xl font-bold border border-blue-100">
          Aa
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1A202C]">
            Tamaño del texto
          </h2>
          <p className="text-gray-500 text-lg">Elegí el tamaño más cómodo.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => setTamaño("normal")}
          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
            tamaño === "normal"
              ? "border-blue-600 bg-[#EEF4FF] text-blue-600"
              : "border-gray-200 text-[#1A202C] hover:bg-gray-50"
          }`}
        >
          <span className="text-lg font-medium mb-1">A</span>
          <span className="font-bold">Normal</span>
        </button>

        <button
          onClick={() => setTamaño("grande")}
          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
            tamaño === "grande"
              ? "border-blue-600 bg-[#EEF4FF] text-blue-600"
              : "border-gray-200 text-[#1A202C] hover:bg-gray-50"
          }`}
        >
          <span className="text-xl font-bold mb-1 flex items-center gap-1">
            A {tamaño === "grande"}
          </span>
          <span className="font-bold">Grande</span>
        </button>

        <button
          onClick={() => setTamaño("muy_grande")}
          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
            tamaño === "muy_grande"
              ? "border-blue-600 bg-[#EEF4FF] text-blue-600"
              : "border-gray-200 text-[#1A202C] hover:bg-gray-50"
          }`}
        >
          <span className="text-2xl font-black mb-1">A</span>
          <span className="font-bold">Muy grande</span>
        </button>
      </div>

      <div className="text-blue-600 text-lg flex items-center gap-2 font-medium">
        <FaCheck />
        <p>
          Tamaño seleccionado:{" "}
          <span className="capitalize">{tamaño.replace("_", " ")}</span>
          {tamaño === "grande" && " (recomendado)"}
        </p>
      </div>
    </div>
  );
}
