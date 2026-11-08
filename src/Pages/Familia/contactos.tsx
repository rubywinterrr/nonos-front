import { useEffect, useState } from "react";
import Header from "../../components/Header";
import TarjetaContactos from "../../components/TarjetaContacto";
import GestionContactos from "../../components/GestionContactos";
import {
  LuArrowLeft,
  LuAsterisk,
  LuBriefcaseMedical,
  LuInfo,
  LuPhone,
  LuShield,
  LuUsersRound,
  LuZap,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService, type AdultoMayorVinculado, type UsuarioById, type Vinculo } from "../../services/usuariosService";
import { contactosService, type Contacto } from "../../services/contactosService";
import { buscarAdultoSeleccionado } from "../../utils/adultoQueSeMira";

// texto del vínculo de alguien de la red
// si no hay parentesco ("Hija", "Hijo") va el rol
function textoRol(vinculo: Vinculo) {
  if (vinculo.parentesco) return vinculo.parentesco;
  if (vinculo.tipoVinculo === "FAMILIAR") return "Familiar";
  if (vinculo.tipoCuidador === "DIGITAL") return "Cuidador digital";
  return "Cuidador en domicilio";
}

// etiqueta de prioridad: el primero es "Principal", después "Prioridad 2", "Prioridad 3"...
function textoPrioridad(posicion: number) {
  if (posicion === 0) return "Principal";
  return `Prioridad ${posicion + 1}`;
}

// ordena la red: primero los contactos de emergencia según su prioridad, después el resto
function ordenarRed(vinculos: Vinculo[]) {
  const deEmergencia = vinculos.filter((v) => v.esContactoEmergencia);
  deEmergencia.sort((a, b) => (a.prioridadContacto ?? 99) - (b.prioridadContacto ?? 99));
  const resto = vinculos.filter((v) => !v.esContactoEmergencia);
  return [...deEmergencia, ...resto];
}

