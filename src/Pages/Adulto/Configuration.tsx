import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService, type Vinculo, type PreferenciasNotificacion } from "../../services/usuariosService";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { VscGear } from "react-icons/vsc";
import AjustesTexto from "../../components/AjusteTamanios";
import { MdOutlineNotifications, MdCheck } from "react-icons/md";
import { Link } from "react-router-dom";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { GoShieldLock } from "react-icons/go";
import { HiCheck } from "react-icons/hi2";
import PersonaVinculada from "../../components/tarjetaPersonaVinculada";
import { LuUserRoundCheck } from "react-icons/lu";
import { GoPlus } from "react-icons/go";
import Switch from "../../components/switch";

// texto que se muestra debajo del nombre de cada persona vinculada
function textoVinculo(vinculo: Vinculo) {
  if (vinculo.tipoVinculo === "FAMILIAR") return "Familiar";
  if (vinculo.tipoCuidador === "FISICO") return "Cuidador físico";
  if (vinculo.tipoCuidador === "DIGITAL") return "Cuidador digital";
  return "Cuidador";
}

export default function Config() {
  const { usuario } = useAuth();
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [loadingVinculos, setLoadingVinculos] = useState<boolean>(false);
  const [errorVinculos, setErrorVinculos] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;

    // trae las personas vinculadas al adulto (familiares y cuidadores)
    const fetchVinculos = async () => {
      setLoadingVinculos(true);
      setErrorVinculos(null);

      try {
        const data = await usuarioService.getVinculos(usuario.id);
        setVinculos(data);
      } catch (err) {
        console.error(err);
        setErrorVinculos("Hubo un error al cargar las personas vinculadas");
      } finally {
        setLoadingVinculos(false);
      }
    };

    fetchVinculos();
  }, [usuario]);
  
  // interruptores de notificaciones: arrancan prendidos (como en el back) hasta que llegan los guardados
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

    // trae las preferencias guardadas para mostrar los interruptores como están
    const fetchPreferencias = async () => {
      try {
        const data = await usuarioService.getPreferenciasNotificacion(usuario.id);
        setConfigNotificaciones(data);
      } catch (err) {
        console.error(err);
        setErrorGuardar("No se pudieron cargar tus preferencias de notificaciones");
      }
    };

    fetchPreferencias();
  }, [usuario]);

  // "Recibir notificaciones" no existe en el back: está prendido si alguna de las tres lo está
  const recibirNotificaciones =
    configNotificaciones.notifActividad ||
    configNotificaciones.notifBienestar ||
    configNotificaciones.notifRecordatorios;

  // prende o apaga un interruptor (todavía no se guarda: eso pasa en "Guardar cambios")
  const handleToggle = (key: keyof PreferenciasNotificacion) => {
    setConfigNotificaciones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // el general prende o apaga los tres juntos
  const handleToggleGeneral = () => {
    setConfigNotificaciones({
      notifActividad: !recibirNotificaciones,
      notifBienestar: !recibirNotificaciones,
      notifRecordatorios: !recibirNotificaciones,
    });
  };

  // guarda los interruptores en el back
  const handleSubmit = async (e: React.SubmitEvent) => {
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

  return (
    <>
      <main className="mainBody">
        <Header />
        <VueltaAtras titulo="Ajustes de accesibilidad" />

        <form onSubmit={handleSubmit} className="contents">
          <div className="rounded-2xl bg-white w-full p-5 gap-3 flex justify-start pr-0 items-start">
            <VscGear className="bg-blue-600 rounded-full text-white p-3 size-12" />
            <div className="flex flex-col items-start justify-start max-w-80/100">
              <h1 className="text-xl font-semibold">
                Preferencias de tu aplicación
              </h1>
              <p className="text-gray-600">
                Configurá todo a tu manera. Los ajustes se aplicarán cuando
                guardes los cambios.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white w-full flex flex-col p-5 gap-5">
            <div className="w-full flex justify-start items-start gap-3 relative">
              <MdOutlineNotifications className="bg-blue-100/70 rounded-xl p-3 size-14 text-blue-600 border border-blue-300/35" />
              <div className="flex flex-col items-start justify-start gap-2 pt-1">
                <h1 className="font-semibold text-xl">Notificaciones</h1>
                <p className="text-gray-500 text-lg">
                  Elegí qué avisos querés recibir.
                </p>
              </div>
              <h3 className="bg-green-50 text-sm text-green-700 pl-2 pr-2 rounded-full border flex items-center gap-2 border-green-300 p-1 font-semibold absolute right-0 top-0">
                <MdCheck />
                Activadas
              </h3>
            </div>

            <div className="w-full flex p-5 font-semibold gap-5 min-h-20 rounded-2xl border bg-green-50 text-green-700 border-green-300">
              <GoShieldLock className="text-3xl" />
              <p className="max-w-85/100 text-green-800">
                Solo notificaciones importantes. ACTIVADAS por defecto para no
                mandarte avisos innecesarios.
              </p>
            </div>

            <div className="w-full min-h-20 flex items-center justify-between rounded-2xl border border-gray-400 p-4">
              <div>
                <h1 className="font-semibold text-xl">
                  Recibir notificaciones
                </h1>
                <p className="text-gray-600">
                  Control general del sistema de alertas
                </p>
              </div>
              <Switch
                checked={recibirNotificaciones}
                onChange={handleToggleGeneral}
              />
            </div>

            <div className="w-full flex p-5 relative items-center justify-between min-h-20 rounded-2xl border bg-green-50 border-green-300">
              <div className="w-75/100">
                <h1 className="text-lg font-semibold">
                  Notificaciones importantes
                </h1>
                <p className="max-w-85/100 text-green-800">
                  Siempre activas por seguridad.
                </p>
              </div>
              <h3 className="border absolute right-3 border-green-300 text-green-700 h-fit p-2 rounded-full font-semibold">
                Obligatoria
              </h3>
            </div>

            <div className="w-full min-h-20 flex items-center justify-between rounded-2xl border border-gray-400 p-4">
              <div>
                <h1 className="font-semibold text-xl">Actividad</h1>
                <p className="text-gray-600">Pasos y movimiento diario</p>
              </div>
              <Switch
                checked={configNotificaciones.notifActividad}
                onChange={() => handleToggle("notifActividad")}
              />
            </div>

            <div className="w-full min-h-20 flex items-center justify-between rounded-2xl border border-gray-400 p-4">
              <div>
                <h1 className="font-semibold text-xl">Bienestar</h1>
                <p className="text-gray-600">Monitoreo de descanso y salud</p>
              </div>
              <Switch
                checked={configNotificaciones.notifBienestar}
                onChange={() => handleToggle("notifBienestar")}
              />
            </div>

            <div className="w-full min-h-20 flex items-center justify-between rounded-2xl border border-gray-400 p-4">
              <div>
                <h1 className="font-semibold text-xl">Recordatorios</h1>
                <p className="text-gray-600">Avisos generales del día</p>
              </div>
              <Switch
                checked={configNotificaciones.notifRecordatorios}
                onChange={() => handleToggle("notifRecordatorios")}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl w-full p-5 flex flex-col gap-7">
            <div className="flex w-full gap-5">
              <LuUserRoundCheck className="size-14 bg-blue-50 border border-blue-200 p-3 text-blue-600 rounded-xl" />
              <div className="flex flex-col max-w-75/100 gap-2">
                <h1 className="font-semibold text-xl">Personas vinculadas</h1>
                <p className="text-gray-500">
                  Personas que pueden acompañarte y acceder a la información
                  autorizada.
                </p>
              </div>
            </div>
            <div className="flex flex-col w-full gap-5">
              {loadingVinculos && <p>Cargando personas vinculadas...</p>}
              {errorVinculos && <p className="text-red-600">{errorVinculos}</p>}
              {!loadingVinculos && !errorVinculos && vinculos.length === 0 && (
                <p className="text-gray-500">Todavía no tenés personas vinculadas.</p>
              )}
              {vinculos.map((vinculo) => (
                <PersonaVinculada
                  key={vinculo.id}
                  nombre={vinculo.familiar.nombreCompleto}
                  ocupacion={textoVinculo(vinculo)}
                />
              ))}
            </div>

            <h1 className="font-semibold text-blue-600 flex items-center justify-center gap-2 bg-blue-100/70 border-4 border-dashed hover:bg-blue-100 cursor-pointer active:bg-blue-200 border-blue-700 w-full p-5 pt-4 pb-4 rounded-2xl text-xl select-none">
              <GoPlus className="size-8" /> Agregar personas
            </h1>
          </div>
          <AjustesTexto />

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#1a62ff] text-xl cursor-pointer hover:bg-blue-700 active:scale-[0.99] text-white font-medium py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm mt-2 border-0 disabled:opacity-50"
          >
            <HiCheck className="text-2xl stroke-2" />{" "}
            {cargando ? "Guardando..." : "Guardar cambios"}
          </button>
          {errorGuardar && <p className="text-red-600">{errorGuardar}</p>}
          {mensajeGuardar && <p className="text-green-700">{mensajeGuardar}</p>}
        </form>

        <div className="border-t w-full border-gray-500" />

        <Link
          className="bg-white rounded-2xl w-full flex items-start justify-start p-7 gap-3 relative"
          to={"../ayuda"}
        >
          <AiOutlineQuestionCircle className="text-blue-600 bg-gray-100 p-2 size-12 rounded-lg border-gray-300 border" />
          <div className="flex flex-col items-start justify-start gap-1 max-w-75/100">
            <h1 className="font-semibold text-xl">Ayuda</h1>
            <p className="text-gray-600">
              Cómo usar NONOS y resolver problemas con guías sencillas.
            </p>
          </div>
          <h2 className="bg-white text-sm text-blue-700 p-2 rounded-lg border flex items-center gap-2 border-gray-300 font-semibold absolute right-4 top-4 cursor-pointer hover:bg-gray-100 active:bg-gray-200">
            Ver ayuda
          </h2>
        </Link>

        <div className="flex flex-col gap-3 p-5 items-center justify-center w-full bg-white rounded-2xl border border-gray-100">
          <p className="text-blue-600 font-black">Acerca de NONOS</p>
          <p className="font-bold text-lg">NONOS · Tecnología que acompaña</p>
          <p className=" text-gray-600 text-center">
            Versión 1.0 · Sistema seguro de acompañamiento
          </p>
        </div>
      </main>
    </>
  );
}
