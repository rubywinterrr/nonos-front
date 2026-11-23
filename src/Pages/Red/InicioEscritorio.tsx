import { useEffect, type CSSProperties, type RefObject } from "react";
import type { IconType } from "react-icons";
import { Link, NavLink } from "react-router-dom";
import {
  LuActivity, LuArrowRight, LuCheck, LuChevronDown, LuClock, LuDroplet, LuFileText, LuFootprints,
  LuHeart, LuHouse, LuKeyRound, LuMoon, LuPhone, LuPill, LuShield, LuSlidersHorizontal,
  LuUserRound, LuUsersRound, LuWatch,
} from "react-icons/lu";
import type { Usuario } from "../../services/authService";
import type { AdultoMayorVinculado } from "../../services/usuariosService";
import calcularEdad from "../../utils/calcularEdad";
import { etiquetaRol } from "../../utils/etiquetaRol";
import { momentoDelDia, type TomaDelDia } from "../../utils/tomasDeHoy";

const FILA_MENU = "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl bg-white/7 px-4 py-2 font-medium text-[#c8d6df] hover:bg-white/15 active:bg-white/20";
const TARJETA = "min-w-0 rounded-3xl border border-[#d7dfe6] bg-white p-5 shadow-sm 2xl:p-7";
const BOTON_AZUL = "flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#dbe6fb] px-4 py-2 text-center font-semibold text-[#0d328b] hover:bg-[#c9dafa] active:bg-[#b7ccf7]";

function Foto({ persona, className }: { persona: Pick<Usuario, "fotoUrl">; className: string }) {
  return persona.fotoUrl ? (
    <img src={persona.fotoUrl} alt="" className={`${className} object-cover`} />
  ) : (
    <span className={`${className} flex items-center justify-center bg-[#e7edfb] text-[#1550e0]`}>
      <LuUserRound aria-hidden="true" className="size-1/3" />
    </span>
  );
}

function EnlaceMenu({ to, icono: Icono, texto }: { to: string; icono: IconType; texto: string }) {
  return (
    <NavLink
      to={to}
      end={!to.endsWith("/home")}
      className={({ isActive }) => isActive
        ? "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl bg-[#1550e0] px-4 py-2 font-semibold text-white shadow-md shadow-[#1550e0]/30 hover:bg-[#1245bf] active:bg-[#0f389d]"
        : FILA_MENU}
    >
      <Icono aria-hidden="true" className="size-5 shrink-0" />
      {texto}
    </NavLink>
  );
}

