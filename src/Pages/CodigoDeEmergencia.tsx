import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import { MdQrCodeScanner } from "react-icons/md";
import { IoAlertCircle } from "react-icons/io5";

export default function Codigo() {
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
        <div className="bg-black rounded-2xl flex flex-col items-center gap-10 w-full p-7">
          <div className="flex flex-col gap-5 items-center">
            <div className="bg-[#1A1A1A] p-4 rounded-full h-16 w-16 text-4xl flex items-center justify-center text-white">
              <MdQrCodeScanner />
            </div>
            <h1 className="font-semibold text-white text-2xl text-center">
              Escaneá el QR de tu pulsera e ingresá este código:
            </h1>
          </div>
          <div className="w-full flex flex-col gap-7">
            <div className="bg-white rounded-xl text-6xl text-black p-10 w-full text-center">
              000-00
            </div>
            <div className="border-gray-700 border bg-[#101A21] w-full h-40 rounded-2xl"></div>
          </div>
        </div>
      </main>
    </>
  );
}
