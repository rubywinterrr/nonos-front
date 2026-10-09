import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
interface Prop {
  titulo?: string;
}

export default function VueltaAtras({ titulo = "NONOS"}: Prop) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 pb-4">
      <FaArrowLeft
        className="rounded-xl bg-gray-100 w-15 h-15 lg:w-18 lg:h-18 p-4 cursor-pointer hover:bg-gray-300"
        onClick={() => navigate(-1)}
      />
      <div>
        <h2 className="text-lg lg:text-xl font-semibold text-gray-500">
          FICHA DE CONSULTA
        </h2>
        <h1 className="font-semibold text-2xl lg:text-3xl">{titulo}</h1>
      </div>
    </div>
  );
}
