import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
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
  const [revealedCharacter, setRevealedCharacter] = useState<{
    index: number;
    character: string;
  } | null>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const nextValue = input.value;
    onChange(nextValue);

    if (revealTimer.current) clearTimeout(revealTimer.current);
    const inputType = (event.nativeEvent as InputEvent).inputType;
    const characterIndex = (input.selectionStart ?? 0) - 1;

    if (inputType.startsWith("insert") && characterIndex >= 0) {
      setRevealedCharacter({
        index: characterIndex,
        character: nextValue[characterIndex],
      });
      revealTimer.current = setTimeout(() => setRevealedCharacter(null), 900);
    } else {
      setRevealedCharacter(null);
    }
  };

  const toggleVisibility = () => {
    if (revealTimer.current) clearTimeout(revealTimer.current);
    setRevealedCharacter(null);
    setVisible((current) => !current);
  };

  const showLatestCharacter = !visible && revealedCharacter !== null;
  const displayValue = showLatestCharacter
    ? Array.from(value, (_, index) =>
        index === revealedCharacter.index ? revealedCharacter.character : "•",
      ).join("")
    : "";

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type={visible ? "text" : "password"}
        value={value}
        required
        onChange={handleChange}
        onScroll={(event) => setScrollLeft(event.currentTarget.scrollLeft)}
        className={`w-full h-12 bg-white shadow placeholder:text-xs focus:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 pl-1 pr-10 font-mono ${showLatestCharacter ? "text-transparent caret-black" : ""}`}
        placeholder={placeholder}
        aria-label="Contraseña"
        autoComplete="current-password"
      />
      {showLatestCharacter && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-1 right-10 flex items-center overflow-hidden whitespace-nowrap font-mono text-base text-black pointer-events-none"
        >
          <span style={{ transform: `translateX(-${scrollLeft}px)` }}>
            {displayValue}
          </span>
        </span>
      )}
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