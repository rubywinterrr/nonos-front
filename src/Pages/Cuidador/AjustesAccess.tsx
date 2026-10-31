import { useEffect, useState } from "react";
import VueltaAtras from "../../components/vueltaAtras";
import Header from "../../components/Header";
import Switch from "../../components/switch";
import {
  LuBatteryLow,
  LuCheck,
  LuClipboardList,
  LuInfo,
  LuPill,
  LuRotateCcw,
  LuSiren,
  LuSlidersHorizontal,
  LuUserRound,
} from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService, type AdultoMayorVinculado } from "../../services/usuariosService";
import type { TipoAlerta } from "../../services/alertasService";
import type { TipoCuidador } from "../../services/invitacionesService";
import { buscarAdultoSeleccionado } from "../../utils/adultoQueSeMira";

// todos los tipos de alerta del back (es lo que el back pone por defecto)
const TODOS_LOS_TIPOS: TipoAlerta[] = ["SOS_DIRECTO", "FC_ELEVADA", "FC_BAJA", "SP02_BAJO", "MEDICACION_STOCK_BAJO", "CAMBIO_DE_RUTINA", "LOGRO_POSITIVO"];

// cómo arrancan los avisos (y a qué vuelven con "Restablecer").
// "tipo" es el tipo de alerta del back que prende o apaga cada interruptor.
// PENDIENTE BACK: los que tienen tipo null no existen como alerta en el back; el interruptor se ve pero no se guarda
const avisosPorDefecto: { id: string; seccion: string; titulo: string; texto: string; activo: boolean; tipo: TipoAlerta | null }[] = [
  {
    id: "boton",
    seccion: "criticas",
    titulo: "Botón de emergencia presionado",
    texto: "Notificación sonora urgente y vibración persistente.",
    activo: true,
    tipo: "SOS_DIRECTO",
  },
  {
    id: "qr",
    seccion: "criticas",
    titulo: "Escaneo de QR de emergencia",
    texto: "Avisa inmediato si personal médico o ambulancia consulta datos en la pulsera.",
    activo: true,
    tipo: null,
  },
  {
    id: "esquema",
    seccion: "medicacion",
    titulo: "Modificación de esquema médico",
    texto: "Cuando un médico o cuidador registra un ajuste de dosis o nuevo fármaco.",
    activo: true,
    tipo: null,
  },
  {
    id: "bitacora",
    seccion: "visitas",
    titulo: "Observaciones y bitácora del día",
    texto: "Notas cotidianas sobre estado de ánimo, alimentación o molestias leves.",
    activo: false,
    tipo: null,
  },
  {
    id: "bateria",
    seccion: "dispositivo",
    titulo: "Batería baja de la pulsera",
    texto: "Aviso con anticipación de 48 hs para recambio de batería.",
    activo: true,
    tipo: null,
  },
];

// títulos de cada grupo de avisos, en el orden en que se muestran
const secciones = [
  { id: "criticas", titulo: "Alertas críticas", icono: <LuSiren />, porDefecto: true },
  { id: "medicacion", titulo: "Cambios médicos y medicación", icono: <LuPill />, porDefecto: false },
  { id: "visitas", titulo: "Registros de visitas y cuidado", icono: <LuClipboardList />, porDefecto: false },
  { id: "dispositivo", titulo: "Estado del dispositivo", icono: <LuBatteryLow />, porDefecto: false },
];

// pasa la modalidad del back ("FISICO"/"DIGITAL") a la de la pantalla ("fisico"/"digital")
function modalidadDeLaPantalla(tipo: TipoCuidador | null) {
  if (tipo === "DIGITAL") return "digital";
  return "fisico";
}

