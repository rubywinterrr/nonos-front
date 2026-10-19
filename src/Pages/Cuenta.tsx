import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";

export default function PagCuenta() {
  const { logout } = useAuth();

  return (
    <>
      <Header></Header>
      <main className="w-screen min-h-main bg-main-blue flex flex-col justify-center items-center">
        <h1 className="text-4xl font-extrabold">Cuenta</h1>
        {/* provisorio hasta que esté el diseño de la pantalla de cuenta */}
        <button
          onClick={logout}
          className="mt-6 bg-red-600 text-white font-semibold rounded-xl px-6 py-3 cursor-pointer"
        >
          Cerrar sesión
        </button>
      </main>
    </>
  );
}
