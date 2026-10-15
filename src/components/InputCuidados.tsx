import { useEffect, useRef } from "react";

interface Props {
  placeholder?: string;
  editable: boolean;
}
export default function InputCuidados({
  placeholder = "Escriba aquí.",
  editable,
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
      className="bg-zinc-100 w-full min-h-25 rounded-tr-xl rounded-br-xl border-l-5 border-[#4A7FBF] p-3 resize-none focus:outline-none read-only:cursor-default"
      placeholder={placeholder}
    />
  );
}
