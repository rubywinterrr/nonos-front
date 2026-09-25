import Header from "../components/Header";
import VueltaAtras from "../components/vueltaAtras";
import corazon from "../assets/Corazon.png";
import Icon from "../assets/Icon.png";
import telefono from "../assets/icon-telefono-negro.png";
import dialogo from "../assets/dialogo.png";
import info from "../assets/icon-info.png";

// Vista para gestionar contactos o personas de emergencia vinculadas a la app.
export default function Contactos() {
  const contactos = [
    {
      nombreCompleto: "Julian Garbate",
      nombre: "Julian",
      fotoContacto: "../../public/fotoPerfil_1.jpeg",
    },
    { nombreCompleto: "Ruby Winter", nombre: "Ruby" },
    {
      nombreCompleto: "Joaco Schopflo",
      nombre: "Joaco",
      fotoContacto: "../../public/joaco.jpeg",
    },
    { nombreCompleto: "Nico Nuñez", nombre: "Nico" },
    {
      nombreCompleto: "Javier Milei",
      nombre: "Javier",
      fotoContacto: "../../public/pedro.jpeg",
    },
    {
      nombreCompleto: "Martin Berenstein",
      nombre: "Martin",
      fotoContacto: "../../public/tincho.jpeg",
    },
    {
      nombreCompleto: "Martin Iud Matz",
      nombre: "Martin",
      fotoContacto: "../../public/iud.jpeg",
    },
  ];

  return (
    <>
      <main className="min-h-main w-screen flex flex-col items-baseline p-7 pb-[13vh] gap-7">
        <Header />
        <section className="w-full flex flex-col items-baseline gap-8">
          <div className="flex flex-col gap-3">
            <VueltaAtras />
            <h1 className="bg-gray-200 font-semibold text-md text-gray-500 p-3 rounded-full h-10 flex gap-2 items-center w-fit">
              <img
                src={corazon}
                alt="Corazon"
                className="h-90/100 aspect-square"
              />
              Acompañamiento diario
            </h1>
          </div>
          <div className="rounded-2xl bg-black w-full h-23 flex items-center justify-between p-3 lg:w-32/100">
            <div className="flex items-center gap-3 border h-full">
              <div className="h-95/100 aspect-square rounded-full bg-red-600 p-4">
                <img src={Icon} alt="Asterisco" />
              </div>
              <div className="flex flex-col justify-baseline">
                <h1 className="font-semibold text-white text-xl">
                  107 Ambulancia
                </h1>
                <h2 className="text-md text-gray-400">Emergencias médicas</h2>
              </div>
            </div>
            <div className="bg-white rounded-lg aspect-square h-full flex items-center justify-center flex-col gap-1 p-1 cursor-pointer">
              <img src={telefono} alt="telefono" className="h-40/100" />
              <p className="text-xs font-semibold">Llamar</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-5 w-full flex-wrap">
            {contactos.map((contacto) => (
              <div className="bg-white rounded-2xl flex flex-col gap-3 w-full h-40 items-center justify-center lg:w-32/100">
                <div className="w-full h-45/100 flex items-center p-1 gap-3 pl-6">
                  <img
                    className="border rounded-full aspect-square h-95/100 text-xs object-cover"
                    src={contacto.fotoContacto}
                    alt="Foto de contacto"
                  />
                  <div className="flex flex-col justify-baseline">
                    <h1 className="font-bold text-2xl">
                      {contacto.nombreCompleto}
                    </h1>
                    <p className="text-gray-500 text-md">Ubicacion</p>
                  </div>
                </div>
                <h2 className="font-semibold text-xl w-90/100 h-30/100 rounded-xl bg-gray-300 flex items-center justify-center hover:bg-black hover:text-white cursor-pointer">
                  Llamar a {contacto.nombre}
                </h2>
              </div>
            ))}
          </div>
          <div className="w-full bg-[#EFF4FC] rounded-xl h-40 flex justify-evenly items-center p-2 lg:w-50/100">
            <div className="h-full w-13/100 pt-5">
              <div className="bg-[#D6E0F1] h-45/100 aspect-square p-3.5 rounded-full">
                <img
                  src={info}
                  alt="informacion"
                  className="h-full aspect-square"
                />
              </div>
            </div>
            <div className="flex flex-col w-75/100 gap-2">
              <h1 className="font-semibold text-xl">
                ¿Necesitas agregar a alguien?
              </h1>
              <p className="text-gray-500 text-md w-90/100">
                Tu familia gestiona los contactos para mayor seguridad. Puedes
                avisarles con un solo toque.
              </p>{" "}
            </div>
          </div>
          <h1 className="bg-gray-200 rounded-xl w-full text-center font-semibold p-2 text-xl flex items-center justify-evenly cursor-pointer h-15 lg:w-32/100">
            <img src={dialogo} alt="Cuadro de dialogo" className="h-55/100" />
            Avisar a {contactos[0].nombre} para agregar contactos.
          </h1>
        </section>
      </main>
    </>
  );
}
