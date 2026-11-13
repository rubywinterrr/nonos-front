import { useEffect, useState } from "react";
import VueltaAtras from "../../components/vueltaAtras";
import Switch from "../../components/switch";
import {
  LuCheck,
  LuCircleUserRound,
  LuRotateCcw,
  LuShield,
  LuSiren,
} from "react-icons/lu";

import { useAuth } from "../../hooks/useAuth";
import { usuarioService, type AdultoMayorVinculado } from "../../services/usuariosService";
import type { TipoAlerta } from "../../services/alertasService";
import { buscarAdultoSeleccionado } from "../../utils/adultoQueSeMira";
import { etiquetaRol } from "../../utils/etiquetaRol";

// todos los tipos de alerta del back (es lo que el back pone por defecto)
const TODOS_LOS_TIPOS: TipoAlerta[] = ["SOS_DIRECTO", "FC_ELEVADA", "FC_BAJA", "SP02_BAJO", "MEDICACION_STOCK_BAJO", "CAMBIO_DE_RUTINA", "LOGRO_POSITIVO", "QR_ESCANEADO"];
// los urgentes, para "Solo urgencias"
const TIPOS_URGENTES: TipoAlerta[] = ["SOS_DIRECTO", "FC_ELEVADA", "FC_BAJA", "SP02_BAJO", "QR_ESCANEADO"];

