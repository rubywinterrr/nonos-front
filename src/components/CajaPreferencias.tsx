import InputCuidados from "./InputCuidados";
import { MdOutlineEdit, MdOutlinePeopleAlt } from "react-icons/md";
//import { BsHouse } from "react-icons/bs";
import { useState } from "react";

interface Props {
  placeholder?: string,
  titulo: string,
  value: string,
  onChange: (texto: string) => void,
}
export default function CajaPreferencias({
  placeholder = "Escriba aquí.",
  titulo,
  value,
  onChange,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <>
      <div className="bg-white border border-gray-200 flex flex-col gap-5 p-5 rounded-2xl w-full">
        <div className="w-full flex gap-3 items-center justify-start">
          <MdOutlinePeopleAlt className="p-2 bg-white border border-gray-200 rounded-xl text-5xl" />
          <h1 className="text-lg max-w-80/100 font-semibold">
            {titulo}
          </h1>
        </div>
        <InputCuidados
          editable={isEditing}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          onClick={() => setIsEditing((editing) => !editing)}
          className="bg-[#E9EEF6] font-medium cursor-pointer hover:bg-gray-200 active:bg-gray-300 rounded-lg w-full flex items-center justify-center gap-3 p-5 text-xl"
        >
          <MdOutlineEdit className="text-2xl" />
          {isEditing ? "Finalizar edición" : "Editar indicación"}
        </button>
      </div>
    </>
  );
}
