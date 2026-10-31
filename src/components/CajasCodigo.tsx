import { useRef } from "react";

interface Props {
  digitos: string[];
  onChange: (digitos: string[]) => void;
  conError?: boolean;
}

// las 6 cajitas del código ("482 - 219"): escribir pasa a la siguiente, borrar vuelve a la anterior,
// y pegar el código completo lo reparte en las 6
export default function CajasCodigo({ digitos, onChange, conError = false }: Props) {
  const cajas = useRef<(HTMLInputElement | null)[]>([]);

  // escribe un número en la caja i y pasa a la siguiente
  const escribir = (i: number, valor: string) => {
    const soloNumero = valor.replace(/\D/g, "");
    // si pegaron varios números, se reparten desde esta caja
    if (soloNumero.length > 1) {
      const nuevos = [...digitos];
      for (let j = 0; j < soloNumero.length && i + j < 6; j++) {
        nuevos[i + j] = soloNumero[j];
      }
      onChange(nuevos);
      const ultima = Math.min(i + soloNumero.length, 5);
      cajas.current[ultima]?.focus();
      return;
    }
    const nuevos = [...digitos];
    nuevos[i] = soloNumero;
    onChange(nuevos);
    if (soloNumero && i < 5) cajas.current[i + 1]?.focus();
  };

  // con la caja vacía, borrar vuelve a la anterior
  const borrar = (i: number, tecla: string) => {
    if (tecla === "Backspace" && digitos[i] === "" && i > 0) {
      cajas.current[i - 1]?.focus();
    }
  };

  const colores = conError
    ? "border-[#C92A2A] text-[#C92A2A]"
    : "border-[#77848F] text-[#16222C] focus:border-[#1550E0]";

  return (
    <div className="flex items-center justify-center gap-2">
      {digitos.map((digito, i) => (
        <div key={i} className="flex items-center gap-2">
          {i === 3 && <span aria-hidden="true" className="text-2xl font-bold text-[#16222C]">-</span>}
          <input
            ref={(elemento) => {
              cajas.current[i] = elemento;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label={`Dígito ${i + 1} de 6`}
            value={digito}
            onChange={(evento) => escribir(i, evento.target.value)}
            onKeyDown={(evento) => borrar(i, evento.key)}
            className={`h-16 w-12 rounded-xl border-2 bg-white text-center text-2xl font-bold outline-none focus:ring-2 focus:ring-[#B7C8F0] ${colores}`}
          />
        </div>
      ))}
    </div>
  );
}
