import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService, type Vinculo, type CambiosVinculo } from "../../services/usuariosService";
import {
  MdCheck,
  MdError,
  MdOutlineManageAccounts,
  MdOutlinePermPhoneMsg,
  MdOutlinePersonRemove,
  MdOutlinePhone,
} from "react-icons/md";
import { LuAsterisk, LuCalendar, LuInfo, LuMail, LuPhoneMissed } from "react-icons/lu";

// rol del vínculo como una sola opción: "FAMILIAR", "FISICO" o "DIGITAL"
function rolDeVinculo(vinculo: Vinculo) {
  if (vinculo.tipoVinculo === "FAMILIAR") return "FAMILIAR";
  if (vinculo.tipoCuidador === "DIGITAL") return "DIGITAL";
  return "FISICO";
}

// texto para mostrar cada rol
function textoRol(rol: string) {
  if (rol === "FAMILIAR") return "Familiar";
  if (rol === "DIGITAL") return "Cuidador digital";
  return "Cuidador físico";
}

// pasa la opción elegida a lo que pide el back para actualizar el vínculo
function cambiosDeRol(rol: string) {
  const cambios: CambiosVinculo = { tipoVinculo: "FAMILIAR" };
  if (rol === "FISICO") {
    cambios.tipoVinculo = "CUIDADOR";
    cambios.tipoCuidador = "FISICO";
  }
  if (rol === "DIGITAL") {
    cambios.tipoVinculo = "CUIDADOR";
    cambios.tipoCuidador = "DIGITAL";
  }
  return cambios;
}

const OPCIONES_ROL = ["FAMILIAR", "FISICO", "DIGITAL"];

