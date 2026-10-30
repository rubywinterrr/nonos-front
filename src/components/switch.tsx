interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  mostrarEstado?: boolean;
}

export default function Switch({
  checked = true,
  onChange,
  mostrarEstado = false,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={`relative flex h-7 w-13 cursor-pointer rounded-full p-0.5 ease-in-out focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      {mostrarEstado && (
        <span
          aria-hidden="true"
          className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold ${
            checked ? "left-2 text-white" : "right-2 text-[#435059]"
          }`}
        >
          {checked ? "SÍ" : "NO"}
        </span>
      )}
      <span
        className={`pointer-events-none h-6 w-6 transform rounded-full bg-white shadow ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
