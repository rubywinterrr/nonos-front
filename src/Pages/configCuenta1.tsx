import {
  MdBadge,
  MdFavorite,
  MdMedicalServices,
  MdOutlineSecurity,
} from "react-icons/md";
import {
  LuArrowRight,
  LuCalendarDays,
  LuCreditCard,
  LuDroplet,
  LuHouse,
  LuLockKeyhole,
} from "react-icons/lu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usuarioService } from "../services/usuariosService";
import type { GrupoSanguineo } from "../services/authService";
import textoGrupoSanguineo from "../utils/textoGrupoSanguineo";

const GRUPOS_SANGUINEOS: GrupoSanguineo[] = [
  "A_POSITIVO",
  "A_NEGATIVO",
  "B_POSITIVO",
  "B_NEGATIVO",
  "AB_POSITIVO",
  "AB_NEGATIVO",
  "O_POSITIVO",
  "O_NEGATIVO",
];

export default function ConfigCuenta1() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  // arrancan con lo que ya tenga guardado el usuario, por si vuelve desde el paso 2
  const [fechaNacimiento, setFechaNacimiento] = useState(usuario?.fechaNacimiento?.slice(0, 10) ?? "");
  const [dni, setDni] = useState(usuario?.dni ? String(usuario.dni) : "");
  const [domicilio, setDomicilio] = useState(usuario?.domicilio ?? "");
  const [grupoSanguineo, setGrupoSanguineo] = useState(usuario?.grupoSanguineo ?? "");
  const [obraSocial, setObraSocial] = useState(usuario?.obraSocial ?? "");
  const [carnet, setCarnet] = useState(usuario?.carnetObraSocial ?? "");
  const [guardando, setGuardando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // guarda los datos personales y la cobertura, y pasa al paso 2
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!usuario) return;
    setGuardando(true);
    setError(null);

    try {
      await usuarioService.actualizarPerfil(usuario.id, {
        fechaNacimiento,
        dni: Number(dni),
        domicilio: domicilio.trim(),
        grupoSanguineo: grupoSanguineo as GrupoSanguineo,
        obraSocial: obraSocial.trim(),
        carnetObraSocial: carnet.trim(),
      });
      navigate("/adulto/configurar-cuenta/2");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudieron guardar tus datos");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="mainBody gap-0">
      <header className="fixed inset-x-0 top-0 z-50 flex h-17 items-center border-b-2 border-gray-200 bg-main-blue px-4">
        <div className="mx-auto flex w-full max-w-lg items-center gap-2">
          <span className="text-xl font-bold">NONOS</span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <section
          aria-label="Progreso de registro"
          className="flex w-full flex-col gap-2 rounded-2xl bg-[#E7EDFB] p-4 shadow-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <strong className="font-bold text-[#0D328B]">Paso 1 de 2</strong>
            <span className="font-semibold text-[#435059]">50% completado</span>
          </div>
          <progress
            value="50"
            max="100"
            aria-label="Progreso de registro"
            className="h-2 w-full overflow-hidden rounded-full accent-[#144BD3] [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-[#D8E3FA] [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-[#144BD3] [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-[#144BD3]"
          />
          <p className="text-base text-[#435059]">
            Tus datos básicos y cobertura médica
          </p>
        </section>

        <section
          aria-labelledby="bienvenida-cuenta"
          className="flex w-full items-start gap-4 rounded-3xl bg-white p-6 shadow-xs"
        >
          <MdFavorite
            aria-hidden="true"
            className="size-14 shrink-0 rounded-2xl bg-[#E7EDFB] p-4 text-[#144BD3]"
          />
          <div className="min-w-0">
            <h1
              id="bienvenida-cuenta"
              className="text-lg font-semibold leading-7"
            >
              ¡Hola! Queremos cuidarte como te merecés
            </h1>
            <p className="mt-1 text-sm leading-6 text-[#435059]">
              Completá estos primeros datos para que tu familia y médicos sepan
              cómo asistirte si lo necesitás.
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6 pt-1">
          <section
            aria-labelledby="datos-personales"
            className="flex w-full flex-col gap-4 rounded-3xl bg-white p-6 shadow-xs"
          >
            <h2
              id="datos-personales"
              className="flex items-center gap-2 pb-1 text-xl font-semibold"
            >
              <MdBadge
                aria-hidden="true"
                className="size-6 shrink-0 text-[#144BD3]"
              />
              Datos Personales
            </h2>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="fecha-nacimiento"
                className="flex flex-wrap items-baseline gap-x-2 text-base font-bold"
              >
                Fecha de nacimiento{" "}
                <span aria-hidden="true" className="text-red-600">
                  *
                </span>{" "}
                <span className="text-sm font-normal text-[#435059]">
                  (Día / Mes / Año)
                </span>
              </label>
              <div className="relative flex min-h-14 items-center rounded-2xl bg-[#E7EDFB] inset-shadow-sm">
                <LuCalendarDays
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 size-5 text-[#144BD3]"
                />
                <input
                  id="fecha-nacimiento"
                  required
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  placeholder="Ej: 15 / 08 / 1948"
                  className="min-h-14 w-full rounded-2xl bg-transparent pr-4 pl-14 text-lg text-[#435059] placeholder:text-[#435059] focus-visible:outline-2 focus-visible:outline-[#144BD3]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="dni" className="text-base font-bold">
                Número de Documento (DNI){" "}
                <span aria-hidden="true" className="text-red-600">
                  *
                </span>
              </label>
              <div className="relative flex min-h-14 items-center rounded-2xl bg-[#E7EDFB] inset-shadow-sm">
                <LuCreditCard
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 size-5 text-[#144BD3]"
                />
                <input
                  id="dni"
                  required
                  type="number"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="Ej: 6.840.120"
                  className="min-h-14 w-full rounded-2xl bg-transparent pr-4 pl-14 text-lg text-[#435059] placeholder:text-[#435059] focus-visible:outline-2 focus-visible:outline-[#144BD3]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="domicilio" className="text-base font-bold">
                Domicilio particular{" "}
                <span aria-hidden="true" className="text-red-600">
                  *
                </span>
              </label>
              <div className="relative flex min-h-14 items-center rounded-2xl bg-[#E7EDFB] inset-shadow-sm">
                <LuHouse
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 size-5 text-[#144BD3]"
                />
                <input
                  id="domicilio"
                  required
                  type="text"
                  maxLength={200}
                  value={domicilio}
                  onChange={(e) => setDomicilio(e.target.value)}
                  placeholder="Calle, número y localidad..."
                  className="min-h-14 w-full rounded-2xl bg-transparent pr-4 pl-14 text-lg text-[#435059] placeholder:text-[#435059] focus-visible:outline-2 focus-visible:outline-[#144BD3]"
                />
              </div>
            </div>
          </section>

          <section
            aria-labelledby="salud-cobertura"
            className="flex w-full flex-col gap-4 rounded-3xl bg-white p-6 shadow-xs"
          >
            <h2
              id="salud-cobertura"
              className="flex items-center gap-2 pb-1 text-xl font-semibold"
            >
              <MdMedicalServices
                aria-hidden="true"
                className="size-6 shrink-0 text-[#144BD3]"
              />
              Salud y Cobertura
            </h2>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="grupo-sanguineo"
                className="max-w-48 text-base font-bold leading-6"
              >
                Grupo sanguíneo y factor{" "}
                <span aria-hidden="true" className="text-red-600">
                  *
                </span>
              </label>
              <div className="relative flex min-h-14 items-center rounded-2xl bg-[#E7EDFB] inset-shadow-sm">
                <LuDroplet
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 size-5 text-[#144BD3]"
                />
                {/* el back solo acepta estos 8 valores, por eso es una lista y no texto libre */}
                <select
                  id="grupo-sanguineo"
                  required
                  value={grupoSanguineo}
                  onChange={(e) => setGrupoSanguineo(e.target.value)}
                  className="min-h-14 w-full cursor-pointer rounded-2xl bg-transparent pr-4 pl-14 text-lg text-[#435059] focus-visible:outline-2 focus-visible:outline-[#144BD3]"
                >
                  <option value="" disabled>
                    Elegí una opción
                  </option>
                  {GRUPOS_SANGUINEOS.map((grupo) => (
                    <option key={grupo} value={grupo}>
                      {textoGrupoSanguineo(grupo)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              <label htmlFor="cobertura" className="text-base font-bold">
                Obra Social o Prepaga{" "}
                <span aria-hidden="true" className="text-red-600">
                  *
                </span>
              </label>
              <input
                id="cobertura"
                required
                type="text"
                maxLength={100}
                value={obraSocial}
                onChange={(e) => setObraSocial(e.target.value)}
                placeholder="Escribí tu cobertura médica..."
                className="min-h-14 w-full rounded-2xl bg-[#E7EDFB] px-4 text-lg text-[#435059] inset-shadow-sm placeholder:text-[#435059] focus-visible:outline-2 focus-visible:outline-[#144BD3]"
              />
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              <label htmlFor="credencial" className="text-base font-bold">
                Número de carnet / credencial{" "}
                <span aria-hidden="true" className="text-red-600">
                  *
                </span>
              </label>
              <div className="relative flex min-h-14 items-center rounded-2xl bg-[#E7EDFB] inset-shadow-sm">
                <LuCreditCard
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 size-5 text-[#144BD3]"
                />
                <input
                  id="credencial"
                  required
                  type="text"
                  inputMode="numeric"
                  maxLength={50}
                  value={carnet}
                  onChange={(e) => setCarnet(e.target.value)}
                  placeholder="Número en tu credencial..."
                  className="min-h-14 w-full rounded-2xl bg-transparent pr-4 pl-14 text-lg text-[#435059] placeholder:text-[#435059] focus-visible:outline-2 focus-visible:outline-[#144BD3]"
                />
              </div>
            </div>
          </section>

          <aside className="flex w-full items-center gap-4 rounded-3xl bg-[#E7EDFB] p-4 shadow-xs">
            <MdOutlineSecurity
              aria-hidden="true"
              className="size-12 shrink-0 rounded-full bg-[#E8FAF1] p-3 text-[#007B46]"
            />
            <div className="min-w-0">
              <h2 className="text-xl font-bold leading-6">100% Confidencial</h2>
              <p className="text-sm leading-5 text-[#435059]">
                Tus datos médicos se guardan de forma segura para emergencias y
                consultas de confianza.
              </p>
            </div>
          </aside>

          <div className="flex w-full flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={guardando}
              className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-[#B7C8F0] bg-[#144BD3] px-3 text-lg font-bold text-white shadow-md hover:bg-[#0D3EBA] active:bg-[#0A328F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D328B] disabled:cursor-wait disabled:opacity-60"
            >
              {guardando ? "Guardando..." : "Siguiente: Alergias y salud"}
              <LuArrowRight aria-hidden="true" className="size-5 shrink-0" />
            </button>
            {error && (
              <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">
                {error}
              </p>
            )}
            <p className="flex items-center justify-center gap-3 py-2 text-sm font-semibold text-[#435059]">
              <LuLockKeyhole
                aria-hidden="true"
                className="size-4 shrink-0 text-[#144BD3]"
              />
              Tus datos están protegidos
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