export function MenuInicioRed({ usuario, adulto, adultos, cargando, estadoPulsera, selector, abrirSelector, elegirAdulto }: {
  usuario: Usuario | null;
  adulto: AdultoMayorVinculado | null;
  adultos: AdultoMayorVinculado[];
  cargando: boolean;
  estadoPulsera: string;
  selector: RefObject<HTMLDetailsElement | null>;
  abrirSelector: () => void;
  elegirAdulto: (id: string) => void;
}) {
  const nombre = adulto?.nombreCompleto.trim().split(/\s+/)[0];
  const esCuidador = usuario?.rol === "CUIDADOR";
  const rutaBase = esCuidador ? "/cuidador" : "/familia";

  useEffect(() => {
    const cerrarAlTocarFuera = (event: PointerEvent) => {
      const menu = selector.current;
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
    };
    document.addEventListener("pointerdown", cerrarAlTocarFuera);
    return () => document.removeEventListener("pointerdown", cerrarAlTocarFuera);
  }, [selector]);

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-(--ancho-menu-inicio) lg:flex-col lg:gap-3 lg:overflow-y-auto lg:overscroll-contain lg:bg-[#16222c] lg:bg-radial-[at_top_left] lg:from-[#1550e0] lg:from-0% lg:via-[#16222c] lg:via-28% lg:to-[#16222c] lg:p-4 lg:text-white xl:p-5">
      <div className="flex items-center gap-3 px-2 py-3">
        <img src="/logo/isotipo-cuadrado.png" alt="" className="size-12 shrink-0 rounded-xl bg-[#0a2666] p-1.5 object-contain" />
        <div>
          <p className="text-2xl font-bold leading-tight">NONOS</p>
          <p className="text-xs text-[#c8d6df]">Cuidado de mayores</p>
        </div>
      </div>

      {adulto ? (
        <details
          ref={selector}
          className="group relative shrink-0"
          onKeyDown={(event) => {
            if (event.key !== "Escape" || !event.currentTarget.open) return;
            event.preventDefault();
            event.currentTarget.open = false;
            event.currentTarget.querySelector("summary")?.focus();
          }}
        >
          <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl border border-white/15 bg-[#0e1821] p-3 hover:bg-[#24313b] active:bg-[#303f4a] [&::-webkit-details-marker]:hidden">
            <Foto persona={adulto} className="size-10 shrink-0 rounded-full" />
            <span className="flex min-w-0 flex-col">
              <span className="font-semibold leading-tight">{adulto.nombreCompleto}</span>
              <span className="text-xs text-[#c8d6df]">Persona a cargo</span>
            </span>
            <LuChevronDown aria-hidden="true" className="ml-auto size-5 shrink-0 group-open:rotate-180" />
          </summary>
          <ul aria-label="Adultos vinculados" className="absolute inset-x-0 top-full z-10 mt-2 flex max-h-56 flex-col gap-1 overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-[#0e1821] p-2 shadow-lg">
            {adultos.map((persona) => {
              const activa = persona.id === adulto.id;
              return (
                <li key={persona.id}>
                  <button
                    type="button"
                    aria-pressed={activa}
                    onClick={() => {
                      elegirAdulto(persona.id);
                      if (selector.current) {
                        selector.current.querySelector("summary")?.focus();
                        selector.current.open = false;
                      }
                    }}
                    className={`flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm font-semibold hover:bg-[#24313b] active:bg-[#303f4a] ${activa ? "bg-[#213660] text-white" : "text-[#c8d6df]"}`}
                  >
                    <Foto persona={persona} className="size-8 shrink-0 rounded-full" />
                    <span>{persona.nombreCompleto}</span>
                    {activa && <LuCheck aria-hidden="true" className="ml-auto size-4 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </details>
      ) : (
        <p className="rounded-2xl border border-white/15 bg-[#0e1821] p-3 text-sm text-[#c8d6df]" role={cargando ? "status" : undefined}>
          {cargando ? "Cargando…" : "Todavía no tenés adultos vinculados."}
        </p>
      )}

      <nav aria-label="Navegación principal" className="flex flex-col gap-1.5">
        <EnlaceMenu to={`${rutaBase}/home`} icono={LuHouse} texto="Inicio" />
        <EnlaceMenu to={`${rutaBase}/signos`} icono={LuActivity} texto="Signos vitales" />
        <EnlaceMenu to={`${rutaBase}/${esCuidador ? "medicamentos" : "medicacion"}`} icono={LuPill} texto="Medicinas" />
        <EnlaceMenu to={`${rutaBase}/historial/adulto`} icono={LuClock} texto="Historial" />
        <EnlaceMenu to={`${rutaBase}/codigo-emergencia`} icono={LuKeyRound} texto="Código médico" />
        <EnlaceMenu to={`${rutaBase}/contactos`} icono={LuPhone} texto="Contactos" />

        <p className="mt-3 text-xs font-semibold tracking-wide text-[#c8d6df] uppercase">{nombre ? `Información de ${nombre}` : "Información del adulto"}</p>
        <EnlaceMenu to={`${rutaBase}/info/adulto`} icono={LuFileText} texto={nombre ? `Ficha de ${nombre}` : "Ficha del adulto"} />
        {esCuidador ? (
          <EnlaceMenu to={`${rutaBase}/adultos-a-cargo`} icono={LuUsersRound} texto="Personas a cargo" />
        ) : adulto && (
          <button type="button" onClick={abrirSelector} className={`${FILA_MENU} text-left`}><LuUsersRound aria-hidden="true" className="size-5 shrink-0" />Personas a cargo</button>
        )}
        <EnlaceMenu to={`${rutaBase}/medidas-anticipadas`} icono={LuShield} texto="Medidas anticipadas" />

        <p className="mt-3 text-xs font-semibold tracking-wide text-[#c8d6df] uppercase">Configuración</p>
        <EnlaceMenu to={`${rutaBase}/configuracion`} icono={LuSlidersHorizontal} texto="Avisos" />
        <EnlaceMenu to="/cuenta" icono={LuUserRound} texto="Mi cuenta" />
      </nav>

      <div className="mt-auto flex flex-col gap-2 pt-5">
        {adulto && (
          <div className="flex items-center gap-3 rounded-2xl border border-[#137a45]/50 bg-[#137a45]/15 p-3">
            <LuWatch aria-hidden="true" className="size-7 shrink-0 text-[#baedd4]" />
            <p className="text-sm font-semibold">{estadoPulsera}</p>
          </div>
        )}
        {usuario && (
          <Link to="/cuenta" className={FILA_MENU}>
            <Foto persona={usuario} className="size-9 shrink-0 rounded-full" />
            <div>
              <p className="font-semibold text-white">{usuario.nombreCompleto}</p>
              <p className="text-xs">{etiquetaRol(usuario.rol)}</p>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}

function Rutina({ proxima, tomas, estado }: {
  proxima: TomaDelDia | null;
  tomas: { hechas: number; total: number } | null;
  estado: string;
}) {
  const porcentaje = tomas?.total ? Math.max(0, Math.min(100, (tomas.hechas / tomas.total) * 100)) : 0;
  return (
    <section aria-labelledby="rutina-escritorio" className={`${TARJETA} flex flex-1 flex-col justify-between gap-4`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="rutina-escritorio" className="text-xl font-bold">Rutina de hoy</h2>
        {proxima && <span className="rounded-full border border-[#b7c8f0] bg-[#e7edfb] px-2.5 py-1 text-xs font-semibold text-[#0d328b]">Próxima {proxima.horario}</span>}
      </div>
      <div
        className="mx-auto flex aspect-square w-full max-w-36 shrink-0 items-center justify-center rounded-full bg-[#e7edfb] bg-[conic-gradient(#1550e0_0%_var(--avance),#e7edfb_var(--avance)_100%)] p-3"
        style={{ "--avance": `${porcentaje}%` } as CSSProperties}
      >
        <div className="flex size-full flex-col items-center justify-center rounded-full bg-white text-center">
          <p className="text-2xl font-bold">{tomas ? `${tomas.hechas} de ${tomas.total}` : "—"}</p>
          <p className="text-sm text-[#54646f]">tomas de hoy</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-[#edf2fd] p-3">
        <LuPill aria-hidden="true" className="size-9 shrink-0 rounded-xl bg-[#e7edfb] p-2 text-[#0d328b]" />
        <div>
          <p className="font-semibold">{proxima ? `${proxima.medicamento.nombre} ${proxima.medicamento.dosis}` : estado}</p>
          {proxima && <p className="text-sm text-[#54646f]">Próxima: {proxima.horario} hs ({momentoDelDia(proxima.horario)})</p>}
        </div>
      </div>
    </section>
  );
}

function TarjetaSigno({ titulo, valor, unidad, detalle, icono: Icono, azul = false }: {
  titulo: string;
  valor: number | string | null;
  unidad?: string;
  detalle?: string;
  icono: IconType;
  azul?: boolean;
}) {
  return (
    <article className={`${TARJETA} flex flex-col gap-3`}>
      <h3 className="flex items-center gap-2 font-semibold text-[#54646f]">
        <Icono aria-hidden="true" className={`size-9 shrink-0 rounded-xl p-2 ${azul ? "bg-[#e7edfb] text-[#0d328b]" : "bg-[#e8faf1] text-[#0b4c2b]"}`} />
        {titulo}
      </h3>
      <p className="flex flex-wrap items-baseline gap-x-2 text-4xl font-bold">
        {valor ?? "—"}
        {unidad && <span className="text-sm font-normal text-[#54646f]">{unidad}</span>}
      </p>
      {detalle && <p className="text-sm text-[#54646f]">{detalle}</p>}
    </article>
  );
}

interface ResumenProps {
  adulto: AdultoMayorVinculado | null;
  abrirSelector?: () => void;
  estadoPulsera: string;
  sincronizacion?: string;
  estadoAlerta: "pendiente" | "estable" | "sin-datos";
  alertas72hs: number | null;
  pulso: number | null;
  oxigeno: number | null;
  detalleOxigeno?: string;
  pasos: number | null;
  descanso: string | null;
  detalleDescanso?: string;
  proxima: TomaDelDia | null;
  tomas: { hechas: number; total: number } | null;
  estadoMedicacion: string;
  contacto: { nombre: string; telefono: string } | null;
}

export function ResumenInicioRed({ adulto, abrirSelector, estadoPulsera, sincronizacion,
  estadoAlerta, alertas72hs, pulso, oxigeno, detalleOxigeno, pasos, descanso, detalleDescanso, proxima,
  tomas, estadoMedicacion, contacto,
}: ResumenProps) {
  const nombreCorto = adulto?.nombreCompleto.trim().split(/\s+/)[0];

  return (
    <div className="hidden lg:flex lg:flex-col lg:gap-5 2xl:gap-6">
      <div className="grid grid-cols-3 gap-4 2xl:gap-6">
        {adulto && (
          <section aria-labelledby="persona-escritorio" className="relative isolate col-span-2 flex flex-wrap items-center gap-5 overflow-hidden rounded-3xl bg-linear-to-br from-[#0d2e7b] via-[#103686] to-[#1550e0] p-6 text-white shadow-lg 2xl:gap-8 2xl:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -top-52 -right-16 -z-10 size-96 rounded-full bg-white/5" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-40 -bottom-56 -z-10 size-96 rounded-full bg-white/5" />
            <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
              <p className="text-sm font-semibold tracking-wider text-[#ccdaef] uppercase">Persona a cargo</p>
              <h2 id="persona-escritorio" className="text-4xl leading-tight font-bold 2xl:text-5xl">{adulto.nombreCompleto}</h2>
              <div className="flex flex-wrap gap-2 text-sm font-semibold">
                {estadoAlerta !== "sin-datos" && (
                  <span className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
                    <span aria-hidden="true" className={`size-2 rounded-full ${estadoAlerta === "pendiente" ? "bg-[#ffb4a4]" : "bg-[#baedd4]"}`} />
                    {estadoAlerta === "pendiente" ? "Alerta pendiente" : "Todo en orden"}
                  </span>
                )}
                {adulto.fechaNacimiento && <span className="rounded-full bg-white/15 px-3 py-1">{calcularEdad(adulto.fechaNacimiento)} años</span>}
                <span className="rounded-full bg-white/15 px-3 py-1">{estadoPulsera}</span>
              </div>
              {sincronizacion && <p className="text-sm text-[#ccdaef]">{sincronizacion}</p>}
              {abrirSelector && (
                <button type="button" onClick={abrirSelector} className={BOTON_AZUL}><LuUsersRound aria-hidden="true" className="size-5 shrink-0" />Ver a otra persona</button>
              )}
            </div>
            <div className="hidden aspect-5/6 w-1/3 shrink-0 xl:block">
              <Foto persona={adulto} className="size-full rounded-3xl border-3 border-white/30" />
            </div>
          </section>
        )}

        {adulto && <Rutina proxima={proxima} tomas={tomas} estado={estadoMedicacion} />}
      </div>

      {adulto && (
        <>
          <section aria-labelledby="supervision-escritorio" className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="supervision-escritorio" className="text-2xl font-bold">Supervisión médica</h2>
              {estadoAlerta !== "sin-datos" && (
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${estadoAlerta === "pendiente" ? "border-[#ffb4a4] bg-[#ffdbd2] text-[#ad2b00]" : "border-[#baedd3] bg-[#e8faf1] text-[#0b4c2b]"}`}>
                  {estadoAlerta === "pendiente" ? "REVISAR" : "ESTABLE"}
                </span>
              )}
              <Link to="../signos" className={`${BOTON_AZUL} ml-auto`}><LuArrowRight aria-hidden="true" className="size-5 shrink-0" />Ver todos los datos de salud</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 2xl:gap-6">
              <TarjetaSigno titulo="Pulso" valor={pulso} unidad="lpm" icono={LuHeart} />
              <TarjetaSigno titulo="Oxígeno" valor={oxigeno} unidad="%" detalle={detalleOxigeno} icono={LuDroplet} />
              <TarjetaSigno titulo="Movilidad" valor={pasos?.toLocaleString("es-AR") ?? null} unidad="pasos" icono={LuFootprints} azul />
              <TarjetaSigno titulo="Descanso" valor={descanso} detalle={detalleDescanso} icono={LuMoon} />
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:gap-6">
            <section className={`${TARJETA} flex flex-col gap-3`} aria-labelledby="incidentes-escritorio">
              <h2 id="incidentes-escritorio" className="flex items-center gap-2 font-bold"><LuShield aria-hidden="true" className="size-9 shrink-0 rounded-xl bg-[#e8faf1] p-2 text-[#0b4c2b]" />Incidentes y caídas</h2>
              <p className="text-2xl font-bold">{alertas72hs === null ? "Sin datos" : alertas72hs === 0 ? "Sin alertas" : `${alertas72hs} ${alertas72hs === 1 ? "alerta" : "alertas"}`}</p>
              <p className="text-sm text-[#54646f]">En las últimas 72 hs</p>
            </section>

            <section className={`${TARJETA} flex flex-col gap-3`} aria-labelledby="codigo-escritorio">
              <h2 id="codigo-escritorio" className="flex items-center gap-2 font-bold"><LuKeyRound aria-hidden="true" className="size-9 shrink-0 rounded-xl bg-[#e7edfb] p-2 text-[#0d328b]" />Código médico</h2>
              <p className="text-sm text-[#54646f]">Para guardia / SAME</p>
              <Link to="../codigo-emergencia" className={`${BOTON_AZUL} mt-auto`}><LuArrowRight aria-hidden="true" className="size-4 shrink-0" />Ver código</Link>
            </section>

            <section className={`${TARJETA} flex flex-col gap-3`} aria-labelledby="llamadas-escritorio">
              <h2 id="llamadas-escritorio" className="flex items-center gap-2 font-bold"><LuPhone aria-hidden="true" className="size-9 shrink-0 rounded-xl bg-[#ffebe8] p-2 text-[#ad2b00]" />Llamadas rápidas</h2>
              <Llamada nombre="Ambulancia" telefono="107" />
              {adulto.telefono && <Llamada nombre={nombreCorto || adulto.nombreCompleto} telefono={adulto.telefono} />}
              {contacto && <Llamada nombre={contacto.nombre} telefono={contacto.telefono} />}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function Llamada({ nombre, telefono }: { nombre: string; telefono: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="font-semibold">{nombre}</p>
      <a href={`tel:${telefono}`} aria-label={`Llamar a ${nombre}`} className={BOTON_AZUL}>
        <LuPhone aria-hidden="true" className="size-4 shrink-0" />Llamar
      </a>
    </div>
  );
}