// pantalla del familiar/cuidador: a quién llamar por el adulto vinculado que mira
export default function ContactosFamilia() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [adulto, setAdulto] = useState<AdultoMayorVinculado | null>(null);
  // sanatorio y médico de cabecera del adulto
  const [datosAdulto, setDatosAdulto] = useState<UsuarioById | null>(null);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // se suma 1 después de agregar, editar o borrar un contacto, para volver a cargar
  const [recargar, setRecargar] = useState(0);

  useEffect(() => {
    if (!usuario) return;
    const miId = usuario.id;

    // trae la red de personas del adulto y los contactos que él agendó
    const cargar = async () => {
      try {
        const elegido = await buscarAdultoSeleccionado(miId);
        setAdulto(elegido);
        if (!elegido) return;
        setVinculos(await usuarioService.getVinculos(elegido.id));
        setContactos(await contactosService.getContactos(elegido.id));
        setDatosAdulto(await usuarioService.getUsuarioById(elegido.id));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los contactos.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario, recargar]);

  // la red sin mí y solo con quienes tienen teléfono (la tarjeta necesita un número para llamar)
  const red = ordenarRed(vinculos).filter((v) => v.familiar.telefono && v.familiarId !== usuario?.id);
  const cantidadActivos = red.length + contactos.length;
  const nombreAdulto = adulto ? adulto.nombreCompleto : "";
  const primerNombre = nombreAdulto.split(" ")[0];

  return (
    <>
      <main className="mainBody gap-0">
        <Header />
        <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Volver"
              onClick={() => navigate(-1)}
              className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-[#E9EEF2] hover:bg-[#DAE5EE] active:border-[#1550E0] active:bg-[#CADAE9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            >
              <LuArrowLeft aria-hidden="true" className="size-6" />
            </button>
            <div>
              <p className="text-sm font-semibold uppercase leading-5 tracking-wide text-[#435059]">
                Ficha de consulta
              </p>
              <h1 className="w-fit border-b-2 border-[#D7DFE6] text-2xl font-bold leading-7">
                Contactos
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-7">
            <p className="text-sm leading-5 text-[#435059]">
              Canales de comunicación directa con la red activa y servicios de
              auxilio de {nombreAdulto}.
            </p>
            <aside className="flex items-start gap-4 rounded-xl border border-[#D7DFE6] bg-white p-4">
              <LuInfo
                aria-hidden="true"
                className="size-10 shrink-0 rounded-lg border border-[#B7C8F0] bg-[#E8FAF1] p-2.5 text-[#007B46]"
              />
              <div className="min-w-0">
                <h2 className="text-sm font-semibold leading-5">
                  Protocolo de escalamiento
                </h2>
                <p className="mt-1 max-w-60 text-sm leading-5 text-[#435059]">
                  El orden de prioridad determina a quién llama o notifica primero
                  el sistema cuando {primerNombre} presiona el botón de auxilio.
                </p>
              </div>
            </aside>
          </div>

          <section
            aria-labelledby="servicios-de-auxilio"
            className="flex w-full flex-col gap-4"
          >
            <h2
              id="servicios-de-auxilio"
              className="flex items-center gap-2 text-lg font-semibold leading-6"
            >
              <LuAsterisk
                aria-hidden="true"
                className="size-5 shrink-0 text-[#C92A2A] stroke-3"
              />
              Servicios de Auxilio
            </h2>
            <article className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-xs">
              <div className="flex items-start gap-2">
                <LuBriefcaseMedical
                  aria-hidden="true"
                  className="size-10 shrink-0 rounded-lg bg-[#C92A2A] p-2 text-white"
                />
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold leading-6">
                    107 Ambulancia (SAME)
                  </h3>
                  <span className="mt-1 inline-flex items-center gap-1 rounded bg-[#E7EDFB] px-2 py-0.5 text-sm font-semibold leading-5">
                    <LuZap aria-hidden="true" className="size-3 text-[#1550E0]" />
                    Prioridad
                  </span>
                  <p className="mt-1 text-sm leading-5 text-[#435059]">
                    Línea directa para urgencias
                  </p>
                </div>
              </div>
              {/* 107: número público de emergencias médicas (SAME) */}
              <a
                href="tel:107"
                className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C92A2A] px-4 text-xl font-bold text-white hover:bg-[#AF2424] active:bg-[#8C1D1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C92A2A]"
              >
                <LuPhone aria-hidden="true" className="size-5 shrink-0" />
                Llamar al 107
              </a>
              {/* PENDIENTE BACK: el back manda solo el nombre del sanatorio; falta su teléfono para el número y el botón Llamar del diseño */}
              {datosAdulto?.sanatorioHabitual && (
                <div className="flex flex-col gap-1 pt-2">
                  <p className="text-sm font-semibold leading-5">
                    {datosAdulto.sanatorioHabitual}
                  </p>
                </div>
              )}
            </article>
          </section>

          <section
            aria-labelledby="red-de-personas"
            className="flex w-full flex-col gap-6"
          >
            <div className="flex items-center justify-between gap-2">
              <h2
                id="red-de-personas"
                className="flex items-center gap-2 text-lg font-semibold leading-6"
              >
                <LuUsersRound
                  aria-hidden="true"
                  className="size-5 shrink-0 text-[#1550E0]"
                />
                Red de Personas
              </h2>
              <span className="text-sm font-semibold leading-5 text-[#435059]">
                {cantidadActivos} {cantidadActivos === 1 ? "activo" : "activos"}
              </span>
            </div>
            <div className="flex w-full flex-col gap-4">
              {cargando && <p className="text-center text-sm text-[#435059]">Cargando…</p>}
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
              {!cargando && !adulto && !error && (
                <p className="rounded-xl bg-white p-4 text-sm">Todavía no estás vinculado a ningún adulto mayor.</p>
              )}
              {adulto && !cargando && cantidadActivos === 0 && (
                <p className="rounded-xl bg-white p-4 text-sm">Todavía no hay otras personas con teléfono en su red.</p>
              )}
              {red.map((vinculo, posicion) => (
                <TarjetaContactos
                  key={vinculo.id}
                  variante="familia"
                  nombre={vinculo.familiar.nombreCompleto}
                  vinculo={textoRol(vinculo)}
                  telefono={vinculo.familiar.telefono ?? ""}
                  prioridad={vinculo.esContactoEmergencia ? textoPrioridad(posicion) : undefined}
                  horario={vinculo.horarioCuidador ?? undefined}
                />
              ))}
              {/* la tarjeta necesita un número para llamar, igual que la red */}
              {datosAdulto?.nombreMedicoCabecera && datosAdulto.telefonoMedicoCabecera && (
                <TarjetaContactos
                  variante="familia"
                  esMedico
                  nombre={datosAdulto.nombreMedicoCabecera}
                  vinculo="Médico de cabecera"
                  telefono={datosAdulto.telefonoMedicoCabecera}
                />
              )}
            </div>
          </section>

          {/* agregado (no está en el Figma): los contactos agendados del adulto se gestionan acá */}
          {adulto && (
            <GestionContactos
              adultoId={adulto.id}
              nombreAdulto={adulto.nombreCompleto}
              contactos={contactos}
              onCambio={() => setRecargar(recargar + 1)}
            />
          )}

          <div className="flex w-full flex-col gap-2">
            {/* PENDIENTE BACK: un familiar no puede invitar a otra persona a la red del adulto; solo el adulto puede */}
            {adulto && (
              <p className="rounded-xl bg-white p-4 text-center text-sm font-semibold leading-5 text-[#16222C]">
                Para sumar a alguien, pedile a {primerNombre} que lo invite desde su app.
              </p>
            )}
            <p className="flex items-center justify-center gap-2 text-sm leading-5 text-[#435059]">
              <LuShield aria-hidden="true" className="size-4 shrink-0" />
              Red protegida y sincronizada en tiempo real
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
