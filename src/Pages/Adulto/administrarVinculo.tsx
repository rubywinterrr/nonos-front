import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import Switch from "../../components/switch";
import {
  MdCheck,
  MdError,
  MdOutlineManageAccounts,
  MdOutlinePermPhoneMsg,
  MdOutlinePersonRemove,
  MdOutlinePhone,
} from "react-icons/md";
import { LuAsterisk, LuCalendar, LuInfo, LuMail, LuPhoneMissed } from "react-icons/lu";

export default function AdmVinculo() {
  return (
    <main className="mainBody">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Administrar vínculo" />

        <p className="flex max-w-full items-center justify-center gap-2 self-center rounded-full bg-[#DEE3EB] px-4 py-2 text-base font-semibold tracking-wide text-black">
          <MdError aria-hidden="true" className="size-4 shrink-0" />
          EMERGENCIA ACTIVA
        </p>

        <section aria-labelledby="persona-vinculada" className="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#DBE1FF] text-base text-[#0049CC] inset-shadow-sm">
              M
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <h2 id="persona-vinculada" className="text-xl leading-7">María Gómez</h2>
                <span className="rounded-full bg-[#84F6E6] px-2 py-0.5 text-sm leading-relaxed tracking-wide text-[#007167]">Hija</span>
              </div>
              <p className="text-base leading-relaxed text-[#424656]">Familiar principal</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-lg bg-[#EBF5FF] p-3">
            <p className="flex min-w-0 items-center gap-2 text-base leading-relaxed">
              <MdOutlinePhone aria-hidden="true" className="size-4 shrink-0 text-[#0049CC]" />
              <span>+54 11 4455-6677</span>
            </p>
            <p className="flex min-w-0 items-center gap-2 text-base leading-relaxed text-[#424656]">
              <LuMail aria-hidden="true" className="size-4 shrink-0" />
              <span className="min-w-0 wrap-anywhere">maria.gomez@email.com</span>
            </p>
          </div>

          <p className="flex items-center gap-2 text-sm leading-relaxed tracking-wide text-[#424656]">
            <LuCalendar aria-hidden="true" className="size-4 shrink-0 text-[#007167]" />
            <span>Vinculada y activa desde marzo 2024</span>
          </p>
        </section>

        <section aria-labelledby="notificaciones-directas" className="flex w-full flex-col gap-2">
          <h2 id="notificaciones-directas" className="flex items-center gap-2 text-xl leading-7">
            <MdOutlinePermPhoneMsg aria-hidden="true" className="size-6 shrink-0 text-[#0049CC]" />
            Notificaciones directas
          </h2>

          <div className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-xs">
            <div className="flex items-start justify-between gap-2 p-2">
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <LuPhoneMissed aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#007167]" />
                <div className="min-w-0 text-base leading-relaxed">
                  <h3 id="aviso-llamadas" className="font-normal">Aviso si no contestás<br />llamadas</h3>
                  <p id="detalle-llamadas" className="text-[#424656]">Mensaje tras 2 llamadas sin atender</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked="true"
                aria-labelledby="aviso-llamadas"
                aria-describedby="detalle-llamadas"
                className="flex h-7 w-12 shrink-0 cursor-pointer items-center justify-end self-center rounded-full bg-[#0049CC] p-1 hover:bg-blue-800 active:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0049CC]"
              >
                <span aria-hidden="true" className="size-5 rounded-full bg-white shadow-sm" />
              </button>
              <Switch />
            </div>

            <div className="flex items-start justify-between gap-2 p-2">
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <LuAsterisk aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#AD2B00] stroke-3" />
                <div className="min-w-0 text-base leading-relaxed">
                  <h3 id="llamada-auxilio" className="font-normal">Llamada prioritaria de<br />auxilio</h3>
                  <p id="detalle-auxilio" className="text-[#424656]">Primera en sonar si pulsás<br />botón rojo</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked="true"
                aria-labelledby="llamada-auxilio"
                aria-describedby="detalle-auxilio"
                className="flex h-7 w-12 shrink-0 cursor-pointer items-center justify-end self-center rounded-full bg-[#0049CC] p-1 hover:bg-blue-800 active:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0049CC]"
              >
                <span aria-hidden="true" className="size-5 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>
        </section>

        <div className="flex w-full flex-col gap-3">
          <button type="button" className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#E0F0FF] px-2 py-3 text-sm leading-relaxed tracking-wide hover:bg-[#D0E6FA] active:bg-[#BFD9F2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0049CC]">
            <MdOutlineManageAccounts aria-hidden="true" className="size-5 shrink-0" />
            <span>Cambiar rol de María (actual: Familiar)</span>
          </button>

          <div className="flex items-start gap-2 rounded-xl bg-[#EBF5FF] p-3">
            <LuInfo aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#AD2B00]" />
            <p className="min-w-0 text-base leading-7 text-[#424656]">Si sacás a María de tu red, ya no podrá ver tu estado ni recibir alertas de auxilio.</p>
          </div>

          <button type="button" className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FFDAD6]/40 px-3 py-3 text-sm leading-relaxed tracking-wide text-[#BA1A1A] hover:bg-[#FFDAD6]/65 active:bg-[#FFDAD6]/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BA1A1A]">
            <MdOutlinePersonRemove aria-hidden="true" className="size-5 shrink-0" />
            Desvincular a María
          </button>
        </div>

        <div className="w-full pb-2">
          <button type="button" className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border-2 border-[#B7C8F0] bg-[#1550E0] px-3 py-3 text-lg font-bold leading-6 tracking-wide text-white shadow-md hover:bg-blue-800 active:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0049CC]">
            <MdCheck aria-hidden="true" className="size-5 shrink-0" />
            <span>Guardar permisos de María</span>
          </button>
        </div>
      </div>
    </main>
  );
}