// pantalla del familiar: qué avisos recibe del adulto vinculado que mira.
// "Botón de emergencia" (SOS_DIRECTO) y "Escaneo de QR" (QR_ESCANEADO) son alertas del back.
// PENDIENTE BACK: cambio de medicación, bitácora y batería no son alertas del back, así que no tienen interruptor
// (el push de cambio de medicación y el de observación prioritaria llegan siempre)
export default function ConfigFam() {
  const { usuario } = useAuth();
  const [adulto, setAdulto] = useState<AdultoMayorVinculado | null>(null);
  const [botonEmergencia, setBotonEmergencia] = useState(true);
  const [escaneoQr, setEscaneoQr] = useState(true);
  // la lista completa de tipos guardada en el back (incluye los que no tienen interruptor)
  const [tiposGuardados, setTiposGuardados] = useState<TipoAlerta[]>(TODOS_LOS_TIPOS);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    const miId = usuario.id;

    // trae el adulto y qué avisos recibe hoy
    const cargar = async () => {
      try {
        const elegido = await buscarAdultoSeleccionado(miId);
        setAdulto(elegido);
        if (!elegido) return;
        const data = await usuarioService.getNotificacionesRecibidas(miId, elegido.id);
        setTiposGuardados(data.tipoNotificaciones);
        setBotonEmergencia(data.tipoNotificaciones.includes("SOS_DIRECTO"));
        setEscaneoQr(data.tipoNotificaciones.includes("QR_ESCANEADO"));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus avisos.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario]);

  // "Activar todas": prende todos los interruptores y todos los tipos del back
  function activarTodas() {
    setBotonEmergencia(true);
    setEscaneoQr(true);
    setTiposGuardados(TODOS_LOS_TIPOS);
    setMensaje(null);
  }

  // "Solo urgencias": deja las alertas críticas y apaga el resto
  function soloUrgencias() {
    setBotonEmergencia(true);
    setEscaneoQr(true);
    setTiposGuardados(TIPOS_URGENTES);
    setMensaje(null);
  }

  // vuelve a como arranca la pantalla (y a lo que el back pone por defecto)
  function restablecer() {
    setBotonEmergencia(true);
    setEscaneoQr(true);
    setTiposGuardados(TODOS_LOS_TIPOS);
    setMensaje(null);
  }

  // guarda la lista de avisos en el back
  async function guardar() {
    if (!usuario || !adulto) return;
    setGuardando(true);
    setMensaje(null);
    setError(null);
    // se parte de lo guardado y se prende o apaga solo lo que tiene interruptor
    let tipos: TipoAlerta[] = tiposGuardados.filter((t) => t !== "SOS_DIRECTO" && t !== "QR_ESCANEADO");
    if (botonEmergencia) tipos = [...tipos, "SOS_DIRECTO"];
    if (escaneoQr) tipos = [...tipos, "QR_ESCANEADO"];
    try {
      await usuarioService.editarNotificacionesRecibidas(usuario.id, adulto.id, { tipoNotificaciones: tipos });
      setTiposGuardados(tipos);
      setMensaje("¡Listo! Tus avisos quedaron guardados.");
    } catch (err) {
      console.error(err);
      setError("No se pudieron guardar los cambios. Probá de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main id="contenido-principal" tabIndex={-1} className="mainBody gap-4">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Ajustes de accesibilidad" compacto />

        {cargando && <p role="status" className="text-center text-sm text-[#435059]">Cargando…</p>}
        {!cargando && !adulto && !error && (
          <p className="rounded-2xl bg-white p-4 text-sm">Todavía no estás vinculado a ningún adulto mayor.</p>
        )}

        <section aria-label="Persona vinculada" className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xs">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E7EDFB] text-[#1550E0]"><LuCircleUserRound aria-hidden="true" className="size-5" /></span>
          <div><h2 className="text-sm font-bold leading-5">{adulto?.nombreCompleto} ({etiquetaRol(adulto?.rol)})</h2><p className="mt-1 text-xs leading-4 text-[#435059]">Personalizá qué avisos recibís de {adulto?.nombreCompleto}. Por defecto vienen priorizadas las alertas críticas.</p></div>
        </section>

        <section aria-labelledby="perfil-aviso" className="rounded-2xl bg-white p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E7EDFB] text-[#1550E0]"><LuShield aria-hidden="true" className="size-4" /></span><h2 id="perfil-aviso" className="text-sm font-bold leading-5">Perfil de aviso<br />actual</h2></div>
            <span className="flex items-center gap-1 rounded-full border border-[#BAEDD3] bg-[#E8FAF1] px-2 py-1 text-xs font-bold text-[#0B4C2B]"><LuCheck aria-hidden="true" className="size-3" /> Prioridad</span>
          </div>
          <p className="mt-3 text-xs leading-4 text-[#435059]">Recomendado para familiares principales o primeros contactos de asistencia.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={activarTodas} className="min-h-11 cursor-pointer rounded-lg bg-[#1550E0] px-3 text-xs font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]">Activar todas</button>
            <button type="button" onClick={soloUrgencias} className="min-h-11 cursor-pointer rounded-lg border border-[#B7C8F0] bg-[#E7EDFB] px-3 text-xs font-semibold text-[#1550E0] hover:bg-[#D3E0F8] active:border-[#1550E0] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]">Solo urgencias</button>
          </div>
        </section>

        <section aria-labelledby="alertas-criticas" className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3"><h2 id="alertas-criticas" className="flex items-center gap-2 text-lg font-bold"><span className="flex size-8 items-center justify-center rounded-lg bg-[#FFE0DF] text-[#B52A2A]"><LuSiren aria-hidden="true" className="size-4" /></span>Alertas críticas</h2><span className="rounded-md bg-[#F9E9E9] px-2 py-0.5 text-xs font-semibold tracking-wide text-[#7D1A1A]">POR DEFECTO</span></div>
          <article className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-xs"><div className="min-w-0"><h3 className="text-sm font-bold">Botón de emergencia presionado</h3><p className="mt-1 text-xs leading-4 text-[#435059]">Notificación sonora urgente y vibración persistente.</p></div><Switch ariaLabel="Botón de emergencia presionado" checked={botonEmergencia} onChange={setBotonEmergencia} mostrarEstado /></article>
          <article className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-xs"><div className="min-w-0"><h3 className="text-sm font-bold">Escaneo de QR de emergencia</h3><p className="mt-1 text-xs leading-4 text-[#435059]">Aviso inmediato si personal médico o ambulancia consulta datos en la pulsera.</p></div><Switch ariaLabel="Escaneo de QR de emergencia" checked={escaneoQr} onChange={setEscaneoQr} mostrarEstado /></article>
        </section>

        {/* PENDIENTE BACK: no se pueden apagar estos avisos; el diseño mostraba "Modificación de esquema médico",
            "Observaciones y bitácora del día" y "Batería baja de la pulsera (48 hs)", cada uno con su interruptor */}

        {mensaje && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{mensaje}</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

        <div className="flex flex-col gap-2 pb-4">
          <button type="button" onClick={guardar} disabled={!adulto || guardando} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0] disabled:cursor-wait disabled:opacity-70"><LuCheck aria-hidden="true" className="size-4" /> {guardando ? "Guardando…" : "Guardar cambios"}</button>
          <button type="button" onClick={restablecer} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#435059] bg-white px-4 text-sm font-semibold text-[#16222C] hover:bg-[#E9EEF2] active:border-[#1550E0] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"><LuRotateCcw aria-hidden="true" className="size-4 text-[#1550E0]" /> Restablecer a valores por defecto</button>
        </div>
      </div>
    </main>
  );
}
