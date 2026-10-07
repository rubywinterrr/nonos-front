import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
export default function BotonSiguiente({siguientePaso, texto}) {
  return (
    <Link
      className="bg-blue-600 font-semibold items-center justify-center flex gap-3 hover:bg-blue-700 active:bg-blue-700 hover:scale-102 active:scale-99 text-white text-xl rounded-2xl w-full h-16 cursor-pointer"
      to={siguientePaso}
    >
      Siguiente: {texto}
      <MdArrowForward className="text-3xl" />
    </Link>
  );
}
