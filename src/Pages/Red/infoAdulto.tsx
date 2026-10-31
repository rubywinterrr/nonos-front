import { useEffect, useState } from "react";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import CondicionMedica from "../../components/CondicionMedica";
import ContactoVinculado from "../../components/ContactoVinculado";
import {
  LuActivity,
  LuShieldAlert,
  LuUserRound,
  LuUsersRound,
} from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService, type AdultoMayorVinculado, type UsuarioById, type Vinculo } from "../../services/usuariosService";
import { condicionesService, type Condicion } from "../../services/condicionesService";
import type { GrupoSanguineo } from "../../services/authService";
import { buscarAdultoSeleccionado } from "../../utils/adultoQueSeMira";
import calcularEdad from "../../utils/calcularEdad";

// grupo sanguíneo como en el diseño: "0 Positivo (0+)"
function grupoSanguineoLargo(grupo: GrupoSanguineo | null) {
  if (!grupo) return "Sin dato";
  const [letra, factor] = grupo.split("_");
  if (factor === "POSITIVO") return `${letra} Positivo (${letra}+)`;
  return `${letra} Negativo (${letra}−)`;
}

// fecha de nacimiento como "12/05/1946" (el back la guarda a las 00:00 UTC, por eso se lee en UTC)
function fechaNacimiento(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
}

// rol de alguien de la red: "Familiar · Contacto prioritario", "Cuidador presencial"...
// PENDIENTE BACK: falta el parentesco ("Hija") y los horarios del cuidador ("Lun a Vie 8:00 a 14:00")
function textoRelacion(vinculo: Vinculo) {
  let rol = "Cuidador presencial";
  if (vinculo.tipoVinculo === "FAMILIAR") rol = "Familiar";
  else if (vinculo.tipoCuidador === "DIGITAL") rol = "Cuidador digital";
  if (vinculo.esContactoEmergencia) return `${rol} · Contacto prioritario`;
  return rol;
}

// es una alergia si el nombre de la condición dice "alergia" o "alérgico"
// PENDIENTE BACK: no hay un campo aparte para alergias
function esAlergia(condicion: Condicion) {
  const nombre = condicion.nombre.toLowerCase();
  return nombre.includes("alergi") || nombre.includes("alérgi");
}

