import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { HiCheck } from "react-icons/hi2";
import { LuArrowRight, LuChevronRight, LuClock3 } from "react-icons/lu";
import { invitacionesService, type Invitacion } from "../../services/invitacionesService";
import { usuarioService, type PreferenciasNotificacion, type Vinculo } from "../../services/usuariosService";
import { useAuth } from "../../hooks/useAuth";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import AjustesTexto from "../../components/AjusteTamanios";
import Desplegable from "../../components/menuDesplegable";
import Switch from "../../components/switch";

function textoVinculo(vinculo: Vinculo) {
  if (vinculo.tipoVinculo === "FAMILIAR") return "Familiar";
  if (vinculo.tipoCuidador === "FISICO") return "Cuidador físico";
  if (vinculo.tipoCuidador === "DIGITAL") return "Cuidador digital";
  return "Cuidador";
}

function textoInvitacion(invitacion: Invitacion) {
  if (invitacion.tipoVinculo === "FAMILIAR") return "Familiar";
  if (invitacion.tipoCuidador === "FISICO") return "Cuidador físico";
  if (invitacion.tipoCuidador === "DIGITAL") return "Cuidador digital";
  return "Cuidador";
}

function iniciales(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toLocaleUpperCase("es-AR") ?? "")
    .join("");
}

