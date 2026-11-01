import { useEffect, useState } from "react";
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import MiPerfil from "../../components/MiPerfil";
import Desplegable from "../../components/menuDesplegable";
import { useAuth } from "../../hooks/useAuth";
import PulseraConexion from "../../components/PulseraConexion";
import AdultosVinculados from "../../components/AdultosVinculados";
import calcularEdad from "../../utils/calcularEdad";
import {
  LuChevronRight,
  LuCircleDot,
  LuFingerprint,
  LuGlobe,
  LuLockKeyhole,
  LuLogOut,
  LuMail,
  LuPencil,
  LuPhone,
  LuPlus,
  LuRadio,
  LuShieldCheck,
  LuSmartphone,
  LuUserRound,
} from "react-icons/lu";
import { dispositivosService, type Dispositivo } from "../../services/dispositivosService";
import { usuarioService, type Vinculo } from "../../services/usuariosService";

function textoRol(rol: string) {
  if (rol === "ADULTO_MAYOR") return "Adulto Mayor";
  if (rol === "FAMILIAR") return "Familiar";
  return "Cuidador";
}

export default function PagCuenta() {
  const { usuario, logout } = useAuth();
  const esAdulto = usuario?.rol === "ADULTO_MAYOR";
  const nombreDePila = usuario ? usuario.nombreCompleto.trim().split(" ")[0] : "";
  const [boton, setBoton] = useState<Dispositivo | null>(null);
  const [identificador, setIdentificador] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const [secreto, setSecreto] = useState<string | null>(null);
  const [errorBoton, setErrorBoton] = useState<string | null>(null);
  const [contactoApoyo, setContactoApoyo] = useState<Vinculo | null>(null);
  // se suma 1 después de registrar el botón, para volver a traerlo
  const [recargar, setRecargar] = useState(0);

  useEffect(() => {
    if (!usuario || usuario.rol !== "ADULTO_MAYOR") return;
    const id = usuario.id;

    // trae el botón físico registrado (si hay) y la persona principal de su red
    const cargar = async () => {
      try {
        const dispositivos = await dispositivosService.getDispositivos(id);
        setBoton(dispositivos.find((d) => d.tipo === "BOTON_FISICO") ?? null);
      } catch (err) {
        console.error(err);
      }
      try {
        const vinculos = await usuarioService.getVinculos(id);
        const deEmergencia = vinculos.find((v) => v.esContactoEmergencia);
        setContactoApoyo(deEmergencia ?? vinculos[0] ?? null);
      } catch (err) {
        console.error(err);
      }
    };
    cargar();
  }, [usuario, recargar]);

  // registra el botón físico con el código que figura en su base
  const registrarBoton = async () => {
    if (!usuario || !identificador.trim()) {
      setErrorBoton("Escribí el identificador del botón.");
      return;
    }
    setRegistrando(true);
    setErrorBoton(null);
    try {
      const respuesta = await dispositivosService.registrarBotonFisico({
        usuarioId: usuario.id,
        identificadorExterno: identificador.trim(),
      });
      // el back muestra el secreto una sola vez: hay que anotarlo para configurar el botón
      setSecreto(respuesta.secreto);
      setIdentificador("");
      setRecargar(recargar + 1);
    } catch (err) {
      console.error(err);
      setErrorBoton(err instanceof Error ? err.message : "No se pudo registrar el botón.");
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <main className="mainBody">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo="Mi cuenta" compacto />

        <section
          aria-label="Datos de la cuenta"
          className="w-full rounded-2xl border border-[#D7DFE6] bg-white p-4 shadow-xs"
        >
          <div className="flex items-center gap-3.5 border-b border-[#D7DFE6] pb-4">
            {usuario?.fotoUrl ? (
              <img
                src={usuario.fotoUrl}
                alt="Foto de perfil"
                className="size-12 shrink-0 rounded-full bg-[#E7EDFB] object-cover"
              />
            ) : (
              <LuUserRound aria-hidden="true" className="size-12 shrink-0 rounded-full bg-[#E7EDFB] p-2.5 text-[#1550E0]" />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold leading-6">
                  {usuario?.nombreCompleto}
                </h2>
                {esAdulto && (
                  <span className="rounded-full border border-[#BAEDD3] bg-[#E9EEF2] px-2 py-0.5 text-xs font-bold text-[#0B4C2B]">
                    Titular
                  </span>
                )}
              </div>
              <p className="text-xs font-medium leading-4 text-[#435059]">
                {usuario?.fechaNacimiento && `${calcularEdad(usuario.fechaNacimiento)} años · `}
                {textoRol(usuario?.rol || "ADULTO_MAYOR")}
              </p>
            </div>
          </div>
          <div className="space-y-2.5 pt-3">
            <div className="flex items-start gap-2.5">
              <LuMail
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-[#1550E0]"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase leading-4 text-[#435059]">
                  Correo electrónico
                </p>
                <p className="break-all text-sm font-semibold leading-5">
                  {usuario?.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <LuPhone
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-[#1550E0]"
              />
              <div>
                <p className="text-xs font-semibold uppercase leading-4 text-[#435059]">
                  Teléfono vinculado
                </p>
                <p className="text-sm font-semibold leading-5">
                  {usuario?.telefono || "Sin dato"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* el cuidador también usa esta pantalla: ve a los adultos que tiene a cargo */}
        {!esAdulto && <AdultosVinculados />}

        {esAdulto && (
          <section
            aria-labelledby="titulo-dispositivos"
            className="flex w-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm"
          >
            <div>
              <h2
                id="titulo-dispositivos"
                className="flex items-center gap-2 text-base font-bold leading-5"
              >
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#E7EDFB] text-[#1550E0]">
                  <LuSmartphone aria-hidden="true" className="size-4" />
                </span>
                Pulsera y botón
              </h2>
              <p className="mt-1 pl-9 text-xs leading-5 text-[#435059]">
                Dispositivos de cuidado de {nombreDePila}: botón de emergencia y
                pulsera de salud.
              </p>
            </div>
            <article className="rounded-2xl border border-[#D7DFE6] bg-white p-3.5">
              <h3 className="flex items-center gap-2 text-sm font-bold leading-5">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#E7EDFB] text-[#1550E0]">
                  <LuCircleDot aria-hidden="true" className="size-4" />
                </span>
                Botón de emergencia
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#435059]">
                El botón físico envía la misma alerta prioritaria que el botón
                de la aplicación.
              </p>
              {boton ? (
                <div className="mt-2 flex flex-col items-center justify-center gap-1 rounded-xl border border-[#BAEDD3] bg-[#E8FAF1] p-3 text-center">
                  <p className="text-xs font-bold text-[#0B4C2B]">Botón registrado</p>
                  <p className="text-xs text-[#435059]">Identificador: {boton.identificadorExterno}</p>
                </div>
              ) : (
                <>
                  <div className="mt-2 flex min-h-30 flex-col items-center justify-center rounded-xl border border-dashed border-[#D7DFE6] p-3 text-center">
                    <span className="mb-2 flex size-8 items-center justify-center rounded-full bg-[#E9EEF2] text-[#435059]">
                      <LuRadio aria-hidden="true" className="size-4" />
                    </span>
                    <p className="text-xs font-bold">
                      No hay ningún botón registrado
                    </p>
                    <p className="mt-1 max-w-60 text-xs leading-4 text-[#435059]">
                      Registrá el código para que sus pedidos de ayuda lleguen a tu
                      red.
                    </p>
                  </div>
                  <label
                    htmlFor="identificador-boton"
                    className="mt-4 block text-xs font-bold uppercase tracking-wide text-[#435059]"
                  >
                    Identificador del botón
                  </label>
                  <input
                    id="identificador-boton"
                    type="text"
                    value={identificador}
                    onChange={(evento) => setIdentificador(evento.target.value)}
                    placeholder="Ej: NONOS-8492 o MAC"
                    className="mt-2 h-11 w-full rounded-xl border border-[#D7DFE6] bg-white px-3 text-sm font-medium outline-none placeholder:text-[#435059] focus:border-[#1550E0] focus:ring-2 focus:ring-[#B7C8F0]"
                  />
                  <p className="mt-2 text-xs text-[#435059]">
                    Figura en la base del dispositivo físico.
                  </p>
                  <button
                    type="button"
                    onClick={registrarBoton}
                    disabled={registrando}
                    className="mt-2 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#1550E0] px-4 text-lg font-bold text-white shadow-sm hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
                  >
                    <LuPlus aria-hidden="true" className="size-5" /> {registrando ? "Registrando…" : "Registrar botón"}
                  </button>
                </>
              )}
              {errorBoton && <p role="alert" className="mt-2 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{errorBoton}</p>}
              {secreto && (
                <p role="status" className="mt-2 rounded-xl border border-[#BAEDD3] bg-[#E8FAF1] p-3 text-sm text-[#0B4C2B]">
                  Botón registrado. Anotá esta clave para configurarlo, se muestra una sola vez:{" "}
                  <span className="font-mono font-bold">{secreto}</span>
                </p>
              )}
            </article>
            {/* conectar, sincronizar y recuperar datos de la pulsera */}
            <PulseraConexion />
          </section>
        )}

        <section
          aria-labelledby="titulo-seguridad"
          className="flex w-full flex-col gap-3 rounded-2xl border border-[#D7DFE6] bg-white p-4 shadow-xs"
        >
          <h2
            id="titulo-seguridad"
            className="flex items-center gap-1.5 text-sm font-bold leading-5"
          >
            <LuLockKeyhole
              aria-hidden="true"
              className="size-4 text-[#1550E0]"
            />{" "}
            Seguridad y acceso rápido
          </h2>
          <article className="rounded-xl border border-[#D7DFE6] p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold">Contraseña de acceso</h3>
              {/* PENDIENTE BACK: no hay dato de cuándo se cambió la contraseña */}
              <span className="rounded border border-[#D7DFE6] px-2 py-0.5 text-xs text-[#435059]">
                Hace 3 meses
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#435059]">
              Puedes cambiar tu contraseña o solicitar asistencia si no la
              recuerdas con claridad.
            </p>
            {/* PENDIENTE BACK: no hay endpoint para cambiar o restablecer la contraseña */}
            <button
              type="button"
              className="mt-2 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#D7DFE6] bg-white px-3 text-xs font-bold text-[#1550E0] hover:bg-[#E7EDFB] active:bg-[#B7C8F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
            >
              <LuPencil aria-hidden="true" className="size-4" /> Restablecer mi
              contraseña
            </button>
          </article>
          {/* PENDIENTE BACK: no existe el acceso con huella o PIN */}
          <div className="flex items-center gap-3 rounded-xl border border-[#D7DFE6] bg-[#E9EEF2] p-3">
            <LuFingerprint
              aria-hidden="true"
              className="size-7 shrink-0 text-[#1550E0]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold">
                Acceso rápido con Huella o PIN
              </p>
              <p className="text-xs text-[#435059]">
                Ingresa sin escribir la contraseña
              </p>
            </div>
            <span
              aria-label="Activado"
              className="flex h-6 w-10 shrink-0 items-center justify-end rounded-full bg-[#1550E0] p-0.5"
            >
              <span className="size-5 rounded-full bg-white" />
            </span>
          </div>
        </section>

        {esAdulto && contactoApoyo && (
          <aside className="flex w-full items-start gap-3 rounded-2xl border border-[#BAEDD3] bg-[#E9EEF2] p-4">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E8FAF1] text-[#0B6D3C]">
              <LuShieldCheck aria-hidden="true" className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold">Red de apoyo vinculada</h2>
              <p className="mt-1 text-xs leading-4 text-[#0B4C2B]">
                {/* PENDIENTE BACK: el vínculo no guarda el parentesco, por ahora "Tu hija" queda fijo */}
                Tu hija <strong>{contactoApoyo.familiar.nombreCompleto}</strong> está autorizada para
                asistir con el acceso a tu cuenta si alguna vez lo necesitas.
              </p>
            </div>
          </aside>
        )}

        {/* agregado (no está en el Figma): editar mis datos, cerrar todas las sesiones y dar de baja la cuenta */}
        <MiPerfil />

        {usuario?.rol !== "CUIDADOR" && <Desplegable />}

        <button
          type="button"
          className="flex min-h-12 w-full cursor-pointer items-center justify-between rounded-2xl border border-[#D7DFE6] bg-white px-4 text-xs hover:bg-[#E9EEF2] active:bg-[#D7DFE6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]"
        >
          <span className="flex items-center gap-2 font-semibold">
            <LuGlobe aria-hidden="true" className="size-4" /> Idioma
          </span>
          <span className="flex items-center gap-1 text-[#435059]">
            Español <LuChevronRight aria-hidden="true" className="size-4" />
          </span>
        </button>
        <div className="flex flex-col items-center gap-3 pb-4 pt-1">
          <button
            type="button"
            onClick={logout}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#EABDBD] bg-white px-4 text-lg font-bold text-[#A92323] hover:bg-[#FDEAEA] active:bg-[#F5D0D0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A92323]"
          >
            <LuLogOut aria-hidden="true" className="size-5" /> Cerrar sesión
          </button>
          <p className="text-center text-xs font-medium text-[#435059]">
            NONOS v2.4.1 — Cuenta protegida y cifrada
          </p>
        </div>
      </div>
    </main>
  );
}