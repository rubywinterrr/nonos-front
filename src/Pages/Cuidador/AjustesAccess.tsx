import { useState } from "react";
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

// cómo arrancan los avisos (y a qué vuelven con "Restablecer")
// HARDCODEADO: después se leen y guardan con usuariosService.get/editarPreferenciasNotificacion
const avisosPorDefecto = [
  {
    id: "boton",
    seccion: "criticas",
    titulo: "Botón de emergencia presionado",
    texto: "Notificación sonora urgente y vibración persistente.",
    activo: true,
  },
  {
    id: "qr",
    seccion: "criticas",
    titulo: "Escaneo de QR de emergencia",
    texto: "Avisa inmediato si personal médico o ambulancia consulta datos en la pulsera.",
    activo: true,
  },
  {
    id: "esquema",
    seccion: "medicacion",
    titulo: "Modificación de esquema médico",
    texto: "Cuando un médico o cuidador registra un ajuste de dosis o nuevo fármaco.",
    activo: true,
  },
  {
    id: "bitacora",
    seccion: "visitas",
    titulo: "Observaciones y bitácora del día",
    texto: "Notas cotidianas sobre estado de ánimo, alimentación o molestias leves.",
    activo: false,
  },
  {
    id: "bateria",
    seccion: "dispositivo",
    titulo: "Batería baja de la pulsera",
    texto: "Aviso con anticipación de 48 hs para recambio de batería.",
    activo: true,
  },
];

// títulos de cada grupo de avisos, en el orden en que se muestran
const secciones = [
  { id: "criticas", titulo: "Alertas críticas", icono: <LuSiren />, porDefecto: true },
  { id: "medicacion", titulo: "Cambios médicos y medicación", icono: <LuPill />, porDefecto: false },
  { id: "visitas", titulo: "Registros de visitas y cuidado", icono: <LuClipboardList />, porDefecto: false },
  { id: "dispositivo", titulo: "Estado del dispositivo", icono: <LuBatteryLow />, porDefecto: false },
];

// pantalla del cuidador: elige su modalidad y qué avisos recibe del adulto
export default function AjustesCuidador() {
  const [modalidad, setModalidad] = useState("fisico");
  const [avisos, setAvisos] = useState(avisosPorDefecto);

  // prende o apaga un aviso, sin tocar los demás
  function cambiarAviso(id: string, activo: boolean) {
    setAvisos(avisos.map((aviso) => (aviso.id === id ? { ...aviso, activo: activo } : aviso)));
  }

  // vuelve todo a como estaba al principio
  function restablecer() {
    setModalidad("fisico");
    setAvisos(avisosPorDefecto);
  }

  return (
    <>
      <main className="mainBody text-[#0E1D28]">
        <Header />
        <VueltaAtras titulo="Ajustes de accesibilidad" compacto />

        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          {/* HARDCODEADO: nombre del adulto */}
          <section className="flex items-start gap-3 rounded-2xl bg-white/70 p-4">
            <LuUserRound aria-hidden="true" className="size-9 shrink-0 rounded-lg bg-white p-2 text-[#1550E0]" />
            <div>
              <h2 className="font-bold">Roberto Gómez (Papá)</h2>
              <p className="text-sm text-[#424656]">
                Personalizá qué avisos recibís de José Perez. Por defecto vienen priorizadas las alertas críticas.
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
                className={`flex cursor-pointer flex-col items-center rounded-lg py-2 ${
                  modalidad === "fisico" ? "bg-[#1550E0] text-white" : "text-[#0E1D28] hover:bg-white/60"
                }`}
              >
                <span className="font-bold">Físico</span>
                <span className="text-xs">Presencial</span>
              </button>
              <button
                type="button"
                aria-pressed={modalidad === "digital"}
                onClick={() => setModalidad("digital")}
                className={`flex cursor-pointer flex-col items-center rounded-lg py-2 ${
                  modalidad === "digital" ? "bg-[#1550E0] text-white" : "text-[#0E1D28] hover:bg-white/60"
                }`}
              >
                <span className="font-bold">Digital</span>
                <span className="text-xs">A distancia</span>
              </button>
            </div>

            {/* PENDIENTE: falta el texto del modo Digital en Figma */}
            {modalidad === "fisico" && (
              <p className="flex items-start gap-2 rounded-xl border border-[#1550E0]/30 bg-[#EBF5FF] p-3 text-sm">
                <LuInfo aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#1550E0]" />
                <span>
                  <span className="font-bold">Modo Físico:</span> Activa solo alertas críticas e inmediatas para evitar
                  saturación durante la guardia presencial.
                </span>
              </p>
            )}
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

          <div className="flex flex-col gap-3">
            {/* HARDCODEADO: todavía no guarda en el back */}
            <button
              type="button"
              className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white shadow-md hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            >
              <LuCheck aria-hidden="true" className="size-5 shrink-0" />
              Guardar cambios
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
