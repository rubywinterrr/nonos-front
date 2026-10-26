import { useEffect, useRef } from "react";

interface Props {
  placeholder?: string;
  editable: boolean;
  value: string;
  onChange: (texto: string) => void;
}
export default function InputCuidados({
  placeholder = "Escriba aquí.",
  editable,
  value,
  onChange,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editable) {
      textareaRef.current?.focus();
    }
  }, [editable]);

  return (
    <textarea
      ref={textareaRef}
      readOnly={!editable}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-100 w-full min-h-25 rounded-tr-xl rounded-br-xl border-l-5 border-[#4A7FBF] p-3 resize-none focus:outline-none read-only:cursor-default"
      placeholder={placeholder}
    />
  );
}
