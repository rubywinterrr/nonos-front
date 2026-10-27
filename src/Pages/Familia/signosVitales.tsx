import { LuHeartPulse, LuMoon, LuShieldCheck, LuSmile } from "react-icons/lu";
import { MdCheck, MdDirectionsWalk, MdFavorite } from "react-icons/md";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";

export default function SignosVitales() {
  return (
    <main className="mainBody text-[#0E1D28]">
      <Header />
      <VueltaAtras titulo="Signos vitales y salud" />

      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <div role="group" aria-label="Período de consulta" className="grid grid-cols-3 gap-1 rounded-2xl bg-[#DAEAF9]/60 p-1">
          <button type="button" aria-pressed="true" className="min-h-11 min-w-0 rounded-xl px-2 py-2 text-sm font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF] bg-white font-bold text-[#0049CC] shadow-xs hover:bg-blue-50 active:bg-blue-100">Hoy</button>
          <button type="button" aria-pressed="false" className="min-h-11 min-w-0 rounded-xl px-2 py-2 text-sm font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF] text-[#424656] hover:bg-white/50 active:bg-white/70">Semana</button>
          <button type="button" aria-pressed="false" className="min-h-11 min-w-0 rounded-xl px-2 py-2 text-sm font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF] text-[#424656] hover:bg-white/50 active:bg-white/70">Mes</button>
        </div>

        <section className="flex w-full min-w-0 flex-col rounded-3xl bg-white p-5 shadow-xs gap-3" aria-label="Estado general de salud">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide bg-[#84F6E6]/30 text-[#006A61]">
              <LuShieldCheck aria-hidden="true" className="size-4 shrink-0" />
              <span>PARÁMETROS NORMALES</span>
            </div>
            <p className="text-xs text-[#424656]">Hace 4 min</p>
          </div>
          <p className="text-base leading-snug">
            Valores dentro de los rangos habituales de José en las últimas 24 hs. Sincronización con la pulsera física.
          </p>
        </section>

        <section className="flex w-full min-w-0 flex-col rounded-3xl bg-white p-5 shadow-xs gap-4" aria-labelledby="frecuencia-cardiaca">
          <h2 id="frecuencia-cardiaca" className="flex items-center gap-2 text-base font-bold leading-normal sm:text-lg">
            <MdFavorite aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#FFDBD2] p-2 text-[#AD2B00]" />
            Frecuencia cardíaca
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex min-w-0 flex-wrap items-baseline gap-2">
              <span className="text-4xl font-bold leading-tight tracking-tight">72</span>
              <span className="text-lg font-semibold text-[#424656]">lpm</span>
            </p>
            <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#84F6E6]/30 px-2.5 py-1 text-xs font-bold leading-normal text-[#006A61]">En reposo</span>
          </div>

          <div
            role="img"
            aria-label="Espacio reservado para el gráfico de frecuencia cardíaca"
            className="h-48 w-full rounded-2xl bg-[#EBF5FF]/70"
          />

          <dl className="grid grid-cols-2 gap-2.5">
            <div className="flex min-w-0 flex-col gap-0.5 rounded-2xl bg-[#EBF5FF] p-3">
              <dt className="text-xs leading-normal text-[#424656]">Mínimo registrado</dt>
              <dd className="text-base font-bold">64 lpm</dd>
              <dd className="text-xs leading-normal text-[#424656]">04:30 hs · Sueño profundo</dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 rounded-2xl bg-[#EBF5FF] p-3">
              <dt className="text-xs leading-normal text-[#424656]">Máximo registrado</dt>
              <dd className="text-base font-bold">88 lpm</dd>
              <dd className="text-xs leading-normal text-[#424656]">11:15 hs · Caminata</dd>
            </div>
          </dl>
        </section>

        <section className="flex w-full min-w-0 flex-col rounded-3xl bg-white p-5 shadow-xs gap-4" aria-labelledby="presion-arterial">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="presion-arterial" className="flex items-center gap-2 text-base font-bold leading-normal sm:text-lg">
              <LuHeartPulse aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#E0F0FF] p-2 text-[#0B5FFF]" />
              Presión arterial
            </h2>
            <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#84F6E6]/30 px-2.5 py-1 text-xs font-bold leading-normal text-[#006A61]">Normal</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="flex min-w-0 flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold leading-none tracking-tight">120/80</span>
              <span className="text-base font-semibold text-[#424656]">mmHg</span>
            </p>
            <p className="text-xs font-semibold text-[#424656]">Control 14:00 hs</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase leading-normal tracking-wider text-[#424656]">Mediciones previas</h3>
            <ul aria-label="Mediciones previas de presión arterial" className="flex flex-col gap-2">
              <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#EBF5FF]/60 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm">125/82 mmHg</p>
                  <p className="text-xs leading-normal text-[#424656]">Ayer, 23 Oct · 19:30 hs</p>
                </div>
                <span className="inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-bold leading-normal bg-[#E0F0FF] text-[#0049CC]">Normal</span>
              </li>
              <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#EBF5FF]/60 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm">118/78 mmHg</p>
                  <p className="text-xs leading-normal text-[#424656]">Miér, 22 Oct · 14:00 hs</p>
                </div>
                <span className="inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-bold leading-normal bg-[#84F6E6]/30 text-[#006A61]">Óptima</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="flex w-full min-w-0 flex-col rounded-3xl bg-white p-5 shadow-xs gap-3" aria-labelledby="movilidad-actividad">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="movilidad-actividad" className="flex items-center gap-2 text-base font-bold leading-normal sm:text-lg">
              <MdDirectionsWalk aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#84F6E6]/30 p-2 text-[#006A61]" />
              Movilidad y actividad
            </h2>
            <span className="rounded-full bg-[#E0F0FF] px-2.5 py-1 text-xs font-bold text-[#0049CC]">
              80% meta
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-2 pt-1">
            <label htmlFor="progreso-pasos" className="flex min-w-0 flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold leading-none">2.450</span>
              <span className="text-sm font-semibold text-[#424656]">pasos de hoy</span>
            </label>
            <p className="text-xs font-semibold text-[#424656]">Meta: 3.000</p>
          </div>
          <progress
            id="progreso-pasos"
            max={3000}
            value={2450}
            aria-label="Progreso de pasos hacia la meta"
            aria-valuetext="2.450 de 3.000 pasos"
            className="block h-3 w-full appearance-none overflow-hidden rounded-full border-0 bg-[#E0F0FF] [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-[#0B5FFF] [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-[#E0F0FF] [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-[#0B5FFF]"
          />
          <div className="flex items-start gap-2.5 rounded-2xl bg-[#EBF5FF] p-3">
            <LuSmile aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#006A61]" />
            <div className="min-w-0 text-sm leading-relaxed">
              <p>Paseo matutino de 25 min.</p>
              <p className="text-[#424656]">Sin caídas ni aceleraciones bruscas registradas.</p>
            </div>
          </div>
        </section>

        <section className="flex w-full min-w-0 flex-col rounded-3xl bg-white p-5 shadow-xs gap-3" aria-labelledby="descanso-sueno">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="descanso-sueno" className="flex items-center gap-2 text-base font-bold leading-normal sm:text-lg">
              <LuMoon aria-hidden="true" className="size-8 shrink-0 rounded-xl bg-[#E0F0FF] p-2 text-[#0B5FFF]" />
              Descanso y sueño
            </h2>
            <p className="text-xs text-[#424656]">Noche anterior</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-3xl font-bold leading-tight">7h 45m</p>
            <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#84F6E6]/30 px-2.5 py-1 text-xs font-bold leading-normal text-[#006A61]"><MdCheck aria-hidden="true" className="size-3 shrink-0" />Sueño reparador</span>
          </div>
          <dl className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="min-w-0 rounded-xl bg-[#EBF5FF] px-3 py-2">
              <dt className="text-xs leading-normal text-[#424656]">Se durmió</dt>
              <dd className="text-base font-bold">23:15 hs</dd>
            </div>
            <div className="min-w-0 rounded-xl bg-[#EBF5FF] px-3 py-2">
              <dt className="text-xs leading-normal text-[#424656]">Se despertó</dt>
              <dd className="text-base font-bold">07:00 hs</dd>
            </div>
          </dl>
          <p className="flex items-center gap-2 px-1 text-sm">
            <LuMoon aria-hidden="true" className="size-4 shrink-0 text-[#006A61]" />
            <span>Sueño profundo: 7hs</span>
          </p>
        </section>
      </div>
    </main>
  );
}
