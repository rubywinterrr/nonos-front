import { useState } from "react";
import VueltaAtras from "../../components/vueltaAtras";
import Header from "../../components/Header";
import Switch from "../../components/switch";
import {
  LuBatteryLow,
  LuCheck,
  LuCircleUserRound,
  LuClipboardPenLine,
  LuLink2,
  LuRotateCcw,
  LuShield,
  LuSiren,
} from "react-icons/lu";

export default function ConfigFam() {
  const [botonEmergencia, setBotonEmergencia] = useState(true);
  const [escaneoQr, setEscaneoQr] = useState(true);
  const [cambiosMedicos, setCambiosMedicos] = useState(true);
  const [registrosCuidado, setRegistrosCuidado] = useState(false);
  const [bateriaPulsera, setBateriaPulsera] = useState(true);

  return (
    <main className="mainBody gap-4">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Ajustes de accesibilidad" compacto />

        <section aria-label="Persona vinculada" className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xs">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E7EDFB] text-[#1550E0]"><LuCircleUserRound aria-hidden="true" className="size-5" /></span>
          <div><h2 className="text-sm font-bold leading-5">Roberto Gómez (Papá)</h2><p className="mt-1 text-xs leading-4 text-[#435059]">Personalizá qué avisos recibís de José Perez. Por defecto vienen priorizadas las alertas críticas.</p></div>
        </section>

        <section aria-labelledby="perfil-aviso" className="rounded-2xl bg-white p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E7EDFB] text-[#1550E0]"><LuShield aria-hidden="true" className="size-4" /></span><h2 id="perfil-aviso" className="text-sm font-bold leading-5">Perfil de aviso<br />actual</h2></div>
            <span className="flex items-center gap-1 rounded-full border border-[#BAEDD3] bg-[#E8FAF1] px-2 py-1 text-xs font-bold text-[#0B4C2B]"><LuCheck aria-hidden="true" className="size-3" /> Prioridad</span>
          </div>
          <p className="mt-3 text-xs leading-4 text-[#435059]">Recomendado para familiares principales o primeros contactos de asistencia.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" className="min-h-11 cursor-pointer rounded-lg bg-[#1550E0] px-3 text-xs font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]">Activar todas</button>
            <button type="button" className="min-h-11 cursor-pointer rounded-lg border border-[#B7C8F0] bg-[#E7EDFB] px-3 text-xs font-semibold text-[#1550E0] hover:bg-[#D3E0F8] active:border-[#1550E0] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]">Solo urgencias</button>
          </div>
        </section>

        <section aria-labelledby="alertas-criticas" className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3"><h2 id="alertas-criticas" className="flex items-center gap-2 text-lg font-bold"><span className="flex size-8 items-center justify-center rounded-lg bg-[#FFE0DF] text-[#B52A2A]"><LuSiren aria-hidden="true" className="size-4" /></span>Alertas críticas</h2><span className="rounded-md bg-[#F9E9E9] px-2 py-0.5 text-xs font-semibold tracking-wide text-[#7D1A1A]">POR DEFECTO</span></div>
          <article className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-xs"><div className="min-w-0"><h3 className="text-sm font-bold">Botón de emergencia presionado</h3><p className="mt-1 text-xs leading-4 text-[#435059]">Notificación sonora urgente y vibración persistente.</p></div><Switch checked={botonEmergencia} onChange={setBotonEmergencia} mostrarEstado /></article>
          <article className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-xs"><div className="min-w-0"><h3 className="text-sm font-bold">Escaneo de QR de emergencia</h3><p className="mt-1 text-xs leading-4 text-[#435059]">Aviso inmediato si personal médico o ambulancia consulta datos en la pulsera.</p></div><Switch checked={escaneoQr} onChange={setEscaneoQr} mostrarEstado /></article>
        </section>

        <section aria-labelledby="cambios-medicos" className="flex flex-col gap-2">
          <h2 id="cambios-medicos" className="flex items-center gap-2 text-lg font-bold"><span className="flex size-8 items-center justify-center rounded-lg bg-[#E7EDFB] text-[#1550E0]"><LuLink2 aria-hidden="true" className="size-4" /></span>Cambios médicos y medicación</h2>
          <article className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-xs"><div className="min-w-0"><h3 className="text-sm font-bold">Modificación de esquema médico</h3><p className="mt-1 text-xs leading-4 text-[#435059]">Cuando un médico o cuidador registra un ajuste de dosis o nuevo fármaco.</p></div><Switch checked={cambiosMedicos} onChange={setCambiosMedicos} mostrarEstado /></article>
        </section>

        <section aria-labelledby="registros-cuidado" className="flex flex-col gap-2">
          <h2 id="registros-cuidado" className="flex items-center gap-2 text-lg font-bold"><span className="flex size-8 items-center justify-center rounded-lg bg-[#E7EDFB] text-[#1550E0]"><LuClipboardPenLine aria-hidden="true" className="size-4" /></span>Registros de visitas y cuidado</h2>
          <article className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-xs"><div className="min-w-0"><h3 className="text-sm font-bold">Observaciones y bitácora del día</h3><p className="mt-1 text-xs leading-4 text-[#435059]">Notas cotidianas sobre estado de ánimo, alimentación o molestias leves.</p></div><Switch checked={registrosCuidado} onChange={setRegistrosCuidado} mostrarEstado /></article>
        </section>

        <section aria-labelledby="estado-dispositivo" className="flex flex-col gap-2">
          <h2 id="estado-dispositivo" className="flex items-center gap-2 text-lg font-bold"><span className="flex size-8 items-center justify-center rounded-lg bg-[#E7EDFB] text-[#1550E0]"><LuBatteryLow aria-hidden="true" className="size-4" /></span>Estado del dispositivo</h2>
          <article className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-xs"><div className="min-w-0"><h3 className="text-sm font-bold">Batería baja de la pulsera</h3><p className="mt-1 text-xs leading-4 text-[#435059]">Aviso con anticipación de 48 hs para recambio de batería.</p></div><Switch checked={bateriaPulsera} onChange={setBateriaPulsera} mostrarEstado /></article>
        </section>

        <div className="flex flex-col gap-2 pb-4">
          <button type="button" className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"><LuCheck aria-hidden="true" className="size-4" /> Guardar cambios</button>
          <button type="button" className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#435059] bg-white px-4 text-sm font-semibold text-[#16222C] hover:bg-[#E9EEF2] active:border-[#1550E0] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"><LuRotateCcw aria-hidden="true" className="size-4 text-[#1550E0]" /> Restablecer a valores por defecto</button>
        </div>
      </div>
    </main>
  );
}
