import VueltaAtras from "../../components/vueltaAtras";
import { LuAsterisk, LuBriefcaseMedical, LuPhone, LuUsers } from "react-icons/lu";
import TarjetaContactos from "../../components/TarjetaContacto";
import Desplegable from "../../components/menuDesplegable";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { contactosService, type Contacto } from "../../services/contactosService";
import { usuarioService, type Vinculo } from "../../services/usuariosService";

// texto del rol de alguien de la red
function textoRol(vinculo: Vinculo) {
  if (vinculo.tipoVinculo === "FAMILIAR") return "Familiar";
  if (vinculo.tipoCuidador === "DIGITAL") return "Cuidador digital";
  return "Cuidador presencial";
}

function esContactoMedico(nombre: string) {
  return /^(dr\.?|dra\.?|doctor(?:a)?)\s/i.test(nombre);
}

// contactos del adulto: el 107, su red (familiares y cuidadores) y los contactos que agendó
export default function Contactos() {

  const { usuario } = useAuth();
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;

    const fetchContactos = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await contactosService.getContactos(usuario.id);
        setContactos(data);
        // su red de personas vinculadas (solo los que tienen teléfono para llamar)
        const red = await usuarioService.getVinculos(usuario.id);
        setVinculos(red.filter((v) => v.familiar.telefono));
      } catch (err) {
        console.error(err);
        setError("Hubo un error al cargar los contactos");
      } finally {
        setLoading(false);
      }
    };

    fetchContactos();
  }, [usuario]);

  return (
    <>
      <main id="contenido-principal" tabIndex={-1} className="mainBody gap-4">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-32">
          <VueltaAtras titulo="Contactos" compacto seccion="Mis contactos" />

          <section className="flex w-full flex-col gap-3" aria-labelledby="servicios-auxilio">
            <h2 id="servicios-auxilio" className="flex items-center gap-2 text-lg font-semibold leading-6 text-[#16222C]">
              <LuAsterisk aria-hidden="true" className="size-4 text-[#C92A2A]" />
              Servicios de Auxilio
            </h2>
            <article className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-xs">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#A92323] text-white">
                  <LuBriefcaseMedical className="size-5" />
                </span>
                <h3 className="text-lg font-semibold leading-6 text-[#16222C]">107 Ambulancia (SAME)</h3>
              </div>
              <a href="tel:107" className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#A92323] px-4 py-3 text-xl font-bold leading-6 text-white hover:bg-[#921D1D] active:bg-[#741717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#741717]">
                <LuPhone aria-hidden="true" className="size-5" />
                Llamar al 107
              </a>
            </article>
          </section>

          <section className="flex w-full flex-col gap-4 pt-1" aria-labelledby="red-personas">
            <h2 id="red-personas" className="flex items-center gap-2 text-lg font-semibold leading-6 text-[#16222C]">
              <LuUsers aria-hidden="true" className="size-5 text-[#1550E0]" />
              Red de Personas
            </h2>

            {loading && <p role="status" className="text-sm text-[#435059]">Cargando contactos…</p>}
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

            {!loading && !error && (
              <div className="flex w-full flex-col gap-3">
                {vinculos.map((vinculo) => (
                  <TarjetaContactos
                    key={vinculo.id}
                    nombre={vinculo.familiar.nombreCompleto}
                    vinculo={textoRol(vinculo)}
                    telefono={vinculo.familiar.telefono ?? ""}
                  />
                ))}
                {contactos.map((contacto) => (
                  <TarjetaContactos
                    key={contacto.id}
                    nombre={contacto.nombre}
                    vinculo={esContactoMedico(contacto.nombre) ? "Médico de cabecera" : contacto.esEmergencia ? "Contacto de emergencia" : "Contacto"}
                    telefono={contacto.telefono}
                    esMedico={esContactoMedico(contacto.nombre)}
                  />
                ))}
                {vinculos.length === 0 && contactos.length === 0 && (
                  <p className="rounded-xl bg-white p-4 text-sm text-[#435059]">Todavía no tenés contactos cargados.</p>
                )}
              </div>
            )}
          </section>

          <Desplegable textoBoton="Invitar miembro a la red" varianteBoton="primario" />
        </div>
      </main>
    </>
  );
}