export default function Config() {
  const { usuario } = useAuth();
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [loadingVinculos, setLoadingVinculos] = useState(false);
  const [errorVinculos, setErrorVinculos] = useState<string | null>(null);
  const [invitacionesPendientes, setInvitacionesPendientes] = useState<Invitacion[]>([]);
  const [recargarEnviadas, setRecargarEnviadas] = useState(0);
  const [mostrarInvitacion, setMostrarInvitacion] = useState(false);

  const [configNotificaciones, setConfigNotificaciones] = useState<PreferenciasNotificacion>({
    notifActividad: true,
    notifBienestar: true,
    notifRecordatorios: true,
  });
  const [cargando, setCargando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);
  const [mensajeGuardar, setMensajeGuardar] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    let activo = true;
    const fetchVinculos = async () => {
      setLoadingVinculos(true);
      setErrorVinculos(null);
      try {
        const data = await usuarioService.getVinculos(usuario.id);
        if (activo) setVinculos(data);
      } catch (err) {
        console.error(err);
        if (activo) setErrorVinculos("Hubo un error al cargar las personas vinculadas");
      } finally {
        if (activo) setLoadingVinculos(false);
      }
    };
    void fetchVinculos();
    return () => { activo = false; };
  }, [usuario]);

  useEffect(() => {
    if (!usuario) return;
    let activo = true;
    const fetchEnviadas = async () => {
      try {
        const data = await invitacionesService.getEnviadas();
        if (activo) setInvitacionesPendientes(data.filter((invitacion) => invitacion.estado === "PENDIENTE"));
      } catch (err) {
        console.error(err);
      }
    };
    void fetchEnviadas();
    return () => { activo = false; };
  }, [usuario, recargarEnviadas]);

  useEffect(() => {
    if (!usuario) return;
    let activo = true;
    const fetchPreferencias = async () => {
      try {
        const data = await usuarioService.getPreferenciasNotificacion(usuario.id);
        if (activo) setConfigNotificaciones(data);
      } catch (err) {
        console.error(err);
        if (activo) setErrorGuardar("No se pudieron cargar tus preferencias de notificaciones");
      }
    };
    void fetchPreferencias();
    return () => { activo = false; };
  }, [usuario]);

  const recibirNotificaciones = configNotificaciones.notifActividad ||
    configNotificaciones.notifBienestar || configNotificaciones.notifRecordatorios;

  const handleToggle = (key: keyof PreferenciasNotificacion) => {
    setMensajeGuardar(null);
    setConfigNotificaciones((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleGeneral = () => {
    const siguienteEstado = !recibirNotificaciones;
    setMensajeGuardar(null);
    setConfigNotificaciones({
      notifActividad: siguienteEstado,
      notifBienestar: siguienteEstado,
      notifRecordatorios: siguienteEstado,
    });
  };

  const handleToggleActividadDescanso = () => {
    const siguienteEstado = !(configNotificaciones.notifActividad && configNotificaciones.notifBienestar);
    setMensajeGuardar(null);
    setConfigNotificaciones((prev) => ({
      ...prev,
      notifActividad: siguienteEstado,
      notifBienestar: siguienteEstado,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usuario) return;
    setCargando(true);
    setErrorGuardar(null);
    setMensajeGuardar(null);
    try {
      await usuarioService.editarPreferenciasNotificacion(usuario.id, configNotificaciones);
      setMensajeGuardar("Tus cambios se guardaron");
    } catch (err) {
      console.error(err);
      setErrorGuardar("No se pudieron guardar los cambios");
    } finally {
      setCargando(false);
    }
  };

  const cargarEnviadas = () => setRecargarEnviadas((actual) => actual + 1);

  return (
    <main className="mainBody">
      <Header />
      <VueltaAtras titulo="Mis ajustes" compacto seccion="Mi app" />

      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <form id="form-ajustes" onSubmit={handleSubmit} className="contents">
          <AjustesTexto />

          <section aria-labelledby="titulo-avisos" className="flex w-full flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm">
            <h2 id="titulo-avisos" className="text-2xl font-bold text-[#16222C]">Mis avisos</h2>
            <div className="h-0.5 w-full bg-[#D7DFE6]" />

            <div className="flex min-h-12 items-center justify-between gap-3 py-1">
              <span className="text-lg font-bold text-[#16222C]">Recibir avisos</span>
              <Switch ariaLabel="Recibir avisos" checked={recibirNotificaciones} onChange={handleToggleGeneral} />
            </div>
            <div className="h-0.5 w-full bg-[#D7DFE6]" />

            <div className="flex min-h-12 items-center justify-between gap-3 py-1">
              <span className="text-lg font-bold text-[#16222C]">Recordatorios</span>
              <Switch ariaLabel="Recordatorios" checked={configNotificaciones.notifRecordatorios} onChange={() => handleToggle("notifRecordatorios")} />
            </div>
            <div className="h-0.5 w-full bg-[#D7DFE6]" />

            <div className="flex min-h-12 items-center justify-between gap-3 py-1">
              <span className="text-lg font-bold text-[#16222C]">Actividad y descanso</span>
              <Switch
                ariaLabel="Actividad y descanso"
                checked={configNotificaciones.notifActividad && configNotificaciones.notifBienestar}
                onChange={handleToggleActividadDescanso}
              />
            </div>
          </section>
        </form>

        <section aria-labelledby="titulo-acompanantes" className="flex w-full flex-col gap-3 rounded-3xl bg-white px-5 pb-6 pt-5 shadow-sm">
          <h2 id="titulo-acompanantes" className="text-2xl font-bold text-[#16222C]">Usuarios acompañantes</h2>

          {loadingVinculos && <p className="text-[#435059]">Cargando personas vinculadas...</p>}
          {errorVinculos && <p role="alert" className="text-red-700">{errorVinculos}</p>}
          {!loadingVinculos && !errorVinculos && vinculos.length === 0 && (
            <p className="text-[#435059]">Todavía no tenés personas vinculadas.</p>
          )}

          {vinculos.map((vinculo, indice) => (
            <div key={vinculo.id}>
              {indice > 0 && <div className="mb-3 h-0.5 w-full bg-[#D7DFE6]" />}
              <Link
                to={`/adulto/Administrar-Vinculo?familiar=${vinculo.familiarId}`}
                className="flex min-w-0 items-center gap-3.5 rounded-2xl py-1 transition-colors hover:bg-[#F3F7FC] active:bg-[#E7EDFB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
              >
                <span aria-hidden="true" className="flex size-13 shrink-0 items-center justify-center rounded-full bg-[#E7EDFB] text-lg font-bold text-[#0E3494]">
                  {iniciales(vinculo.familiar.nombreCompleto)}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xl font-bold text-[#16222C]">{vinculo.familiar.nombreCompleto}</span>
                  <span className="text-lg text-[#435059]">{textoVinculo(vinculo)}</span>
                </span>
                <LuChevronRight aria-hidden="true" className="size-5 shrink-0 text-[#9BA8B2]" />
              </Link>
            </div>
          ))}

          {invitacionesPendientes.length > 0 && (
            <div className="flex flex-col gap-3">
              {invitacionesPendientes.map((invitacion) => (
                <div key={invitacion.id} className="flex items-center gap-3 rounded-2xl bg-[#EFF4FC] p-3">
                  <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#435059]"><LuClock3 className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-[#16222C]">{invitacion.emailDestino}</p>
                    <p className="text-sm text-[#435059]">{textoInvitacion(invitacion)} · Invitación pendiente</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mostrarInvitacion ? (
            <Desplegable abiertoAlInicio onInvitacionCreada={cargarEnviadas} textoBoton="Invitar usuario" varianteBoton="suave" />
          ) : (
            <button
              type="button"
              onClick={() => setMostrarInvitacion(true)}
              className="flex min-h-15 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#E7EDFB] px-4 text-lg font-bold text-[#0E3494] transition-colors hover:bg-[#DCE6FA] active:bg-[#CCD9F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            >
              Invitar usuario <LuArrowRight aria-hidden="true" className="size-6" />
            </button>
          )}
        </section>

        <Link
          className="flex min-h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-[#144BD3] px-4 text-lg font-bold text-[#0E3494] transition-colors hover:bg-[#E7EDFB] active:bg-[#D7E2FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
          to="../ayuda"
        >
          <AiOutlineQuestionCircle aria-hidden="true" className="size-6" />
          Ayuda: cómo usar NONOS
        </Link>

        <button
          type="submit"
          form="form-ajustes"
          disabled={cargando}
          className="flex min-h-18 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#144BD3] px-4 text-lg font-bold text-white transition-colors hover:bg-[#1245BF] active:bg-[#0E3494] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] disabled:cursor-wait disabled:opacity-60"
        >
          <HiCheck aria-hidden="true" className="size-6" />
          {cargando ? "Guardando..." : "Guardar cambios"}
        </button>
        {errorGuardar && <p role="alert" className="px-1 text-sm text-red-700">{errorGuardar}</p>}
        {mensajeGuardar && <p role="status" className="px-1 text-sm text-green-800">{mensajeGuardar}</p>}
      </div>
    </main>
  );
}
