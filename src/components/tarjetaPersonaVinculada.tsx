import { Link } from "react-router-dom";
interface Props {
  nombre: string;
  ocupacion: string;
}
export default function PersonaVinculada({ nombre, ocupacion }: Props) {
    // inicial del nombre para el círculo; "Dr" si el nombre empieza con "Dr"
  function PrimeraLetra() {
    if (!nombre) return "?";
    if (nombre.slice(0, 2).toLowerCase() === "dr") return "Dr";
    return nombre[0].toUpperCase();
  }

  return (
    <div className="bg-blue-50/80 w-full p-3 rounded-2xl min-h-25 border border-slate-300 flex items-center justify-between">
      <div className="flex items-center justify-center gap-3">
        <h1 className="font-bold text-blue-600 text-2xl h-14 w-14 flex items-center justify-center rounded-full bg-blue-100">
          {PrimeraLetra()}
        </h1>
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-xl">{nombre}</h1>
          <p className="text-gray-600">{ocupacion}</p>
        </div>
      </div>
      <Link to={"./administrar-vinculo"} className="text-blue-600 font-semibold text-lg bg-white rounded-xl p-2 border border-slate-300 cursor-pointer hover:bg-gray-100 active:bg-gray-200">
        Administrar
      </Link>
    </div>
  );
}
