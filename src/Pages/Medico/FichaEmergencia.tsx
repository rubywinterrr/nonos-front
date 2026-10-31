import {
  LuActivity,
  LuCheck,
  LuClipboardCheck,
  LuInfo,
  LuPhone,
  LuPill,
  LuShieldCheck,
  LuStethoscope,
  LuTimer,
  LuTriangleAlert,
  LuUserRound,
} from "react-icons/lu";
import type { FichaEmergencia as Ficha } from "../../services/fichaEmergenciaService";
import type { Condicion } from "../../services/condicionesService";
import { momentoDelDia } from "../../utils/tomasDeHoy";

interface Props {
  ficha: Ficha;
  // lo que queda de los 30 minutos, ya armado ("27 min 52s")
  tiempoRestante: string;
  onFinalizar: () => void;
}

// mismos textos que usa la pantalla de Medidas anticipadas para separar las partes
const TEXTO_EVITAR = "Para evitar en una emergencia:";
const TEXTO_ACOMPANANTE = "\n\nQuién quiero que me acompañe:";
const TEXTO_ATENCION = "\n\nCómo prefiero ser atendido:";

// separa las medidas anticipadas en "decisiones" e "internación";
// si el texto no tiene ese formato, va completo en "decisiones"
function separarMedidas(texto: string) {
  const inicioAcompanante = texto.indexOf(TEXTO_ACOMPANANTE);
  const inicioAtencion = texto.indexOf(TEXTO_ATENCION);
  if (!texto.startsWith(TEXTO_EVITAR) || inicioAcompanante === -1 || inicioAtencion === -1) {
    return { decisiones: texto, internacion: "" };
  }
  return {
    decisiones: texto.slice(TEXTO_EVITAR.length, inicioAcompanante).trim(),
    internacion: texto.slice(inicioAtencion + TEXTO_ATENCION.length).trim(),
  };
}

// es una alergia si el nombre de la condición dice "alergia" o "alérgico"
// PENDIENTE BACK: no hay un campo aparte para alergias
function esAlergia(condicion: Condicion) {
  const nombre = condicion.nombre.toLowerCase();
  return nombre.includes("alergi") || nombre.includes("alérgi");
}

