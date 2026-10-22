import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { useAuth } from "../hooks/useAuth";

export default function PagCuenta() {
  const { logout } = useAuth();

  return (
    <>
      <main className="mainBody">
        <Header />
        <VueltaAtras titulo="Mi Cuenta" />
        <div className="bg-white rounded-2xl flex flex-col gap-5 p-5 w-full min-h-50">
          <div className="flex">
            <div className="flex flex-col items-start justify-center">
              <h1 className="font-semibold text-lg">Username</h1>
              <p>Edad y Adulto Mayor</p>
            </div>
          </div>
        </div>
      </main>

      <button
        onClick={logout}
        className="mt-6 bg-red-600 text-white font-semibold rounded-xl px-6 py-3 cursor-pointer"
      >
        Cerrar sesión
      </button>
    </>
  );
}
