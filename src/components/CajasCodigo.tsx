import { useState } from "react";

interface Props {
  codigo: string;
  onChange: (codigo: string) => void;
  conError?: boolean;
  descripcion?: string;
}

// Un solo campo permite editar, pegar y autocompletar el código entero.
// Las seis cajas representan el valor y la posición del cursor del campo nativo.
export default function CajasCodigo({ codigo, onChange, conError, descripcion }: Props) {
  const [seleccion, setSeleccion] = useState<[number, number]>([0, 0]);

  return (
    <div className="group relative mx-auto w-full max-w-82 rounded-xl focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[#0A2666]">
      <div aria-hidden="true" className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {Array.from({ length: 6 }, (_, i) => {
          const [inicio, fin] = seleccion;
          const activo = inicio === fin ? i === Math.min(inicio, 5) : i >= inicio && i < fin;
          return (
            <span
              key={i}
              className={`flex min-h-16 items-center justify-center rounded-xl border-2 bg-white text-2xl font-bold ${conError ? "border-[#C92A2A] text-[#A92323]" : "border-[#667780] text-[#16222C]"} ${activo ? "group-focus-within:bg-[#E7EDFB] group-focus-within:border-[#1550E0]" : ""}`}
            >
              {codigo[i]}
            </span>
          );
        })}
      </div>
      <input
        className="absolute inset-0 size-full cursor-text opacity-0"
        id="codigo-medico"
        name="codigo"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-invalid={conError || undefined}
        aria-describedby={descripcion}
        required
        value={codigo}
        onChange={(evento) => onChange(evento.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
        onSelect={(evento) => {
          const campo = evento.currentTarget;
          setSeleccion([campo.selectionStart ?? 0, campo.selectionEnd ?? 0]);
        }}
        onClick={(evento) => {
          const campo = evento.currentTarget;
          if (campo.selectionStart !== campo.selectionEnd || evento.detail > 1) return;
          const { left, width } = campo.getBoundingClientRect();
          const posicion = Math.min(codigo.length, Math.max(0, Math.floor((evento.clientX - left) * 6 / width)));
          campo.setSelectionRange(posicion, posicion);
          setSeleccion([posicion, posicion]);
        }}
      />
    </div>
  );
}
