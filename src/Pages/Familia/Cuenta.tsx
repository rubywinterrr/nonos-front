import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { useAuth } from "../../hooks/useAuth";
import calcularEdad from "../../utils/calcularEdad";
import {
  LuChevronRight,
  LuFingerprint,
  LuGlobe,
  LuLockKeyhole,
  LuLogOut,
  LuMail,
  LuPencil,
  LuPhone,
  LuUsersRound,
} from "react-icons/lu";

export default function CuentaFamilia() {
  const { usuario, logout } = useAuth();

  return (
    <main className="mainBody">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Mi cuenta" compacto />

        <section
          aria-label="Datos de la cuenta"
          className="w-full rounded-2xl border border-[#D7DFE6] bg-white p-4 shadow-xs"
        >
          <div className="flex items-center gap-3 border-b border-[#D7DFE6] pb-4">
            <img
              src={usuario?.fotoUrl || "/sofia-gomez-cuenta.png"}
              alt="Foto de perfil de Sofía"
              className="size-12 shrink-0 rounded-full bg-[#E7EDFB] object-cover"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold leading-6">
                  {usuario?.nombreCompleto || "Sofía Gómez"}
                </h2>
                <span className="rounded-full border border-[#BAEDD3] bg-[#E8FAF1] px-2 py-0.5 text-xs font-bold text-[#0B4C2B]">
                  Titular
                </span>
              </div>
              <p className="text-xs font-semibold leading-4 text-[#1550E0]">
                {usuario?.fechaNacimiento
                  ? `${calcularEdad(usuario.fechaNacimiento)} años`
                  : "42 años"}{" "}
                · Hija
              </p>
            </div>
          </div>
          <div className="space-y-2.5 pt-3">
            <div className="flex items-start gap-2.5">
              <LuMail
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-[#1550E0]"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase leading-4 text-[#435059]">
                  Correo electrónico
                </p>
                <p className="break-all text-sm font-semibold leading-5">
                  {usuario?.email || "sofia.gomez1972@gmail.com"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <LuPhone
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-[#1550E0]"
              />
              <div>
                <p className="text-xs font-semibold uppercase leading-4 text-[#435059]">
                  Teléfono vinculado
                </p>
                <p className="text-sm font-semibold leading-5">
                  {usuario?.telefono || "+54 11 4455-8899"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="adultos-vinculados"
          className="flex w-full flex-col gap-4"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id="adultos-vinculados"
              className="flex items-center gap-2 text-base font-bold leading-5"
            >
              <LuUsersRound
                aria-hidden="true"
                className="size-5 shrink-0 text-[#1550E0]"
              />
              <span>
                Adultos mayores
                <br />
                vinculados
              </span>
            </h2>
            <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#435059]">
              1 asignado
            </span>
          </div>
          <article className="w-full rounded-2xl border border-[#D7DFE6] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#D7DFE6] pb-4">
              <img
                src="/jose-perez-cuenta.png"
                alt="Foto de José Pérez"
                className="size-12 shrink-0 rounded-full bg-[#E7EDFB] object-cover"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold leading-6">José Pérez</h3>
                  <span className="rounded-full border border-[#BAEDD3] bg-[#E8FAF1] px-2 py-0.5 text-xs font-bold text-[#0B4C2B]">
                    Titular
                  </span>
                </div>
                <p className="text-xs font-semibold leading-4 text-[#1550E0]">
                  78 años · Adulto Mayor
                </p>
              </div>
            </div>
            <div className="space-y-2.5 pt-3">
              <div className="flex items-start gap-2.5">
                <LuMail
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-[#1550E0]"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase leading-4 text-[#435059]">
                    Correo electrónico
                  </p>
                  <p className="break-all text-sm font-semibold leading-5">
                    jose.perez1946@gmail.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <LuPhone
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-[#1550E0]"
                />
                <div>
                  <p className="text-xs font-semibold uppercase leading-4 text-[#435059]">
                    Teléfono vinculado
                  </p>
                  <p className="text-sm font-semibold leading-5">
                    +54 11 4455-8899
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section
          aria-labelledby="seguridad-familia"
          className="flex w-full flex-col gap-3 rounded-2xl border border-[#D7DFE6] bg-white p-4 shadow-xs"
        >
          <h2
            id="seguridad-familia"
            className="flex items-center gap-1.5 text-sm font-bold leading-5"
          >
            <LuLockKeyhole
              aria-hidden="true"
              className="size-4 text-[#1550E0]"
            />{" "}
            Seguridad y acceso rápido
          </h2>
          <article className="rounded-xl bg-[#E9EEF2] p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold">Contraseña de acceso</h3>
              <span className="rounded border border-[#D7DFE6] bg-white px-2 py-0.5 text-xs text-[#435059]">
                Hace 3 meses
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#1550E0]">
              Puedes cambiar tu contraseña o solicitar asistencia si no la
              recuerdas con claridad.
            </p>
            <button
              type="button"
              className="mt-2 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#9DAFBE] bg-white px-3 text-xs font-bold text-[#1550E0] hover:bg-[#E7EDFB] active:border-[#1550E0] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            >
              <LuPencil aria-hidden="true" className="size-4" /> Restablecer mi
              contraseña
            </button>
          </article>
          <div className="flex items-center gap-3 rounded-xl border border-[#B7C8F0] bg-[#E7EDFB] p-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1550E0]">
              <LuFingerprint aria-hidden="true" className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold">
                Acceso rápido con Huella o PIN
              </p>
              <p className="text-xs text-[#1550E0]">
                Ingresa sin escribir la contraseña
              </p>
            </div>
            <span
              aria-label="Activado"
              className="flex h-6 w-10 shrink-0 items-center justify-end rounded-full bg-[#1550E0] p-0.5"
            >
              <span className="size-5 rounded-full bg-white" />
            </span>
          </div>
        </section>

        <button
          type="button"
          className="flex min-h-12 w-full cursor-pointer items-center justify-between rounded-2xl border border-[#D7DFE6] bg-white px-4 text-xs hover:bg-[#E9EEF2] active:bg-[#D7DFE6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
        >
          <span className="flex items-center gap-2 font-semibold">
            <LuGlobe aria-hidden="true" className="size-4" /> Idioma
          </span>
          <span className="flex items-center gap-1 text-[#435059]">
            Español{" "}
            <LuChevronRight
              aria-hidden="true"
              className="size-4 text-[#1550E0]"
            />
          </span>
        </button>
        <div className="flex flex-col items-center gap-3 pb-4">
          <button
            type="button"
            onClick={logout}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#F6D4BE] bg-[#FFF1E6] px-4 text-lg font-bold text-[#9A3E00] hover:bg-[#FFE6D4] active:border-[#1550E0] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
          >
            <LuLogOut aria-hidden="true" className="size-5" /> Cerrar sesión
          </button>
          <p className="text-center text-xs font-medium text-[#0D328B]">
            NONOS v2.4.1 — Cuenta protegida y cifrada
          </p>
        </div>
      </div>
    </main>
  );
}
