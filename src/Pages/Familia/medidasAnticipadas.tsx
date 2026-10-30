import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { LuCheck, LuInfo, LuLockKeyhole, LuPencil, LuRotateCcw, LuUserRound, LuUsersRound } from "react-icons/lu";

export default function MedidasAnticipadas() {
  return (
    <main className="mainBody gap-4">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Medidas anticipadas" />

        <section aria-label="Información sobre medidas anticipadas" className="flex w-full items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
          <LuInfo aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#4A7FBF]" />
          <p className="text-sm leading-6 text-gray-600">
            Estas medidas fueron registradas por José y consensuadas con la familia para guiar a los médicos y cuidadores en situaciones críticas.
          </p>
        </section>

        <section aria-label="Medidas anticipadas registradas" className="flex w-full flex-col gap-4">
          <article className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <LuUsersRound aria-hidden="true" className="size-10 shrink-0 rounded-xl border border-gray-200 bg-gray-100 p-2 text-[#4A7FBF]" />
              <h2 className="text-lg font-semibold">Decisiones críticas</h2>
            </div>
            <blockquote className="w-full rounded-r-lg border-l-4 border-[#1550E0] bg-gray-100 p-4 text-base italic leading-6 text-[#16222C]">
              “Quiero que mi hija Sofía esté presente en todo momento y tome las decisiones de atención si yo no puedo.”
            </blockquote>
            <p className="flex items-start gap-2 text-sm leading-5 text-gray-600">
              <LuUserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>Registrado por Roberto Gómez <span className="font-bold text-[#16222C]">(confirmado por Sofía Gómez)</span>.</span>
            </p>
            <button type="button" className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E9EEF6] p-3 text-base font-medium text-[#16222C] hover:bg-gray-200 active:border active:border-[#1550E0] active:bg-[#B7C8F0]">
              <LuPencil aria-hidden="true" className="size-4 text-[#1550E0]" />Editar indicación
            </button>
          </article>

          <article className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <LuUsersRound aria-hidden="true" className="size-10 shrink-0 rounded-xl border border-gray-200 bg-gray-100 p-2 text-[#4A7FBF]" />
              <h2 className="text-lg font-semibold">Decisiones críticas</h2>
            </div>
            <blockquote className="w-full rounded-r-lg border-l-4 border-[#1550E0] bg-gray-100 p-4 text-base italic leading-6 text-[#16222C]">
              “Quiero que mi hija Sofía esté presente en todo momento y tome las decisiones de atención si yo no puedo.”
            </blockquote>
            <p className="flex items-start gap-2 text-sm leading-5 text-gray-600">
              <LuUserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>Registrado por Roberto Gómez <span className="font-bold text-[#16222C]">(confirmado por Sofía Gómez)</span>.</span>
            </p>
            <button type="button" className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E9EEF6] p-3 text-base font-medium text-[#16222C] hover:bg-gray-200 active:border active:border-[#1550E0] active:bg-[#B7C8F0]">
              <LuPencil aria-hidden="true" className="size-4 text-[#1550E0]" />Editar indicación
            </button>
          </article>

          <article className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <LuUsersRound aria-hidden="true" className="size-10 shrink-0 rounded-xl border border-gray-200 bg-gray-100 p-2 text-[#4A7FBF]" />
              <h2 className="text-lg font-semibold">Internación y entorno</h2>
            </div>
            <blockquote className="w-full rounded-r-lg border-l-4 border-[#1550E0] bg-gray-100 p-4 text-base italic leading-6 text-[#16222C]">
              “Prefiero permanecer en mi domicilio siempre que sea médicamente viable. En caso de requerir traslado, priorizar Sanatorio San Cayetano.”
            </blockquote>
            <p className="flex items-start gap-2 text-sm leading-5 text-gray-600">
              <LuUserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>Registrado por Roberto Gómez.</span>
            </p>
            <button type="button" className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E9EEF6] p-3 text-base font-medium text-[#16222C] hover:bg-gray-200 active:border active:border-[#1550E0] active:bg-[#B7C8F0]">
              <LuPencil aria-hidden="true" className="size-4 text-[#1550E0]" />Editar indicación
            </button>
          </article>
        </section>

        <div className="flex w-full flex-col gap-3">
          <button type="button" className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#1550E0] p-4 text-base font-bold text-white shadow-sm hover:bg-[#1245BF] active:bg-[#0F389D]">
            <LuCheck aria-hidden="true" className="size-4" />Confirmar mis indicaciones
          </button>
          <button type="button" className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white p-4 text-sm font-semibold text-[#16222C] hover:bg-gray-100 active:border-[#1550E0] active:bg-[#B7C8F0]">
            <LuRotateCcw aria-hidden="true" className="size-4 text-[#1550E0]" />Restablecer a valores por defecto
          </button>
          <p className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-zinc-100 p-5 text-sm leading-5 text-[#16222C]">
            <LuLockKeyhole aria-hidden="true" className="size-10 shrink-0 rounded-lg border border-gray-200 bg-white p-2.5 text-[#4A7FBF]" />
            <span>La familia puede consultar estas indicaciones desde su aplicación autorizada para respetarlas y comunicarlas ante cualquier atención médica.</span>
          </p>
        </div>
      </div>
    </main>
  );
}