// pantalla del cuidador: elige su modalidad y qué avisos recibe del adulto vinculado que mira
export default function AjustesCuidador() {
  const { usuario } = useAuth();
  const [adulto, setAdulto] = useState<AdultoMayorVinculado | null>(null);
  const [modalidad, setModalidad] = useState("fisico");
  const [avisos, setAvisos] = useState(avisosPorDefecto);
  // la lista completa de tipos que tiene guardada en el back (incluye los que no tienen interruptor)
  const [tiposGuardados, setTiposGuardados] = useState<TipoAlerta[]>(TODOS_LOS_TIPOS);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    const miId = usuario.id;

    // trae el adulto, la modalidad del vínculo y los avisos que recibe hoy
    const cargar = async () => {
      try {
        const elegido = await buscarAdultoSeleccionado(miId);
        setAdulto(elegido);
        if (!elegido) return;
        const vinculo = await usuarioService.getVinculo(elegido.id, miId);
        setModalidad(modalidadDeLaPantalla(vinculo.tipoCuidador));
        const data = await usuarioService.getNotificacionesRecibidas(miId, elegido.id);
        setTiposGuardados(data.tipoNotificaciones);
        // los interruptores con tipo arrancan como están en el back
        setAvisos(
          avisosPorDefecto.map((aviso) =>
            aviso.tipo ? { ...aviso, activo: data.tipoNotificaciones.includes(aviso.tipo) } : aviso,
          ),
        );
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus ajustes.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario]);

  // guarda la modalidad en el vínculo y la lista de avisos
  async function guardar() {
    if (!usuario || !adulto) return;
    setGuardando(true);
    setMensaje(null);
    setError(null);

    // se parte de lo guardado y se prende o apaga solo lo que tiene interruptor
    let tipos = [...tiposGuardados];
    for (const aviso of avisos) {
      if (!aviso.tipo) continue;
      const sinEste = tipos.filter((t) => t !== aviso.tipo);
      tipos = aviso.activo ? [...sinEste, aviso.tipo] : sinEste;
    }

    try {
      await usuarioService.actualizarVinculo(adulto.id, usuario.id, {
        tipoVinculo: "CUIDADOR",
        tipoCuidador: modalidad === "digital" ? "DIGITAL" : "FISICO",
      });
      await usuarioService.editarNotificacionesRecibidas(usuario.id, adulto.id, { tipoNotificaciones: tipos });
      setTiposGuardados(tipos);
      setMensaje("¡Listo! Tus ajustes quedaron guardados.");
    } catch (err) {
      console.error(err);
      setError("No se pudieron guardar los cambios. Probá de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  // prende o apaga un aviso, sin tocar los demás
  function cambiarAviso(id: string, activo: boolean) {
    setAvisos(avisos.map((aviso) => (aviso.id === id ? { ...aviso, activo: activo } : aviso)));
  }

  // vuelve todo a como estaba al principio
  function restablecer() {
    setModalidad("fisico");
    setAvisos(avisosPorDefecto);
    // el back por defecto manda todos los tipos de alerta
    setTiposGuardados(TODOS_LOS_TIPOS);
    setMensaje(null);
  }

  return (
    <>
      <main className="mainBody text-[#0E1D28]">
        <Header />
        <VueltaAtras titulo="Ajustes de accesibilidad" compacto />

        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          {cargando && <p className="text-center text-[#424656]">Cargando…</p>}
          {!cargando && !adulto && !error && (
            <p className="rounded-2xl bg-white p-5">Todavía no estás vinculado a ningún adulto mayor.</p>
          )}
          <section className="flex items-start gap-3 rounded-2xl bg-white/70 p-4">
            <LuUserRound aria-hidden="true" className="size-9 shrink-0 rounded-lg bg-white p-2 text-[#1550E0]" />
            <div>
              {/* PENDIENTE BACK: el vínculo no guarda el parentesco, por ahora "(Papá)" queda fijo */}
              <h2 className="font-bold">{adulto?.nombreCompleto} (Papá)</h2>
              <p className="text-sm text-[#424656]">
                Personalizá qué avisos recibís de {adulto?.nombreCompleto}. Por defecto vienen priorizadas las alertas críticas.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="modalidad">
            <h2 id="modalidad" className="flex items-center gap-2 text-lg font-bold">
              <LuSlidersHorizontal aria-hidden="true" className="size-8 shrink-0 rounded-lg bg-[#EBF5FF] p-1.5 text-[#1550E0]" />
              Modalidad de cuidado actual
            </h2>
            <p className="text-sm text-[#424656]">Seleccioná tu rol específico como cuidador:</p>

            <div role="group" aria-label="Modalidad de cuidado" className="grid grid-cols-2 gap-1 rounded-xl bg-[#EBF5FF] p-1">
              <button
                type="button"
                aria-pressed={modalidad === "fisico"}
                onClick={() => setModalidad("fisico")}
                className={`flex cursor-pointer flex-col items-center rounded-lg py-2 ${modalidad === "fisico" ? "bg-[#1550E0] text-white" : "text-[#0E1D28] hover:bg-white/60"
                  }`}
              >
                <span className="font-bold">Físico</span>
                <span className="text-xs">Presencial</span>
              </button>
              <button
                type="button"
                aria-pressed={modalidad === "digital"}
                onClick={() => setModalidad("digital")}
                className={`flex cursor-pointer flex-col items-center rounded-lg py-2 ${modalidad === "digital" ? "bg-[#1550E0] text-white" : "text-[#0E1D28] hover:bg-white/60"
                  }`}
              >
                <span className="font-bold">Digital</span>
                <span className="text-xs">A distancia</span>
              </button>
            </div>

            {/* explicación de la modalidad elegida (textos de Figma) */}
            <p className="flex items-start gap-2 rounded-xl border border-[#1550E0]/30 bg-[#EBF5FF] p-3 text-sm">
              <LuInfo aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#1550E0]" />
              {modalidad === "fisico" ? (
                <span>
                  <span className="font-bold">Modo Físico:</span> Activa solo alertas críticas e inmediatas para evitar
                  saturación durante la guardia presencial.
                </span>
              ) : (
                <span>
                  <span className="font-bold">Modo Digital:</span> Recibe notificaciones sobre registro de medicación, control
                  de tomas en NONOS y alertas familiares a distancia sin interferir en la asistencia física.
                </span>
              )}
            </p>
          </section>

          {secciones.map((seccion) => (
            <section key={seccion.id} className="flex flex-col gap-3" aria-label={seccion.titulo}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/70 text-[#1550E0]">
                    {seccion.icono}
                  </span>
                  {seccion.titulo}
                </h2>
                {seccion.porDefecto && (
                  <span className="rounded-md border border-[#BA1A1A]/40 bg-white px-2 py-0.5 text-xs font-bold text-[#BA1A1A]">
                    POR DEFECTO
                  </span>
                )}
              </div>

              {avisos
                .filter((aviso) => aviso.seccion === seccion.id)
                .map((aviso) => (
                  <div key={aviso.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-xs">
                    <div>
                      <p className="font-bold">{aviso.titulo}</p>
                      <p className="text-sm text-[#424656]">{aviso.texto}</p>
                    </div>
                    {/* shrink-0: que el switch no se achique cuando el texto es largo */}
                    <div className="shrink-0">
                      <Switch checked={aviso.activo} onChange={(activo) => cambiarAviso(aviso.id, activo)} />
                    </div>
                  </div>
                ))}
            </section>
          ))}

          {mensaje && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{mensaje}</p>}
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={guardar}
              disabled={!adulto || guardando}
              className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white shadow-md hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] disabled:cursor-wait disabled:opacity-70"
            >
              <LuCheck aria-hidden="true" className="size-5 shrink-0" />
              {guardando ? "Guardando…" : "Guardar cambios"}
            </button>
            <button
              type="button"
              onClick={restablecer}
              className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#1550E0]/30 bg-[#EBF5FF] px-4 font-semibold text-[#0E1D28] hover:bg-[#DCEBFA] active:bg-[#CBDEF2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            >
              <LuRotateCcw aria-hidden="true" className="size-5 shrink-0" />
              Restablecer a valores por defecto
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