// pantalla del familiar/cuidador: la ficha del adulto vinculado que mira
export default function InfoAdulto() {
  const { usuario } = useAuth();
  const [adulto, setAdulto] = useState<AdultoMayorVinculado | null>(null);
  const [datos, setDatos] = useState<UsuarioById | null>(null);
  const [condiciones, setCondiciones] = useState<Condicion[]>([]);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    const miId = usuario.id;

    // trae los datos completos, las condiciones médicas y la red del adulto
    const cargar = async () => {
      try {
        const elegido = await buscarAdultoSeleccionado(miId);
        setAdulto(elegido);
        if (!elegido) return;
        setDatos(await usuarioService.getUsuarioById(elegido.id));
        setCondiciones(await condicionesService.getCondiciones(elegido.id));
        setVinculos(await usuarioService.getVinculos(elegido.id));
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información del adulto.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario]);

  const alergias = condiciones.filter((c) => esAlergia(c));
  const otrasCondiciones = condiciones.filter((c) => !esAlergia(c));

  if (!adulto) {
    return (
      <main className="mainBody gap-4">
        <Header />
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
          <VueltaAtras titulo="Información del adulto" compacto />
          {cargando && <p className="text-center text-sm text-[#435059]">Cargando…</p>}
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
          {!cargando && !error && <p className="rounded-2xl bg-white p-5 text-sm">Todavía no estás vinculado a ningún adulto mayor.</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="mainBody gap-4">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Información del adulto" compacto />

        <section
          aria-label={`Información personal de ${adulto.nombreCompleto}`}
          className="rounded-2xl bg-white p-5 shadow-xs"
        >
          <div className="flex items-center gap-4">
            {adulto.fotoUrl ? (
              <img
                src={adulto.fotoUrl}
                alt={adulto.nombreCompleto}
                className="size-16 shrink-0 rounded-full border-2 border-[#B7C8F0] object-cover"
              />
            ) : (
              <LuUserRound aria-hidden="true" className="size-16 shrink-0 rounded-full border-2 border-[#B7C8F0] bg-[#E7EDFB] p-3 text-[#1550E0]" />
            )}
            <div>
              <h2 className="text-xl font-bold leading-7">{adulto.nombreCompleto}</h2>
              {/* PENDIENTE BACK: el vínculo no guarda el parentesco, por ahora "Papá" queda fijo */}
              <p className="text-base font-semibold leading-6 text-[#435059]">
                Papá{adulto.fechaNacimiento && ` · ${calcularEdad(adulto.fechaNacimiento)} años`}
              </p>
            </div>
          </div>
          <dl className="mt-5 overflow-hidden rounded-xl border border-[#B7C8F0] bg-[#E7EDFB]">
            <div className="border-b border-[#B7C8F0] p-3">
              <dt className="text-xs leading-4 text-[#435059]">
                Documento (DNI)
              </dt>
              <dd className="text-sm font-semibold leading-5">{datos?.dni ? datos.dni.toLocaleString("es-AR") : "Sin dato"}</dd>
            </div>
            <div className="border-b border-[#B7C8F0] p-3">
              <dt className="text-xs leading-4 text-[#435059]">Nacimiento</dt>
              <dd className="text-sm font-semibold leading-5">{datos?.fechaNacimiento ? fechaNacimiento(datos.fechaNacimiento) : "Sin dato"}</dd>
            </div>
            <div className="border-b border-[#B7C8F0] p-3">
              <dt className="text-xs leading-4 text-[#435059]">
                Grupo y Factor
              </dt>
              <dd className="text-sm font-semibold leading-5">
                {grupoSanguineoLargo(datos ? datos.grupoSanguineo : null)}
              </dd>
            </div>
            <div className="border-b border-[#B7C8F0] p-3">
              <dt className="text-xs leading-4 text-[#435059]">
                Domicilio particular
              </dt>
              <dd className="text-sm font-semibold leading-5">
                {datos?.domicilio || "Sin dato"}
              </dd>
            </div>
            <div className="p-3">
              <dt className="text-xs leading-4 text-[#435059]">
                Cobertura médica
              </dt>
              <dd className="text-sm font-semibold leading-5">
                {datos?.obraSocial || "Sin dato"}
                {datos?.carnetObraSocial && ` (N° ${datos.carnetObraSocial})`}
              </dd>
              {/* PENDIENTE BACK: no hay dato del plan, queda el texto del diseño */}
              <dd className="text-xs leading-4 text-[#435059]">
                Plan Médico de Cabecera asignado
              </dd>
            </div>
          </dl>
        </section>

        {alergias.length > 0 && (
          <aside
            aria-label="Alerta médica crítica"
            className="rounded-lg border-2 border-[#D73B3E] bg-[#FFE9E7] p-3"
          >
            <div className="flex items-center gap-2 text-[#A92323]">
              <LuShieldAlert aria-hidden="true" className="size-5 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase leading-4">
                  Registro crítico
                </p>
                <h2 className="text-sm font-bold leading-5">
                  ¡ALERGIA CONFIRMADA!
                </h2>
              </div>
            </div>
            {alergias.map((alergia) => (
              <div key={alergia.id} className="mt-3 rounded-lg border border-[#F1C8C5] bg-white p-3 text-xs leading-4 text-[#A92323]">
                <p className="font-semibold">
                  {alergia.nombre}
                </p>
                {alergia.descripcion && (
                  <p className="mt-2">
                    {alergia.descripcion}
                  </p>
                )}
              </div>
            ))}
          </aside>
        )}

        <section
          aria-labelledby="condiciones-medicas"
          className="rounded-2xl bg-white p-4 shadow-xs"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id="condiciones-medicas"
              className="flex items-center gap-2 text-lg font-semibold leading-6"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#E7EDFB] text-[#1550E0]">
                <LuActivity aria-hidden="true" className="size-4" />
              </span>
              Condiciones Médicas
            </h2>
            <span className="rounded-full border border-[#D7DFE6] bg-white px-2 py-0.5 text-xs font-semibold">
              {otrasCondiciones.length} {otrasCondiciones.length === 1 ? "activa" : "activas"}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {otrasCondiciones.length === 0 && (
              <p className="text-xs leading-4 text-[#435059]">No tiene condiciones cargadas.</p>
            )}
            {otrasCondiciones.map((condicion) => (
              <CondicionMedica
                key={condicion.id}
                icono={<LuActivity aria-hidden="true" className="size-4" />}
                titulo={condicion.nombre}
                // PENDIENTE BACK: la condición no tiene estado ("Bajo control")
                estado=""
                descripcion={condicion.descripcion || ""}
              />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="personas-vinculadas"
          className="rounded-2xl bg-white p-4 shadow-xs"
        >
          <h2
            id="personas-vinculadas"
            className="flex items-center gap-2 text-lg font-semibold leading-6"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#E7EDFB] text-[#1550E0]">
              <LuUsersRound aria-hidden="true" className="size-4" />
            </span>
            Red de Personas Vinculadas
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {vinculos.length === 0 && (
              <p className="text-xs leading-4 text-[#435059]">No tiene personas vinculadas.</p>
            )}
            {vinculos.map((vinculo) => (
              <ContactoVinculado
                key={vinculo.id}
                nombre={vinculo.familiar.nombreCompleto}
                relacion={textoRelacion(vinculo)}
                telefono={vinculo.familiar.telefono}
              />
            ))}
            {/* PENDIENTE BACK: no hay dato del médico de cabecera ("Dr. Esteban Martínez") */}
          </div>
        </section>
      </div>
    </main>
  );
}
