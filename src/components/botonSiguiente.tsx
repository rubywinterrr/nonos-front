import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
interface Props {
  siguientePaso: string;
  texto: string;
}
export default function BotonSiguiente({ siguientePaso, texto }: Props) {
  return (
    <Link
      className="bg-blue-600 font-semibold items-center justify-center flex gap-3 hover:bg-blue-700 active:bg-blue-700 hover:scale-102 active:scale-99 text-white text-lg rounded-2xl w-full min-h-16 px-3 py-2 text-center cursor-pointer"
      to={siguientePaso}
    >
      Siguiente: {texto}
      <MdArrowForward aria-hidden="true" className="text-3xl" />
    </Link>
  );
}
