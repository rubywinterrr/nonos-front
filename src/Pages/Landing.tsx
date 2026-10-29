import { Link } from "react-router-dom";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import fotoPulsera from "../assets/pulsera.png";
import { FondoBlanco } from "../utils/funcionFondoBlanco";

// datos que mide la pulsera: cada uno se muestra unos segundos y pasa al siguiente (animación en index.css)
const datosPulsera = [
  { titulo: "Pulso", valor: "72", unidad: "lpm" },
  { titulo: "Oxígeno", valor: "97", unidad: "%" },
  { titulo: "Pasos", valor: "2.450", unidad: "hoy" },
  { titulo: "Sueño", valor: "7h 45m", unidad: "anoche" },
];

const pasos = [
  {
    titulo: "La pulsera acompaña",
    texto:
      "Mide pulso, oxígeno en sangre, pasos y sueño, y se sincroniza sola con NONOS a través de Google Health.",
  },
  {
    titulo: "NONOS ordena",
    texto:
      "Reúne en un solo lugar la medicación actual, las condiciones de salud, las medidas anticipadas y los contactos, con la fecha de su última actualización.",
  },
  {
    titulo: "La red se entera",
    texto:
      "Si un valor se sale de lo habitual o la persona pide ayuda, el aviso llega a su familia y a sus cuidadores.",
  },
];

const mediciones = [
  {
    dato: "Pulso",
    uso: "Avisa si la frecuencia cardíaca está demasiado alta o demasiado baja.",
  },
  {
    dato: "Oxígeno en sangre",
    uso: "Avisa si el oxígeno baja de lo esperable.",
  },
  {
    dato: "Pasos y sueño",
    uso: "Muestran la rutina del día y avisan si cambia de golpe.",
  },
];

const perfilEmergencia = [
  "Identificación de la persona",
  "Medicación actual",
  "Condiciones de salud y alergias",
  "Medidas anticipadas",
  "Contactos de emergencia",
  "Fecha de la última actualización",
];

const usuarios = [
  {
    quien: "Adulto mayor",
    texto:
      "Usa una interfaz simple y accesible. Pide ayuda con un toque y deja escrito qué quiere que se haga en una emergencia.",
  },
  {
    quien: "Familiar",
    texto:
      "Se mantiene informado aunque no esté cerca y elige qué alertas recibir.",
  },
  {
    quien: "Cuidador",
    texto:
      "Consulta y actualiza la información. Si cuida en persona recibe los avisos más importantes; si acompaña a distancia, todos.",
  },
  {
    quien: "Médico de emergencia",
    texto:
      "No necesita cuenta. Entra al perfil de emergencia con el QR de la pulsera y un código temporal.",
  },
];

