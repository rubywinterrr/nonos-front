import { MdOutlineHealthAndSafety } from "react-icons/md";

// encabezado de las pantallas sin login (las del médico): solo el nombre de la app, sin acceso a la cuenta
export default function HeaderPublico() {
  return (
    <header className="fixed top-0 left-1/2 z-50 flex min-h-[6vh] w-full -translate-x-1/2 items-center border-b-2 border-gray-200 bg-main-blue p-3 py-4">
      <p className="flex items-center gap-3 text-2xl font-bold lg:text-3xl">
        <MdOutlineHealthAndSafety aria-hidden="true" className="text-4xl lg:text-5xl" />
        NONOS
      </p>
    </header>
  );
}