// "20 de octubre de 2026"
function fechaLarga(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

// primer nombre ("Sofía Gómez" → "Sofía")
function primerNombre(nombre: string) {
  return nombre.trim().split(" ")[0];
}

// la ficha médica de emergencia que ve el médico durante los 30 minutos
export default function FichaEmergencia({ ficha, tiempoRestante, onFinalizar }: Props) {
  const alergias = ficha.condiciones.filter((c) => esAlergia(c));
  const diagnosticos = ficha.condiciones.filter((c) => !esAlergia(c));
  const contactos = ficha.contactosDeEmergencia.filter((c) => c.telefono);
  const medidas = ficha.medidasAnticipadas ? separarMedidas(ficha.medidasAnticipadas) : null;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 text-[#16222C]">
      <section className="flex flex-col gap-3 rounded-2xl bg-[#1550E0] p-4 text-white" aria-label="Sesión activa">
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-[#FF4D4D]" />
          Ficha médica de emergencia
        </p>
        <p className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm text-[#16222C]">
          <span className="flex items-center gap-2">
            <LuTimer aria-hidden="true" className="size-5 text-[#1550E0]" />
            Sesión externa: {tiempoRestante}
          </span>
          <span className="text-xs font-bold">● ACTIVA</span>
        </p>
      </section>

      {alergias.length > 0 && (
        <section role="alert" className="flex flex-col gap-3 rounded-2xl border-2 border-[#C92A2A] bg-[#FBE9E9] p-4">
          <div className="flex items-start gap-3">
            <LuTriangleAlert aria-hidden="true" className="size-10 shrink-0 rounded-lg bg-[#C92A2A] p-2 text-white" />
            <div>
              <h2 className="text-lg font-bold uppercase leading-6 text-[#A92323]">Alergia crítica confirmada</h2>
              <p className="text-sm font-semibold">Advertencia de seguridad para paramédicos / SAME</p>
            </div>
          </div>
          {alergias.map((alergia) => (
            <div key={alergia.id} className="rounded-xl border border-[#F1C8C5] bg-white p-4">
              <p className="text-lg font-bold leading-6 text-[#C92A2A]">{alergia.nombre}</p>
              {alergia.descripcion && <p className="mt-2 text-sm leading-5 text-[#435059]">{alergia.descripcion}</p>}
            </div>
          ))}
        </section>
      )}

      <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="paciente">
        <div className="flex items-center gap-4">
          <LuUserRound aria-hidden="true" className="size-16 shrink-0 rounded-full border-2 border-[#B7C8F0] bg-[#E7EDFB] p-3 text-[#1550E0]" />
          <div>
            <h2 id="paciente" className="text-2xl font-bold">{ficha.nombreCompleto}</h2>
            {ficha.edad !== null && <p className="text-base text-[#435059]">{ficha.edad} años</p>}
          </div>
        </div>
        {/* PENDIENTE BACK: /qr/:id/acceder no devuelve DNI, nacimiento, grupo sanguíneo, cobertura ni sanatorio.
            Por decisión del equipo quedan los datos del diseño hasta que el back los mande */}
        <dl className="flex flex-col divide-y divide-[#B7C8F0] rounded-xl border border-[#B7C8F0] bg-[#E7EDFB]">
          <div className="p-3">
            <dt className="text-xs text-[#435059]">Documento (DNI)</dt>
            <dd className="font-bold">7.842.119</dd>
          </div>
          <div className="p-3">
            <dt className="text-xs text-[#435059]">Fecha de nacimiento</dt>
            <dd className="font-bold">12/05/1946</dd>
          </div>
          <div className="p-3">
            <dt className="text-xs text-[#435059]">Grupo sanguíneo</dt>
            <dd className="font-bold">0+ Positivo</dd>
          </div>
          <div className="p-3">
            <dt className="text-xs text-[#435059]">Cobertura médica</dt>
            <dd className="font-bold">PAMI · Afiliado N° 1502938492</dd>
          </div>
          <div className="p-3">
            <dt className="text-xs text-[#435059]">Sanatorio habitual</dt>
            <dd className="font-bold">Sanatorio San Cayetano</dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="contactos-auxilio">
        <h2 id="contactos-auxilio" className="flex items-center gap-3 text-lg font-bold">
          <LuPhone aria-hidden="true" className="size-8 shrink-0 rounded-lg bg-[#1550E0] p-1.5 text-white" />
          Contactos de Auxilio Inmediato
        </h2>
        {contactos.length === 0 && (
          <p className="rounded-xl bg-[#E7EDFB] p-4 text-sm">No tiene contactos de emergencia con teléfono cargados.</p>
        )}
        {contactos.map((contacto, indice) => (
          <article key={`${contacto.telefono}-${indice}`} className="flex flex-col gap-3 rounded-xl bg-[#E7EDFB] p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold">{contacto.nombreCompleto}</h3>
                {/* PENDIENTE BACK: falta el parentesco ("Hija"); el back solo manda nombre y teléfono */}
                <p className="text-sm text-[#435059]">Contacto de emergencia</p>
              </div>
              <p className="text-sm">{contacto.telefono}</p>
            </div>
            <a
              href={`tel:${contacto.telefono}`}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl font-semibold ${
                indice === 0
                  ? "bg-[#1550E0] text-white hover:bg-[#1245BF] active:bg-[#0F389D]"
                  : "border border-[#435059] bg-white text-[#16222C] hover:bg-[#E9EEF2]"
              }`}
            >
              <LuPhone aria-hidden="true" className="size-5" />
              Llamar a {primerNombre(contacto.nombreCompleto || "")}
            </a>
          </article>
        ))}
        {/* PENDIENTE BACK: no hay dato del médico de cabecera; queda el del diseño */}
        <article className="flex flex-col gap-3 rounded-xl bg-[#E7EDFB] p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold">Dr. Esteban Martínez</h3>
              <p className="text-sm text-[#435059]">Médico de cabecera</p>
            </div>
            <p className="text-sm">+54 11 4455- 8477</p>
          </div>
          <a
            href="tel:+541144558477"
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#435059] bg-white font-semibold text-[#16222C] hover:bg-[#E9EEF2]"
          >
            <LuPhone aria-hidden="true" className="size-5" />
            Llamar a Esteban
          </a>
        </article>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="diagnosticos">
        <h2 id="diagnosticos" className="flex items-center gap-3 text-lg font-bold">
          <LuStethoscope aria-hidden="true" className="size-6 shrink-0" />
          Diagnósticos e Historial Activo
        </h2>
        {diagnosticos.length === 0 && <p className="rounded-xl bg-[#E7EDFB] p-4 text-sm">No tiene diagnósticos cargados.</p>}
        {diagnosticos.map((condicion) => (
          <article key={condicion.id} className="flex items-start gap-3 rounded-xl bg-[#E7EDFB] p-4">
            <LuActivity aria-hidden="true" className="size-9 shrink-0 rounded-lg bg-white p-2 text-[#1550E0]" />
            <div>
              <h3 className="font-bold">{condicion.nombre}</h3>
              {condicion.descripcion && <p className="text-sm leading-5 text-[#435059]">{condicion.descripcion}</p>}
            </div>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="medicacion">
        <div className="flex items-center justify-between gap-2">
          <h2 id="medicacion" className="flex items-center gap-3 text-lg font-bold">
            <LuPill aria-hidden="true" className="size-6 shrink-0" />
            Medicación Prescripta
          </h2>
          <span className="rounded-full bg-[#E8FAF1] px-3 py-1 text-sm font-semibold text-[#0B4C2B]">
            {ficha.medicacionActual.length} {ficha.medicacionActual.length === 1 ? "fármaco" : "fármacos"}
          </span>
        </div>
        {ficha.medicacionActual.length === 0 && <p className="rounded-xl bg-[#E7EDFB] p-4 text-sm">No tiene medicación cargada.</p>}
        {ficha.medicacionActual.map((remedio) => (
          <article key={remedio.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#E7EDFB] p-4">
            <div>
              <h3 className="font-bold">{remedio.nombre}</h3>
              <p className="text-sm text-[#435059]">{remedio.dosis}</p>
            </div>
            {remedio.horariosDelDia.length > 0 && (
              <span className="rounded-full border border-[#B7C8F0] bg-white px-3 py-1 text-sm font-semibold">
                {momentoDelDia(remedio.horariosDelDia[0])}
              </span>
            )}
          </article>
        ))}
        {/* PENDIENTE BACK: no se guarda quién indicó el esquema ("Dra. Valenzuela"), queda el texto del diseño */}
        <p className="flex items-start gap-2 rounded-xl bg-[#E7EDFB] p-3 text-sm leading-5">
          <LuInfo aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#1550E0]" />
          Esquema indicado por Dra. Valenzuela. NONOS no certifica ingesta en tiempo real; refiere al esquema prescripto
          registrado.
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="directivas">
        <h2 id="directivas" className="flex items-center gap-3 text-lg font-bold">
          <LuClipboardCheck aria-hidden="true" className="size-6 shrink-0 text-[#1550E0]" />
          Directivas Anticipadas
        </h2>
        {!medidas && <p className="rounded-xl bg-[#E7EDFB] p-4 text-sm">No tiene directivas anticipadas cargadas.</p>}
        {medidas && medidas.decisiones && (
          <div className="rounded-xl bg-[#E7EDFB] p-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#0D328B]">Decisiones críticas de salud</h3>
            <p className="mt-2 text-base leading-6">"{medidas.decisiones}"</p>
          </div>
        )}
        {medidas && medidas.internacion && (
          <div className="rounded-xl bg-[#E7EDFB] p-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#0D328B]">Internación y entorno</h3>
            <p className="mt-2 text-base leading-6">"{medidas.internacion}"</p>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-xs">
        <p className="flex items-start gap-2">
          <LuShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#1550E0]" />
          <span>
            <span className="block font-bold">Última actualización: {fechaLarga(ficha.fechaUltimaActualizacion)}</span>
            {/* PENDIENTE BACK: no se sabe quién hizo la última carga */}
            <span className="text-sm text-[#435059]">Cargado por Dra. Valenzuela</span>
          </span>
        </p>
        {/* PENDIENTE BACK: el back no registra los accesos (ID de auditoría) ni manda el id de la pulsera */}
        <p className="flex flex-wrap justify-between gap-2 border-t border-[#D7DFE6] pt-3 text-xs text-[#435059]">
          <span>ID AUDITORÍA: #ACC-98721</span>
          <span>Pulsera NFC: #RG-8830</span>
        </p>
      </section>

      <button
        type="button"
        onClick={onFinalizar}
        className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white shadow-sm hover:bg-[#1245BF] active:bg-[#0F389D]"
      >
        <LuCheck aria-hidden="true" className="size-5" />
        Finalizar consulta
      </button>
    </div>
  );
}