// foto de la pulsera flotando, con ondas de señal y los datos que mide apareciendo de a uno
function Pulsera() {
  FondoBlanco();
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-[3rem] bg-main-blue">
      <span
        aria-hidden="true"
        className="landing-onda absolute size-64 rounded-full border-2 border-[#0B5FFF]/50"
      />
      <span
        aria-hidden="true"
        className="landing-onda landing-onda-2 absolute size-64 rounded-full border-2 border-[#0B5FFF]/50"
      />
      <span
        aria-hidden="true"
        className="landing-onda landing-onda-3 absolute size-64 rounded-full border-2 border-[#0B5FFF]/50"
      />

      <img
        src={fotoPulsera}
        alt="Pulsera Fitbit Air"
        className="landing-flotar relative w-[58%] drop-shadow-[0_30px_30px_rgba(0,73,204,0.35)]"
      />

      {/* tarjeta con el dato que la pulsera está midiendo: cambia cada 3 segundos */}
      <div aria-hidden="true" className="absolute bottom-6 left-6 h-24 w-44">
        {datosPulsera.map((dato, indice) => (
          <div
            key={dato.titulo}
            className={`landing-dato landing-dato-${
              indice + 1
            } absolute inset-0 flex flex-col justify-center gap-0.5 rounded-2xl bg-white px-4 shadow-lg shadow-[#0049CC]/20`}
          >
            <span className="text-sm font-semibold text-[#006A61]">
              {dato.titulo}
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold leading-none tracking-tight text-[#0E1D28]">
                {dato.valor}
              </span>
              <span className="text-sm text-[#4A5866]">{dato.unidad}</span>
            </span>
            {indice === 0 && (
              <svg viewBox="0 0 100 24" className="w-24">
                <path
                  className="landing-ecg"
                  d="M0 12 H30 L36 4 L42 20 L48 12 H60 L64 8 L68 12 H100"
                  fill="none"
                  stroke="#AD2B00"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// landing pública de NONOS: qué es, cómo funciona y acceso a la plataforma
export default function Landing() {
  return (
    <div className="landing min-h-screen bg-main text-[#0E1D28]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
        >
          <MdOutlineHealthAndSafety
            aria-hidden="true"
            className="size-9 text-[#0B5FFF]"
          />
          NONOS
        </Link>
        <Link
          to="/ingresar"
          className="rounded-full bg-[#0E1D28] px-5 py-2.5 text-base font-bold text-white hover:bg-[#0049CC] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
        >
          Ingresar
        </Link>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 overflow-hidden px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:pb-24 lg:pt-12">
          <div className="flex flex-col items-start gap-6">
            <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Tecnología que acompaña.
            </h1>
            <p className="max-w-xl text-xl leading-relaxed text-[#2E3B47]">
              NONOS conecta a un adulto mayor con las personas que lo cuidan:
              una pulsera, un botón de emergencia y una plataforma web que
              ordena la información importante y avisa cuando hace falta.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/ingresar"
                className="rounded-full bg-[#0B5FFF] px-7 py-4 text-lg font-bold text-white shadow-lg shadow-[#0B5FFF]/30 hover:bg-[#0049CC] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0E1D28]"
              >
                Ingresar a NONOS
              </Link>
              <a
                href="#como-funciona"
                className="rounded-full border-2 border-[#0E1D28]/15 px-7 py-4 text-lg font-bold hover:border-[#0B5FFF] hover:text-[#0049CC] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FFF]"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>
          <Pulsera />
        </section>

        <section className="bg-[#0E1D28] text-white">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1fr] lg:py-28">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              El cuidado está repartido. La información, también.
            </h2>
            <div className="flex max-w-xl flex-col gap-5 text-lg leading-relaxed text-[#C9D6E8]">
              <p>
                Un adulto mayor puede ser atendido por distintos médicos,
                hospitales, familiares y cuidadores. Cada uno conoce una parte
                de su situación, y cuando hace falta decidir o actuar rápido, la
                información no está o está desactualizada.
              </p>
              <p>
                NONOS no es una historia clínica ni reemplaza a los
                profesionales de la salud. Es un punto de información ordenado y
                actualizado con lo que sirve para cuidar.
              </p>
            </div>
          </div>
        </section>

        <section
          id="como-funciona"
          className="mx-auto w-full max-w-6xl scroll-mt-6 px-5 py-20 sm:px-8 lg:py-28"
        >
          <h2 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Cómo funciona
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {pasos.map((paso, indice) => (
              <li
                key={paso.titulo}
                className="flex flex-col gap-3 border-t-4 border-[#0B5FFF] pt-5"
              >
                <span className="text-5xl font-extrabold leading-none text-[#0B5FFF]">
                  {indice + 1}
                </span>
                <h3 className="text-2xl font-bold">{paso.titulo}</h3>
                <p className="max-w-sm text-lg leading-relaxed text-[#2E3B47]">
                  {paso.texto}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-main-blue">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                La pulsera
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-[#1B2A38]">
                Una pulsera Fitbit conectada a NONOS por Google Health. No hace
                falta tocar nada: los datos se sincronizan solos y NONOS los usa
                para algo concreto.
              </p>
              <dl className="flex flex-col divide-y divide-[#0E1D28]/15 border-y border-[#0E1D28]/15">
                {mediciones.map((medicion) => (
                  <div
                    key={medicion.dato}
                    className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6"
                  >
                    <dt className="text-lg font-bold">{medicion.dato}</dt>
                    <dd className="text-lg leading-relaxed text-[#1B2A38]">
                      {medicion.uso}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex flex-col justify-end gap-4 rounded-4xl bg-main p-8 sm:p-10">
              <span
                aria-hidden="true"
                className="flex size-20 items-center justify-center rounded-full bg-[#F20D0D] shadow-lg shadow-red-600/30"
              >
                <span className="size-10 rounded-full border-4 border-white/80" />
              </span>
              <h3 className="text-3xl font-extrabold tracking-tight">
                Botón de emergencia
              </h3>
              <p className="text-lg leading-relaxed text-[#2E3B47]">
                Un único botón, pensado para que pedir ayuda sea simple y
                difícil de apretar sin querer. El mismo pedido de ayuda también
                está en la plataforma, con un toque.
              </p>
              <p className="text-base leading-relaxed text-[#4A5866]">
                En desarrollo: una pieza impresa en 3D con un pulsador y
                conexión Bluetooth.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1fr] lg:py-28">
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              En una emergencia, solo lo necesario
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-[#2E3B47]">
              La pulsera tiene un QR. Al escanearlo, quien asiste a la persona
              ingresa un código temporal y ve su perfil de emergencia, sin
              acceder al resto de la información ni poder modificar nada.
            </p>
            <ol className="flex flex-col gap-3 text-lg">
              <li className="flex items-center gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0B5FFF] font-bold text-white">
                  1
                </span>
                Escanea el QR de la pulsera
              </li>
              <li className="flex items-center gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0B5FFF] font-bold text-white">
                  2
                </span>
                Ingresa el código temporal
              </li>
              <li className="flex items-center gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0B5FFF] font-bold text-white">
                  3
                </span>
                Ve el perfil de emergencia
              </li>
            </ol>
            <p className="max-w-xl text-base leading-relaxed text-[#4A5866]">
              El código cambia cada 30 minutos y deja de servir apenas se usa.
              Lo pueden consultar la persona y su familia o cuidadores.
            </p>
          </div>

          <div className="min-w-0 rounded-4xl border-2 border-[#0E1D28]/10 bg-white p-6 sm:p-10">
            <p className="text-base font-semibold text-[#4A5866]">
              Código temporal
            </p>
            <p
              className="mt-3 flex gap-1.5 sm:gap-2"
              aria-label="Ejemplo de código temporal de seis dígitos"
            >
              {["4", "8", "2", "0", "1", "7"].map((digito, indice) => (
                <span
                  key={indice}
                  className="flex h-14 w-10 items-center justify-center rounded-xl bg-[#EBF5FF] text-2xl font-extrabold text-[#0049CC] sm:h-16 sm:w-12 sm:text-3xl"
                >
                  {digito}
                </span>
              ))}
            </p>
            <h3 className="mt-8 text-xl font-bold">
              El perfil de emergencia muestra
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-lg">
              {perfilEmergencia.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-2.5 shrink-0 rounded-full bg-[#006A61]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#EBF5FF]">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
            <h2 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Para cada persona de la red de cuidado
            </h2>
            <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
              {usuarios.map((usuario) => (
                <div key={usuario.quien} className="flex flex-col gap-2">
                  <dt className="text-2xl font-bold text-[#0049CC]">
                    {usuario.quien}
                  </dt>
                  <dd className="max-w-md text-lg leading-relaxed text-[#2E3B47]">
                    {usuario.texto}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Investigación
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#2E3B47]">
              Para relevar el problema y validar los cambios del proyecto
              trabajamos con la Dra. María Florencia Tartaglini, investigadora
              del CONICET y coordinadora del programa “Acompañando al Cuidador”
              de la Fundación INEBA.
            </p>
          </div>
        </section>

        <section className="bg-[#0B5FFF] text-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-5 py-20 sm:px-8 lg:py-28">
            <p className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              NONOS no cuida en lugar de las personas. Hace que sea más fácil
              cuidar.
            </p>
            <Link
              to="/ingresar"
              className="rounded-full bg-white px-7 py-4 text-lg font-bold text-[#0049CC] hover:bg-[#EBF5FF] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Ingresar a NONOS
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-base text-[#4A5866] sm:px-8">
        <span className="flex items-center gap-2 font-bold text-[#0E1D28]">
          <MdOutlineHealthAndSafety
            aria-hidden="true"
            className="size-6 text-[#0B5FFF]"
          />
          NONOS
        </span>
        <span>Proyecto en desarrollo, 2026.</span>
      </footer>
    </div>
  );
}
