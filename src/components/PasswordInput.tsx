import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  // nombre para lectores de pantalla, cuando hay más de una contraseña en la pantalla
  etiqueta?: string;
  autoComplete?: string;
  id?: string;
  descripcion?: string;
  invalida?: boolean;
  autoFocus?: boolean;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  etiqueta = "Contraseña",
  autoComplete = "current-password",
  id,
  descripcion,
  invalida,
  autoFocus,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((current) => !current);
  };

  return (
    <div className="relative w-full">
      <input
        id={id}
        name={autoComplete}
        type={visible ? "text" : "password"}
        value={value}
        required
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-12 bg-white shadow placeholder:text-xs focus:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1 pr-12"
        placeholder={placeholder}
        aria-label={id ? undefined : etiqueta}
        aria-describedby={descripcion}
        aria-invalid={invalida || undefined}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center text-gray-600 hover:text-black rounded"
        aria-label={`Mostrar ${etiqueta.toLowerCase()}`}
        aria-controls={id}
        aria-pressed={visible}
      >
        {visible ? <MdVisibilityOff aria-hidden="true" size={20} /> : <MdVisibility aria-hidden="true" size={20} />}
      </button>
    </div>
  );
}
