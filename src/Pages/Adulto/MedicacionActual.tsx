import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { RiCapsuleFill } from "react-icons/ri";
import {
  LuCalendarCheck,
  LuCircleCheck,
  LuClock,
  LuDroplet,
  LuMoon,
  LuSun,
  LuSunrise,
  LuUtensils,
} from "react-icons/lu";

export default function MedicacionActual() {
  return (
    <main className="mainBody">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-8">
        <VueltaAtras titulo="Medicación actual" />

        <p className="text-base font-medium leading-relaxed text-[#424656]">Viernes, 24 de Octubre</p>

        <section aria-labelledby="proxima-toma" className="flex w-full flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="proxima-toma" className="flex items-center gap-2 text-xl font-bold leading-7">
              <LuClock aria-hidden="true" className="size-5 shrink-0 text-[#AD2B00]" />
              Tu próxima toma
            </h2>
            <span className="rounded-full bg-[#FFDBD2] px-3 py-0.5 text-xs font-bold leading-6 text-[#891E00]">Esta noche</span>
          </div>

          <article aria-labelledby="medicamento-proximo" className="flex w-full flex-col gap-3.5 rounded-3xl border-2 border-[#B5CFFF] bg-white p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                <p className="flex max-w-full flex-wrap items-center gap-1.5 rounded-xl bg-[#FFDBD2] px-3 py-1 text-sm font-bold leading-6 text-[#A32600]">
                  <LuMoon aria-hidden="true" className="size-4 shrink-0" />
                  <span>21:00 hs • Noche</span>
                </p>
                <h3 id="medicamento-proximo" className="pt-1 text-2xl font-bold leading-7 tracking-tight wrap-anywhere">Atorvastatina</h3>
                <p className="max-w-full rounded-lg bg-[#E0F0FF] px-3 py-0.5 text-sm font-bold leading-6 text-[#0049CC]">10 miligramos</p>
              </div>
              <div aria-hidden="true" className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#E0F0FF]">
                <RiCapsuleFill className="size-8 text-[#0049CC]" />
                <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-[#0049CC] shadow-xs">
                  <LuDroplet className="size-4 text-white" />
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-[#F3F8FE] p-3.5">
              <LuUtensils aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#0049CC]" />
              <p className="min-w-0 text-base leading-6">
                Tomar <span className="text-[#0049CC]">1 comprimido</span> con un vaso de agua al terminar de cenar.
              </p>
            </div>
          </article>
        </section>

        <section aria-labelledby="tomas-de-hoy" className="flex w-full flex-col gap-2 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="tomas-de-hoy" className="flex items-center gap-2 text-xl font-bold leading-7">
              <LuCalendarCheck aria-hidden="true" className="size-5 shrink-0 text-[#0049CC]" />
              Tomas de hoy
            </h2>
            <span className="text-sm font-semibold leading-6 text-[#0049CC]">Horarios habituales</span>
          </div>

          <article aria-labelledby="omeprazol" className="w-full rounded-2xl bg-white p-4 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="flex items-center gap-1.5 text-sm font-bold uppercase leading-6 tracking-wide text-[#0049CC]">
                  <LuSunrise aria-hidden="true" className="size-4 shrink-0" />
                  <span>08:00 HS • EN AYUNAS</span>
                </p>
                <h3 id="omeprazol" className="text-lg font-bold leading-7">Omeprazol 20 mg</h3>
              </div>
              <LuCircleCheck aria-hidden="true" className="size-10 shrink-0 rounded-full bg-[#E0F0FF] p-2.5 text-[#0049CC]" />
            </div>
            <p className="text-base leading-relaxed text-[#424656]">1 cápsula media hora antes del desayuno</p>
          </article>

          <article aria-labelledby="losartan" className="w-full rounded-2xl bg-white p-4 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="flex items-center gap-1.5 text-sm font-bold uppercase leading-6 tracking-wide text-[#0049CC]">
                  <LuSun aria-hidden="true" className="size-4 shrink-0" />
                  <span>08:30 HS • CON EL DESAYUNO</span>
                </p>
                <h3 id="losartan" className="text-lg font-bold leading-7">Losartán 50 mg</h3>
              </div>
              <LuCircleCheck aria-hidden="true" className="size-10 shrink-0 rounded-full bg-[#E0F0FF] p-2.5 text-[#0049CC]" />
            </div>
            <p className="text-base leading-relaxed text-[#424656]">1 comprimido junto con un vaso de agua</p>
          </article>

          <article aria-labelledby="atorvastatina" className="w-full rounded-2xl bg-white p-4 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="flex items-center gap-1.5 text-sm font-bold uppercase leading-6 tracking-wide text-[#A32600]">
                  <LuMoon aria-hidden="true" className="size-4 shrink-0" />
                  <span>21:00 HS • NOCHE</span>
                </p>
                <h3 id="atorvastatina" className="text-lg font-bold leading-7">Atorvastatina 10 mg</h3>
              </div>
              <LuClock aria-hidden="true" className="size-10 shrink-0 rounded-full bg-[#FFDBD2] p-2.5 text-[#A32600]" />
            </div>
            <p className="text-base leading-relaxed text-[#424656]">1 comprimido justo después de cenar</p>
          </article>
        </section>
      </div>
    </main>
  );
}
