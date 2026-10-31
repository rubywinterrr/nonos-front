import {
  LuBriefcaseMedical,
  LuCircleHelp,
  LuHourglass,
  LuLockKeyhole,
  LuPhone,
  LuRectangleEllipsis,
  LuShieldAlert,
  LuShieldCheck,
  LuTimerOff,
} from "react-icons/lu";

interface Props {
  // "vencido": el código caducó (410). "usado": ya se usó en este celular (el back lo invalida al entrar)
  motivo: "vencido" | "usado";
  onIngresarOtro: () => void;
}

// pasos de "¿Qué hacer ahora?" para cada motivo (textos del diseño)
const pasosVencido = [
  {
    titulo: "Contactar al cuidador",
    texto: "Pedile al familiar o cuidador a cargo que abra su aplicación y te facilite el código activo que se muestra en pantalla.",
  },
  { titulo: "Generación inmediata", texto: "El familiar puede generar un nuevo código de forma inmediata desde su cuenta." },
  {
    titulo: "Desbloqueo de información",
    texto: "Una vez que te lo brinde, ingresalo para desbloquear la ficha médica durante 30 minutos.",
  },
];
const pasosUsado = [
  { titulo: "Pedir nuevo código", texto: "Solicitá a la familia o cuidador a cargo un nuevo código de acceso vigente." },
  { titulo: "Emisión inmediata", texto: "Ellos pueden emitir un código actualizado desde su cuenta." },
  { titulo: "Continuar consulta", texto: "Ingresá el nuevo código generado para ingresar a la sesión clínica por 30 minutos." },
];

// pantallas "Este código ha vencido" y "Código ya utilizado"
export default function PantallaCodigoInvalido({ motivo, onIngresarOtro }: Props) {
  const pasos = motivo === "vencido" ? pasosVencido : pasosUsado;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 text-[#16222C]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#E7EDFB] text-[#1550E0]">
            <LuBriefcaseMedical aria-hidden="true" className="size-6" />
          </span>
          <div>
            <h1 className="text-lg font-semibold leading-6">
              {motivo === "vencido" ? "Ficha Médica" : "Ficha Médica de Emergencia"}
            </h1>
            <p className={`text-sm font-semibold ${motivo === "vencido" ? "text-[#0B6D3C]" : ""}`}>Validación de código</p>
          </div>
        </div>
        {motivo === "vencido" && (
          <span className="flex items-center gap-1 rounded-full border border-[#F1C8C5] bg-[#FBE9E9] px-2 py-1 text-sm font-bold text-[#A92323]">
            <LuLockKeyhole aria-hidden="true" className="size-4" />
            30m
          </span>
        )}
      </div>

      {motivo === "vencido" && (
        <section role="alert" className="flex flex-col items-center gap-3 rounded-xl border-2 border-[#C92A2A] bg-[#FBE9E9] p-5 text-center">
          <LuHourglass aria-hidden="true" className="size-16 rounded-full border border-[#F1C8C5] bg-[#FBE9E9] p-4 text-[#C92A2A]" />
          <span className="flex items-center gap-1.5 rounded-full border border-[#F1C8C5] bg-white/60 px-3 py-1 text-sm font-semibold text-[#A92323]">
            <LuTimerOff aria-hidden="true" className="size-4" />
            Acceso temporal expirado
          </span>
          <h2 className="text-2xl font-bold">Este código ha vencido</h2>
          <p className="text-sm leading-6 text-[#435059]">
            El código ingresado caducó. Los códigos temporales se renuevan automáticamente cada 30 minutos.
          </p>
        </section>
      )}

      {motivo === "usado" && (
        <section role="alert" className="flex flex-col gap-3 rounded-2xl border border-[#F1C8C5] bg-[#FBE9E9] p-5">
          <div className="flex items-center gap-4">
            <LuShieldAlert aria-hidden="true" className="size-11 shrink-0 rounded-xl border border-[#F1C8C5] bg-white p-2 text-[#C92A2A]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#A92323]">Aviso de seguridad</p>
              <h2 className="text-lg font-bold">Código ya utilizado</h2>
            </div>
          </div>
          <p className="text-sm leading-6 text-[#435059]">
            Por privacidad médica y protección de la historia clínica, este código de 6 dígitos es de un solo uso por
            consulta y ha quedado invalidado de forma permanente.
          </p>
          <p className="flex items-center gap-2 border-t border-[#F1C8C5] pt-3 text-sm font-semibold text-[#0B6D3C]">
            <LuShieldCheck aria-hidden="true" className="size-4" />
            Sesión segura • Privacidad garantizada
          </p>
        </section>
      )}

      <section className="rounded-2xl bg-white p-4 shadow-xs" aria-labelledby="que-hacer">
        <h2 id="que-hacer" className="flex items-center gap-2 border-b border-[#B7C8F0] pb-3 text-lg font-bold">
          <LuCircleHelp aria-hidden="true" className="size-5 text-[#1550E0]" />
          ¿Qué hacer ahora?
        </h2>
        <ol className="mt-4 flex flex-col gap-5">
          {pasos.map((paso, indice) => (
            <li key={paso.titulo} className="flex items-start gap-4">
              <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E7EDFB] text-sm font-bold text-[#0D328B]">
                {indice + 1}
              </span>
              <div>
                <h3 className="font-semibold">{paso.titulo}</h3>
                <p className="text-sm leading-5 text-[#435059]">{paso.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onIngresarOtro}
          className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-4 font-semibold text-white hover:bg-[#1245BF] active:bg-[#0F389D]"
        >
          <LuRectangleEllipsis aria-hidden="true" className="size-5" />
          Ingresar nuevo código activo
        </button>
        {/* PENDIENTE BACK: sin código válido no hay datos de la red. Queda el número del diseño (Sofía Gómez) */}
        <a
          href="tel:+541144556677"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E7EDFB] px-4 font-semibold text-[#16222C] shadow-sm hover:bg-[#D3E0F8] active:bg-[#B7C8F0]"
        >
          <LuPhone aria-hidden="true" className="size-5" />
          Llamar a la red de cuidado
        </a>
      </div>

      <p className="flex items-center justify-center gap-2 text-sm text-[#435059]">
        <LuShieldCheck aria-hidden="true" className="size-4 text-[#0B6D3C]" />
        Acceso trazable y auditado por seguridad médica
      </p>
    </div>
  );
}
