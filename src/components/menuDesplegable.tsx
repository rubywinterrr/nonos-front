import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { LuUserRoundPlus } from "react-icons/lu";
import { HiDeviceTablet, HiCheck, HiOutlineShieldCheck } from "react-icons/hi2";
import { MdOutlineHealthAndSafety, MdFamilyRestroom } from "react-icons/md";

export default function Desplegable() {
  const [isOpen, setIsOpen] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [error, setError] = useState("");

  const opciones = [
    {
      id: "familiar",
      titulo: "Familiar",
      descripcion: "Avisos de bienestar y alertas de emergencia",
      icono: <MdFamilyRestroom className="text-2xl text-blue-700" />,
    },
    {
      id: "fisico",
      titulo: "Cuidador físico",
      descripcion: "Control del adulto mayor y registro de actividad",
      icono: <MdOutlineHealthAndSafety className="text-2xl text-[#2c3e50]" />,
    },
    {
      id: "digital",
      titulo: "Cuidador digital",
      descripcion: "Control de medicación y registro de NONOS",
      icono: <HiDeviceTablet className="text-2xl text-[#2c3e50]" />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!rolSeleccionado) {
      setError("Por favor, selecciona un rol para continuar.");
      return;
    }

  };

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <div
        className="bg-white rounded-2xl w-full min-h-40 p-5 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-3">
          <LuUserRoundPlus className="size-14 text-blue-700 bg-indigo-100 p-3 rounded-2xl" />
          <div className="max-w-70/100 flex flex-col gap-1">
            <h1 className="font-semibold text-xl">
              Invitar a un nuevo acompañante
            </h1>
            <p className="text-gray-600 text-lg">
              Le llegará un enlace por correo electrónico para vincularse.
            </p>
          </div>
        </div>
        {isOpen ? (
          <IoIosArrowDown className="text-5xl " />
        ) : (
          <IoIosArrowDown className="text-5xl -rotate-90" />
        )}
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full items-center mt-1">
          <div className="flex flex-col gap-1.5 w-full">
            <label
              htmlFor="email"
              className="text-base font-medium text-slate-900"
            >
              Correo electrónico de la persona
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="ej: familiar@correo.com"
              className="w-full rounded-2xl bg-white h-14 px-4 text-slate-800 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-base shadow-sm"
            />
          </div>

          <div className="w-95/100 mt-1">
            <h2 className="text-xl font-medium text-slate-900 mb-2.5 select-none">
              Elegí que rol tendrá:
            </h2>

            <div className="flex flex-col gap-2.5 items-center">
              {opciones.map((opcion) => {
                const isSelected = rolSeleccionado === opcion.id;
                return (
                  <div
                    key={opcion.id}
                    onClick={() => {
                      setRolSeleccionado(opcion.id);
                      setError("");
                    }}
                    className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer w-full transition-all duration-200 border-2 select-none ${
                      isSelected
                        ? "bg-[#e4ebfe] border-[#1d5eff]"
                        : "bg-white border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center ${
                          isSelected ? "bg-blue-100/80" : "bg-slate-100"
                        }`}
                      >
                        {opcion.icono}
                      </div>

                      <div>
                        <h3
                          className={`font-bold text-base leading-snug ${
                            isSelected ? "text-[#1d5eff]" : "text-slate-900"
                          }`}
                        >
                          {opcion.titulo}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {opcion.descripcion}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#1a62ff] text-white"
                          : "bg-slate-200/80"
                      }`}
                    >
                      {isSelected && <HiCheck className="text-sm stroke-2" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-95/100 bg-[#1a62ff] text-xl cursor-pointer hover:bg-blue-700 active:scale-[0.99] text-white font-medium py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm mt-2 border-0"
          >
            <HiCheck className="text-2xl stroke-2" /> Enviar invitación
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <p className="text-start text-slate-800 font-medium flex items-center justify-start gap-0 mt-1">
            <HiOutlineShieldCheck className="size-6" />
            Podés retirar el acceso en cualquier momento
          </p>
        </form>
      )}
    </div>
  );
}