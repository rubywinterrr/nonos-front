import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import {
  MdQrCodeScanner,
  MdFullscreen,
  MdVibration,
  MdOutlineTimer,
  MdFullscreenExit,
} from "react-icons/md";
import { IoAlertCircle } from "react-icons/io5";
import { GoQuestion } from "react-icons/go";

const TIMER_DURATION_SECONDS = 30 * 60;

export default function Codigo() {
  const emergencyCardRef = useRef<HTMLDivElement>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(
    TIMER_DURATION_SECONDS,
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((remaining) =>
        remaining <= 1 ? TIMER_DURATION_SECONDS : remaining - 1,
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement === emergencyCardRef.current,
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  const toggleFullscreen = async () => {
    const card = emergencyCardRef.current;
    if (!card) return;

    if (isFullscreen) {
      setIsFullscreen(false);
      if (document.fullscreenElement === card) {
        await document.exitFullscreen();
      }
      return;
    }

    try {
      if (typeof card.requestFullscreen !== "function") {
        setIsFullscreen(true);
        return;
      }

      await card.requestFullscreen();
      setIsFullscreen(true);
    } catch {
      setIsFullscreen(true);
    }
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progress = (secondsRemaining / TIMER_DURATION_SECONDS) * 100;

  return (
    <>
      <main className="min-h-main w-screen bg-main-blue p-7 pb-[13vh] gap-7 flex flex-col items-baseline">
        <Header />
        <div className="flex flex-col gap-3">
          <VueltaAtras />
          <h1 className="bg-gray-200 font-semibold text-md text-gray-500 p-3 rounded-full h-10 flex gap-2 items-center w-fit">
            <IoAlertCircle className="text-xl" />
            EMERGENCIA ACTIVA
          </h1>
        </div>
        <section className="w-full flex flex-col lg:flex-row justify-center gap-5 items-center lg:gap-0">
          <div
            ref={emergencyCardRef}
            className={`emergency-code-card bg-black rounded-2xl lg:w-60/100 flex flex-col items-center gap-10 w-full p-7 ${isFullscreen ? "is-fullscreen" : ""}`}
          >
            {isFullscreen && (
              <button
                type="button"
                onClick={() => void toggleFullscreen()}
                aria-label="Salir de pantalla completa"
                className="self-end text-white bg-[#1A1A1A] rounded-full p-2"
              >
                <MdFullscreenExit className="text-2xl" />
              </button>
            )}
            <div className="flex flex-col gap-5 items-center">
              <div className="bg-[#1A1A1A] p-4 rounded-full h-16 w-16 text-4xl flex items-center justify-center text-white">
                <MdQrCodeScanner />
              </div>
              <h1 className="font-semibold text-white text-2xl text-center">
                Escaneá el QR de tu pulsera e ingresá este código:
              </h1>
            </div>
            <div className="w-full flex flex-col gap-7">
              <div className="bg-white rounded-xl text-5xl text-black p-10 w-full text-center">
                000-00
              </div>
              <div className="border-gray-700 border bg-[#101A21] w-full gap-5 min-h-40 rounded-2xl flex flex-col p-6">
                <div className="flex w-full justify-between">
                  <h1 className="flex items-center text-white gap-2">
                    <MdOutlineTimer className="text-[#E8491D] text-3xl" />
                    Vence en:
                  </h1>
                  <p className="text-[#E8491D] tabular-nums">
                    {minutes} min {String(seconds).padStart(2, "0")} s
                  </p>
                </div>
                <div
                  className="relative w-full bg-linear-to-r from-red-500 to-green-500 rounded-full h-2 overflow-hidden"
                  role="progressbar"
                  aria-label="Tiempo restante del código"
                  aria-valuemin={0}
                  aria-valuemax={TIMER_DURATION_SECONDS}
                  aria-valuenow={secondsRemaining}
                >
                  <div
                    className="absolute inset-y-0 right-0 bg-gray-700 transition-[width] duration-1000"
                    style={{ width: `${100 - progress}%` }}
                  />
                </div>
                <h2 className="text-white">
                  Este código temporal se renueva cada 30 minutos por seguridad.
                </h2>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="w-full min-h-12 lg:w-80/100 bg-[#DEE3EB] rounded-xl text-lg flex items-center justify-center gap-2 p-1 cursor-pointer"
            >
              {isFullscreen ? (
                <MdFullscreenExit className="text-3xl font-bold" />
              ) : (
                <MdFullscreen className="text-3xl font-bold" />
              )}
              {isFullscreen
                ? "Salir de pantalla completa"
                : "Mostrar código en pantalla completa"}
            </button>
            <div className="w-full min-h-12 lg:w-80/100 bg-white rounded-xl text-xl flex items-center justify-between gap-2 p-3 pl-5 pr-5">
              <div className="flex gap-2 items-center">
                <MdVibration className="text-2xl" />
                Sonido de ayuda
              </div>
              <span className="rounded-full bg-gray-300 text-sm p-2 font-semibold">
                ACTIVO
              </span>
            </div>
            <div className="rounded-xl lg:w-80/100 bg-white text-xl flex items-center w-full min-h-40 pt-4 pb-4 pr-0 pl-5 gap-4">
              <div className="min-h-40  w-8/100 flex justify-center">
                <GoQuestion className="text-3xl mt-4 text-gray-600"></GoQuestion>
              </div>
              <div className="flex flex-col justify-center items-center max-w-80/100 h-full gap-2 ">
                <h1 className="font-semibold w-full">
                  ¿Cómo funciona la pulsera?
                </h1>
                <p className="text-gray-600 text-sm w-full">
                  Cualquier ambulancia o profesional de la salud puede apuntar
                  con su teléfono al código QR grabado en tu muñeca e ingresar
                  estos números para conocer tus medicamentos y contactos
                  familiares de inmediato.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
