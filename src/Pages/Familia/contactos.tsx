import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import TarjetaContactos from "../../components/TarjetaContacto";
import {
  LuArrowLeft,
  LuAsterisk,
  LuBriefcaseMedical,
  LuCirclePlus,
  LuCheck,
  LuInfo,
  LuMail,
  LuPhone,
  LuShield,
  LuShieldCheck,
  LuStethoscope,
  LuUserRound,
  LuUserRoundCog,
  LuUsersRound,
  LuX,
  LuZap,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService, type AdultoMayorVinculado, type Vinculo } from "../../services/usuariosService";
import { contactosService, type Contacto } from "../../services/contactosService";
import { buscarAdultoSeleccionado } from "../../utils/adultoQueSeMira";
import calcularEdad from "../../utils/calcularEdad";

// texto del vínculo de alguien de la red
// PENDIENTE BACK: el vínculo no guarda el parentesco ("Hija", "Hijo"), por eso va el rol
function textoRol(vinculo: Vinculo) {
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
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensajeInvitacion, setMensajeInvitacion] = useState<string | null>(null);

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
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los contactos.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario]);

  // la red sin mí y solo con quienes tienen teléfono (la tarjeta necesita un número para llamar)
  const red = ordenarRed(vinculos).filter((v) => v.familiar.telefono && v.familiarId !== usuario?.id);
  const cantidadActivos = red.length + contactos.length;
  const nombreAdulto = adulto ? adulto.nombreCompleto : "";
  const primerNombre = nombreAdulto.split(" ")[0];

  const dialogoInvitacion = useRef<HTMLDialogElement>(null);
  const [cerrandoInvitacion, setCerrandoInvitacion] = useState(false);
  const [invitacionAbierta, setInvitacionAbierta] = useState(false);
  const [rol, setRol] = useState<"familiar" | "cuidador" | "profesional">("familiar");
  const [alertasInmediatas, setAlertasInmediatas] = useState(true);

  const abrirInvitacion = () => {
    setMensajeInvitacion(null);
    setCerrandoInvitacion(false);
    setInvitacionAbierta(true);
    dialogoInvitacion.current?.showModal();
  };

  const cerrarInvitacion = () => {
    if (!dialogoInvitacion.current?.open || cerrandoInvitacion) return;
    setCerrandoInvitacion(true);
  };

  const finalizarCierreInvitacion = () => {
    dialogoInvitacion.current?.close();
    setCerrandoInvitacion(false);
    setInvitacionAbierta(false);
  };

  useEffect(() => {
    if (!invitacionAbierta) return;

    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflowOriginal;
    };
  }, [invitacionAbierta]);

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
              {/* HARDCODEADO: número fijo de Figma */}
              <a
                href="tel:107"
                className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C92A2A] px-4 text-xl font-bold text-white hover:bg-[#AF2424] active:bg-[#8C1D1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C92A2A]"
              >
                <LuPhone aria-hidden="true" className="size-5 shrink-0" />
                Llamar al 107
              </a>
              {/* PENDIENTE BACK: no hay dato de la guardia u hospital del adulto, queda la del diseño */}
              <div className="flex flex-col gap-1 pt-2">
                <p className="text-sm font-semibold leading-5">
                  Guardia San Cayetano
                </p>
                <div className="flex items-end justify-between gap-2">
                  <p className="min-w-0 text-sm leading-5 text-[#435059]">
                    +54 11 4788-9900
                  </p>
                  {/* HARDCODEADO: número fijo de Figma (Guardia San Cayetano) */}
                  <a
                    href="tel:+541147889900"
                    className="flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg border border-transparent bg-[#E7EDFB] px-3 text-sm font-semibold text-[#0D328B] hover:bg-[#D3E0F8] active:border-[#1550E0] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
                  >
                    <LuPhone
                      aria-hidden="true"
                      className="size-4 text-[#AD4A00]"
                    />
                    Llamar
                  </a>
                </div>
              </div>
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
                // PENDIENTE BACK: falta el horario del cuidador ("En domicilio de 8 a 14 hs")
                />
              ))}
              {contactos.map((contacto) => (
                <TarjetaContactos
                  key={contacto.id}
                  variante="familia"
                  nombre={contacto.nombre}
                  vinculo={contacto.esEmergencia ? "Contacto de emergencia" : "Contacto agendado"}
                  telefono={contacto.telefono}
                />
              ))}
              {/* PENDIENTE BACK: no hay dato del médico de cabecera ("Dr. Esteban Martínez") */}
            </div>
          </section>

          <div className="flex w-full flex-col gap-2">
            <button
              type="button"
              onClick={abrirInvitacion}
              className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#B7C8F0] bg-[#1550E0] px-4 font-semibold text-white shadow-md hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            >
              <LuCirclePlus aria-hidden="true" className="size-5 shrink-0" />
              Invitar miembro a la red
            </button>
            <p className="flex items-center justify-center gap-2 text-sm leading-5 text-[#435059]">
              <LuShield aria-hidden="true" className="size-4 shrink-0" />
              Red protegida y sincronizada en tiempo real
            </p>
          </div>
        </div>
      </main>
      <dialog
        ref={dialogoInvitacion}
        onCancel={(event) => {
          event.preventDefault();
          cerrarInvitacion();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) cerrarInvitacion();
        }}
        onAnimationEnd={(event) => {
          if (cerrandoInvitacion && event.animationName === "popup-bajar") {
            finalizarCierreInvitacion();
          }
        }}
        aria-labelledby="titulo-invitar-miembro"
        className={`fixed top-auto bottom-0 left-1/2 z-70 m-0 h-90/100 max-h-dvh w-93/100 max-w-lg -translate-x-1/2 overflow-hidden rounded-t-3xl border-0 bg-white p-0 text-[#16222C] shadow-2xl backdrop:bg-[#B7C8F0]/70 ${cerrandoInvitacion ? "animate-[popup-bajar_250ms_ease-in_forwards]" : "animate-[popup-subir_300ms_ease-out]"}`}
      >
        <div className="flex h-full flex-col">
          <div className="shrink-0 px-4 pt-3 pb-4">
            <button
              type="button"
              aria-label="Cerrar invitación"
              onClick={cerrarInvitacion}
              className="mx-auto mb-4 block h-1.5 w-12 cursor-pointer rounded-full bg-[#D7DFE6] hover:bg-[#B7C8F0] active:bg-[#8EA9D4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            />
            <div className="flex items-center justify-between gap-3">
              <h2 id="titulo-invitar-miembro" className="text-xl font-bold leading-7">
                Invitar miembro a la red
              </h2>
              <button
                type="button"
                aria-label="Cerrar invitación"
                onClick={cerrarInvitacion}
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#E7EDFB] text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
              >
                <LuX aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto px-4 pb-6">
            <div className="flex items-center gap-3 rounded-xl bg-[#EAF4FE] p-3">
              {adulto?.fotoUrl ? (
                <img
                  src={adulto.fotoUrl}
                  alt={nombreAdulto}
                  className="size-14 shrink-0 rounded-full object-cover"
                />
              ) : (
                <LuUserRound aria-hidden="true" className="size-14 shrink-0 rounded-full bg-[#D6E8FF] p-3 text-[#1550E0]" />
              )}
              <div className="min-w-0">
                <span className="inline-block rounded-full bg-[#CCFAF5] px-2 py-1 text-xs font-bold uppercase leading-4 text-[#006C67]">
                  Rol de acompañamiento
                </span>
                <p className="mt-1 font-bold leading-5">{nombreAdulto}</p>
                {/* PENDIENTE BACK: el vínculo no guarda el parentesco, por ahora "Papá" queda fijo */}
                <p className="text-sm leading-5 text-[#435059]">Papá{adulto?.fechaNacimiento && ` · ${calcularEdad(adulto.fechaNacimiento)} años`}</p>
              </div>
            </div>

            <label className="block text-sm font-semibold leading-5" htmlFor="nombre-invitado">
              Nombre completo y apellido
            </label>
            <input
              id="nombre-invitado"
              type="text"
              placeholder="Ej: Nombre Apellido"
              className="-mt-3 h-12 w-full rounded-lg border border-[#D7DFE6] bg-white px-3 text-sm outline-none placeholder:text-[#77848F] focus:border-[#1550E0] focus:ring-2 focus:ring-[#B7C8F0]"
            />

            <fieldset className="space-y-2">
              <legend className="mb-3 text-sm font-semibold leading-5">Elegí el rol</legend>
              <button
                type="button"
                aria-pressed={rol === "familiar"}
                onClick={() => setRol("familiar")}
                className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3 text-left hover:bg-[#DCEAF9] active:bg-[#C5D9F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${rol === "familiar" ? "border-[#1550E0] bg-[#EAF4FE]" : "border-transparent bg-[#EAF4FE]"}`}
              >
                <LuUserRound aria-hidden="true" className="size-10 shrink-0 rounded-lg bg-[#D6E8FF] p-2 text-[#1550E0]" />
                <span className="flex-1">
                  <span className="block font-semibold leading-5">Familiar directo</span>
                  <span className="mt-1 block text-sm leading-5 text-[#435059]">Acceso total a decisiones y contactos directos.</span>
                </span>
                <span className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${rol === "familiar" ? "border-[#1550E0] bg-[#1550E0] text-white" : "border-[#9DAFC2]"}`}>
                  {rol === "familiar" && <LuCheck aria-hidden="true" className="size-3" />}
                </span>
              </button>
              <button
                type="button"
                aria-pressed={rol === "cuidador"}
                onClick={() => setRol("cuidador")}
                className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3 text-left hover:bg-[#DCEAF9] active:bg-[#C5D9F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${rol === "cuidador" ? "border-[#1550E0] bg-[#EAF4FE]" : "border-transparent bg-[#EAF4FE]"}`}
              >
                <LuUserRoundCog aria-hidden="true" className="size-10 shrink-0 rounded-lg bg-[#D6E8FF] p-2 text-[#1550E0]" />
                <span className="flex-1">
                  <span className="block font-semibold leading-5">Cuidador</span>
                  <span className="mt-1 block text-sm leading-5 text-[#435059]">Control de turnos domiciliarios, registro diario y tomas de medicación.</span>
                </span>
                <span className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${rol === "cuidador" ? "border-[#1550E0] bg-[#1550E0] text-white" : "border-[#9DAFC2]"}`}>
                  {rol === "cuidador" && <LuCheck aria-hidden="true" className="size-3" />}
                </span>
              </button>
              <button
                type="button"
                aria-pressed={rol === "profesional"}
                onClick={() => setRol("profesional")}
                className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3 text-left hover:bg-[#DCEAF9] active:bg-[#C5D9F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${rol === "profesional" ? "border-[#1550E0] bg-[#EAF4FE]" : "border-transparent bg-[#EAF4FE]"}`}
              >
                <LuStethoscope aria-hidden="true" className="size-10 shrink-0 rounded-lg bg-[#D6E8FF] p-2 text-[#1550E0]" />
                <span className="flex-1">
                  <span className="block font-semibold leading-5">Profesional de la salud</span>
                  <span className="mt-1 block text-sm leading-5 text-[#435059]">Vista de historial clínico y recetas.</span>
                </span>
                <span className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${rol === "profesional" ? "border-[#1550E0] bg-[#1550E0] text-white" : "border-[#9DAFC2]"}`}>
                  {rol === "profesional" && <LuCheck aria-hidden="true" className="size-3" />}
                </span>
              </button>
            </fieldset>

            <div>
              <label className="block text-sm font-semibold leading-5" htmlFor="rol-especifico">
                Rol específico
              </label>
              <input
                id="rol-especifico"
                type="text"
                placeholder="Hija menor (coordinación)"
                className="mt-2 h-12 w-full rounded-lg border border-[#D7DFE6] bg-white px-3 text-sm outline-none placeholder:text-[#77848F] focus:border-[#1550E0] focus:ring-2 focus:ring-[#B7C8F0]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold leading-5" htmlFor="telefono-invitado">
                Número de teléfono
              </label>
              <div className="mt-2 flex h-12 items-center gap-2 rounded-lg border border-[#D7DFE6] bg-white px-3 focus-within:border-[#1550E0] focus-within:ring-2 focus-within:ring-[#B7C8F0]">
                <span aria-label="Argentina" role="img" className="text-xl">🇦🇷</span>
                <input
                  id="telefono-invitado"
                  type="tel"
                  placeholder="Ej: +54 9 11 4490-2211"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#77848F]"
                />
              </div>
            </div>

            <button
              type="button"
              role="checkbox"
              aria-checked={alertasInmediatas}
              onClick={() => setAlertasInmediatas(!alertasInmediatas)}
              className="flex w-full cursor-pointer items-start gap-3 rounded-xl bg-[#EAF4FE] p-3 text-left hover:bg-[#DCEAF9] active:bg-[#C5D9F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            >
              <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 ${alertasInmediatas ? "border-[#1550E0] bg-[#1550E0] text-white" : "border-[#9DAFC2] bg-white"}`}>
                {alertasInmediatas && <LuCheck aria-hidden="true" className="size-3.5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold leading-5">Alertas inmediatas</span>
                  <span className="rounded-full bg-[#FFE0DF] px-2 py-0.5 text-xs font-bold uppercase text-[#A32828]">Prioridad 1</span>
                </span>
                <span className="mt-1 block text-sm leading-5 text-[#435059]">
                  Recibirá llamadas y notificaciones ante pulsaciones del botón de auxilio o escaneos del código QR de emergencia.
                </span>
              </span>
            </button>

            <p className="flex items-start gap-2 rounded-xl bg-[#E8FAF1] p-3 text-sm leading-5 text-[#006F49]">
              <LuShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
              Se enviará una invitación directa con enlace temporal cifrado para sincronizar el perfil a {primerNombre}.
            </p>

            {mensajeInvitacion && (
              <p role="status" className="rounded-xl bg-[#FFF4E5] p-3 text-sm font-semibold leading-5 text-[#8A4B00]">{mensajeInvitacion}</p>
            )}
            <div className="space-y-2 pt-1">
              {/* PENDIENTE BACK: un familiar solo puede invitar a un adulto mayor para vincularse él mismo;
                no hay forma de que invite a otra persona a la red del adulto. El formulario tampoco tiene campo de mail */}
              <button
                type="button"
                onClick={() => setMensajeInvitacion(`Por ahora solo ${primerNombre} puede invitar personas a su red, desde su app.`)}
                className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
              >
                <LuMail aria-hidden="true" className="size-5" />
                Enviar invitación por Mail
              </button>
              <button
                type="button"
                onClick={cerrarInvitacion}
                className="min-h-12 w-full cursor-pointer rounded-xl bg-[#E7EDFB] px-4 font-semibold text-[#1550E0] hover:bg-[#D3E0F8] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
              >
                Descartar y volver
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}