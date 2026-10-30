import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((current) => !current);
  };

  return (
    <div className="relative w-full">
      <input
        type={visible ? "text" : "password"}
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-12 bg-white shadow placeholder:text-xs focus:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1 pr-10"
        placeholder={placeholder}
        aria-label="Contraseña"
        autoComplete="current-password"
      />
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={toggleVisibility}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
      >
        {visible ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
      </button>
    </div>
  );
}