export default function AdmVinculo() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const familiarId = searchParams.get("familiar");

  const [vinculo, setVinculo] = useState<Vinculo | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // lo que se edita en pantalla (se guarda con "Guardar permisos")
  const [rolElegido, setRolElegido] = useState("FAMILIAR");
  const [esEmergencia, setEsEmergencia] = useState<boolean>(false);
  const [mostrarRoles, setMostrarRoles] = useState<boolean>(false);
  const [guardando, setGuardando] = useState<boolean>(false);

  const [confirmandoDesvincular, setConfirmandoDesvincular] = useState<boolean>(false);
  const [desvinculando, setDesvinculando] = useState<boolean>(false);

  useEffect(() => {
    if (!usuario || !familiarId) return;

    // trae el vínculo con esa persona y arranca los controles con lo guardado
    const cargarVinculo = async () => {
      setCargando(true);
      setError(null);

      try {
        const data = await usuarioService.getVinculo(usuario.id, familiarId);
        setVinculo(data);
        setRolElegido(rolDeVinculo(data));
        setEsEmergencia(data.esContactoEmergencia);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la persona vinculada");
      } finally {
        setCargando(false);
      }
    };

    cargarVinculo();
  }, [usuario, familiarId]);

  // guarda el rol y la llamada prioritaria, solo lo que haya cambiado
  const handleGuardar = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!usuario || !vinculo) return;
    setGuardando(true);
    setError(null);
    setMensaje(null);

    try {
      let actualizado = vinculo;
      if (rolElegido !== rolDeVinculo(vinculo)) {
        actualizado = await usuarioService.actualizarVinculo(usuario.id, vinculo.familiarId, cambiosDeRol(rolElegido));
      }
      if (esEmergencia !== vinculo.esContactoEmergencia) {
        actualizado = await usuarioService.marcarContactoEmergencia(usuario.id, {
          familiarId: vinculo.familiarId,
          esContactoEmergencia: esEmergencia,
        });
      }
      setVinculo(actualizado);
      setMostrarRoles(false);
      setMensaje("Tus cambios se guardaron");
    } catch (err) {
      console.error(err);
      setError("No se pudieron guardar los cambios");
    } finally {
      setGuardando(false);
    }
  };

  // saca a la persona de la red (ya confirmado) y vuelve a ajustes
  const desvincular = async () => {
    if (!usuario || !vinculo) return;
    setDesvinculando(true);
    setError(null);

    try {
      await usuarioService.eliminarVinculo(usuario.id, vinculo.familiarId);
      navigate("/adulto/configuracion");
    } catch (err) {
      console.error(err);
      setError("No se pudo desvincular a esta persona");
      setDesvinculando(false);
    }
  };

  if (!familiarId) {
    return (
      <main className="mainBody">
        <Header />
        <VueltaAtras titulo="Administrar vínculo" />
        <p className="text-red-600">No sabemos a qué persona querés administrar. Volvé a Ajustes y elegila de la lista.</p>
      </main>
    );
  }

  if (!vinculo) {
    return (
      <main className="mainBody">
        <Header />
        <VueltaAtras titulo="Administrar vínculo" />
        {cargando && <p>Cargando persona vinculada...</p>}
        {error && <p className="text-red-600">{error}</p>}
      </main>
    );
  }

  const nombre = vinculo.familiar.nombreCompleto;
  const primerNombre = nombre.split(" ")[0];
  const desde = new Date(vinculo.createdAt).toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  return (
    <main className="mainBody">
      <Header />
      <form onSubmit={handleGuardar} className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Administrar vínculo" />

        {vinculo.esContactoEmergencia && (
          <p className="flex max-w-full items-center justify-center gap-2 self-center rounded-full bg-[#DEE3EB] px-4 py-2 text-base font-semibold tracking-wide text-black">
            <MdError aria-hidden="true" className="size-4 shrink-0" />
            CONTACTO DE EMERGENCIA
          </p>
        )}

        <section aria-labelledby="persona-vinculada" className="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#DBE1FF] text-base text-[#0049CC] inset-shadow-sm">
              {nombre.charAt(0).toUpperCase()}
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <h2 id="persona-vinculada" className="text-xl leading-7 wrap-anywhere">{nombre}</h2>
                <span className="rounded-full bg-[#84F6E6] px-2 py-0.5 text-sm leading-relaxed tracking-wide text-[#007167]">{textoRol(rolDeVinculo(vinculo))}</span>
              </div>
              <p className="text-base leading-relaxed text-[#424656]">
                {vinculo.esContactoEmergencia ? "Contacto de emergencia" : "Persona vinculada"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-lg bg-[#EBF5FF] p-3">
            <p className="flex min-w-0 items-center gap-2 text-base leading-relaxed">
              <MdOutlinePhone aria-hidden="true" className="size-4 shrink-0 text-[#0049CC]" />
              <span>{vinculo.familiar.telefono || "Sin teléfono cargado"}</span>
            </p>
            <p className="flex min-w-0 items-center gap-2 text-base leading-relaxed text-[#424656]">
              <LuMail aria-hidden="true" className="size-4 shrink-0" />
              <span className="min-w-0 wrap-anywhere">{vinculo.familiar.email}</span>
            </p>
          </div>

          <p className="flex items-center gap-2 text-sm leading-relaxed tracking-wide text-[#424656]">
            <LuCalendar aria-hidden="true" className="size-4 shrink-0 text-[#007167]" />
            <span>Vinculada desde {desde}</span>
          </p>
        </section>

        <section aria-labelledby="notificaciones-directas" className="flex w-full flex-col gap-2">
          <h2 id="notificaciones-directas" className="flex items-center gap-2 text-xl leading-7">
            <MdOutlinePermPhoneMsg aria-hidden="true" className="size-6 shrink-0 text-[#0049CC]" />
            Notificaciones directas
          </h2>

          <div className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-xs">
            <div className="flex items-start justify-between gap-2 p-2">
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <LuPhoneMissed aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#007167]" />
                <div className="min-w-0 text-base leading-relaxed">
                  <h3 id="aviso-llamadas" className="font-normal">Aviso si no contestás<br />llamadas</h3>
                  <p id="detalle-llamadas" className="text-[#424656]">Mensaje tras 2 llamadas sin atender</p>
                </div>
              </div>
              {/* HARDCODEADO: el back todavía no tiene este aviso, el interruptor es solo visual */}
              <button
                type="button"
                role="switch"
                aria-checked="true"
                aria-labelledby="aviso-llamadas"
                aria-describedby="detalle-llamadas"
                className="flex h-7 w-12 shrink-0 cursor-pointer items-center justify-end self-center rounded-full bg-[#0049CC] p-1 hover:bg-blue-800 active:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0049CC]"
              >
                <span aria-hidden="true" className="size-5 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            <div className="flex items-start justify-between gap-2 p-2">
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <LuAsterisk aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#AD2B00] stroke-3" />
                <div className="min-w-0 text-base leading-relaxed">
                  <h3 id="llamada-auxilio" className="font-normal">Llamada prioritaria de<br />auxilio</h3>
                  <p id="detalle-auxilio" className="text-[#424656]">Primera en sonar si pulsás<br />botón rojo</p>
                </div>
              </div>
              {/* prendido = es contacto de emergencia (recibe el aviso del SOS) */}
              <button
                type="button"
                role="switch"
                aria-checked={esEmergencia}
                aria-labelledby="llamada-auxilio"
                aria-describedby="detalle-auxilio"
                onClick={() => setEsEmergencia(!esEmergencia)}
                className={`flex h-7 w-12 shrink-0 cursor-pointer items-center self-center rounded-full p-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0049CC] ${esEmergencia ? "justify-end bg-[#0049CC] hover:bg-blue-800 active:bg-blue-900" : "justify-start bg-gray-300 hover:bg-gray-400 active:bg-gray-500"}`}
              >
                <span aria-hidden="true" className="size-5 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>
        </section>

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            aria-expanded={mostrarRoles}
            onClick={() => setMostrarRoles(!mostrarRoles)}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#E0F0FF] px-2 py-3 text-sm leading-relaxed tracking-wide hover:bg-[#D0E6FA] active:bg-[#BFD9F2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0049CC]"
          >
            <MdOutlineManageAccounts aria-hidden="true" className="size-5 shrink-0" />
            <span>Cambiar rol de {primerNombre} (actual: {textoRol(rolDeVinculo(vinculo))})</span>
          </button>

          {mostrarRoles && (
            <fieldset className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-xs">
              <legend className="sr-only">Elegí el nuevo rol</legend>
              {OPCIONES_ROL.map((rol) => (
                <button
                  key={rol}
                  type="button"
                  aria-pressed={rolElegido === rol}
                  onClick={() => setRolElegido(rol)}
                  className={`flex min-h-12 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border-2 px-3 text-base font-semibold hover:bg-[#E3EBF8] active:bg-[#D1E0F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] ${rolElegido === rol ? "border-[#1550E0] bg-[#E9EEF2] text-[#1550E0]" : "border-transparent bg-[#EBF5FF]"}`}
                >
                  {textoRol(rol)}
                  {rolElegido === rol && <MdCheck aria-hidden="true" className="size-5 shrink-0" />}
                </button>
              ))}
            </fieldset>
          )}

          <div className="flex items-start gap-2 rounded-xl bg-[#EBF5FF] p-3">
            <LuInfo aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#AD2B00]" />
            <p className="min-w-0 text-base leading-7 text-[#424656]">Si sacás a {primerNombre} de tu red, ya no podrá ver tu estado ni recibir alertas de auxilio.</p>
          </div>

          {confirmandoDesvincular ? (
            <div className="flex flex-col gap-2 rounded-xl bg-[#FFDAD6]/40 p-3">
              <p className="text-base font-semibold text-[#BA1A1A]">¿Seguro que querés desvincular a {primerNombre}?</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={desvincular}
                  disabled={desvinculando}
                  className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-[#BA1A1A] px-2 text-sm font-semibold text-white hover:bg-[#9C1515] active:bg-[#7F1010] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BA1A1A] disabled:cursor-wait disabled:opacity-60"
                >
                  {desvinculando ? "Desvinculando..." : "Sí, desvincular"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmandoDesvincular(false)}
                  disabled={desvinculando}
                  className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-white px-2 text-sm font-semibold hover:bg-gray-100 active:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0049CC] disabled:opacity-60"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmandoDesvincular(true)}
              className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FFDAD6]/40 px-3 py-3 text-sm leading-relaxed tracking-wide text-[#BA1A1A] hover:bg-[#FFDAD6]/65 active:bg-[#FFDAD6]/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BA1A1A]"
            >
              <MdOutlinePersonRemove aria-hidden="true" className="size-5 shrink-0" />
              Desvincular a {primerNombre}
            </button>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 pb-2">
          <button
            type="submit"
            disabled={guardando}
            className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border-2 border-[#B7C8F0] bg-[#1550E0] px-3 py-3 text-lg font-bold leading-6 tracking-wide text-white shadow-md hover:bg-blue-800 active:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0049CC] disabled:cursor-wait disabled:opacity-60"
          >
            <MdCheck aria-hidden="true" className="size-5 shrink-0" />
            <span>{guardando ? "Guardando..." : `Guardar permisos de ${primerNombre}`}</span>
          </button>
          {error && <p role="alert" className="text-red-600">{error}</p>}
          {mensaje && <p role="status" className="text-green-700">{mensaje}</p>}
        </div>
      </form>
    </main>
  );
}
