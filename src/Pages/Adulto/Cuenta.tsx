import { useEffect, useState, type FormEvent } from "react";
import VueltaAtras from "../../components/vueltaAtras";
import MiPerfil from "../../components/MiPerfil";
import CambiarPassword from "../../components/CambiarPassword";
import Desplegable from "../../components/menuDesplegable";
import PulseraConexion from "../../components/PulseraConexion";
import AdultosVinculados from "../../components/AdultosVinculados";
import calcularEdad from "../../utils/calcularEdad";
import { useAuth } from "../../hooks/useAuth";
import { dispositivosService, type Dispositivo } from "../../services/dispositivosService";
import { usuarioService, type Vinculo } from "../../services/usuariosService";
import { etiquetaRolVinculo } from "../../utils/etiquetaRol";
import {
  LuCircleDot,
  LuLanguages,
  LuLogOut,
  LuMail,
  LuPencil,
  LuPhone,
  LuPlus,
  LuShieldCheck,
  LuSmartphone,
  LuUserRound,
} from "react-icons/lu";

function textoRol(rol: string) {
  if (rol === "ADULTO_MAYOR") return "Adulto mayor";
  if (rol === "FAMILIAR") return "Familiar";
  return "Cuidador";
}

function iniciales(nombre: string) {
  return nombre.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]?.toLocaleUpperCase("es-AR") ?? "").join("");
}

export default function PagCuenta() {
  const { usuario, logout } = useAuth();
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const esAdulto = usuario?.rol === "ADULTO_MAYOR";
  const [boton, setBoton] = useState<Dispositivo | null>(null);
  const [identificador, setIdentificador] = useState("");
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [secreto, setSecreto] = useState<string | null>(null);
  const [errorBoton, setErrorBoton] = useState<string | null>(null);
  const [contactoApoyo, setContactoApoyo] = useState<Vinculo | null>(null);
  const [recargar, setRecargar] = useState(0);

  useEffect(() => {
    if (!usuario || !esAdulto) return;
    let activo = true;
    const cargar = async () => {
      try {
        const dispositivos = await dispositivosService.getDispositivos(usuario.id);
        if (activo) setBoton(dispositivos.find((dispositivo) => dispositivo.tipo === "BOTON_FISICO") ?? null);
      } catch (err) {
        console.error(err);
      }
      try {
        const vinculos = await usuarioService.getVinculos(usuario.id);
        if (activo) setContactoApoyo(vinculos.find((vinculo) => vinculo.esContactoEmergencia) ?? vinculos[0] ?? null);
      } catch (err) {
        console.error(err);
      }
    };
    void cargar();
    return () => { activo = false; };
  }, [usuario, esAdulto, recargar]);

  const registrarBoton = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
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
      setSecreto(respuesta.secreto);
      setIdentificador("");
      setMostrarRegistro(false);
      setRecargar((actual) => actual + 1);
    } catch (err) {
      console.error(err);
      setErrorBoton(err instanceof Error ? err.message : "No se pudo registrar el botón.");
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <main id="contenido-principal" tabIndex={-1} className="mainBody">
      <VueltaAtras titulo="Mi cuenta" compacto seccion="Mi cuenta" />

      <div className="mx-auto flex w-full max-w-lg flex-col gap-3.5">
        <section aria-label="Datos de la cuenta" className="flex w-full flex-col rounded-2xl border border-[#D7DFE6] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3.5 border-b border-[#D7DFE6] pb-4">
            {usuario?.fotoUrl ? (
              <img src={usuario.fotoUrl} alt="Foto de perfil" className="size-12 shrink-0 rounded-full bg-[#E7EDFB] object-cover" />
            ) : (
              <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#E7EDFB] text-base font-bold text-[#0E3494]">
                {usuario?.nombreCompleto ? iniciales(usuario.nombreCompleto) : <LuUserRound className="size-6" />}
              </span>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold leading-7 text-[#16222C]">{usuario?.nombreCompleto ?? "Mi cuenta"}</h2>
              <p className="text-base leading-6 text-[#435059]">
                {usuario?.fechaNacimiento ? `${calcularEdad(usuario.fechaNacimiento)} años` : textoRol(usuario?.rol ?? "ADULTO_MAYOR")}
              </p>
            </div>
          </div>

          <dl className="flex flex-col gap-2 pt-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <dt><span className="sr-only">Correo electrónico</span><LuMail aria-hidden="true" className="size-4 shrink-0 text-[#1550E0]" /></dt>
              <dd className="min-w-0 break-all text-base font-semibold leading-6 text-[#16222C]">{usuario?.email ?? "Sin correo registrado"}</dd>
            </div>
            <div className="flex items-center gap-2.5">
              <dt><span className="sr-only">Teléfono</span><LuPhone aria-hidden="true" className="size-4 shrink-0 text-[#1550E0]" /></dt>
              <dd className="text-base font-semibold leading-6 text-[#16222C]">{usuario?.telefono || "Sin teléfono registrado"}</dd>
            </div>
          </dl>
        </section>

        {!esAdulto && <AdultosVinculados />}

        {esAdulto && (
          <section aria-labelledby="titulo-dispositivos" className="flex w-full flex-col gap-3 rounded-2xl border border-white bg-white p-4 shadow-sm">
            <h2 id="titulo-dispositivos" className="flex items-center gap-2 text-lg font-bold leading-6 text-[#0E1D28]">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#EBF5FE] text-[#1550E0]">
                <LuSmartphone aria-hidden="true" className="size-4" />
              </span>
              Pulsera y botón
            </h2>

            <article className="flex w-full flex-col gap-2 rounded-xl border border-[#E2EAF5] p-3">
              <h3 className="flex items-center gap-2 text-xl font-bold leading-7 text-[#0E1D28]">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EBF5FE] text-[#1550E0]">
                  <LuCircleDot aria-hidden="true" className="size-4" />
                </span>
                Botón de emergencia
              </h3>

              {boton ? (
                <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-[#BAEDD3] bg-[#E8FAF1] p-3 text-center">
                  <p className="font-bold text-[#0B4C2B]">Botón registrado</p>
                  <p className="text-sm text-[#435059]">Identificador: {boton.identificadorExterno}</p>
                </div>
              ) : mostrarRegistro ? (
                <form onSubmit={registrarBoton} className="flex w-full flex-col gap-2.5">
                  <p className="text-sm leading-5 text-[#435059]">El botón físico envía la misma alerta prioritaria que el botón de la aplicación.</p>
                  <label htmlFor="identificador-boton" className="text-sm font-bold text-[#16222C]">Identificador del botón</label>
                  <input
                    id="identificador-boton"
                    type="text"
                    autoComplete="off"
                    value={identificador}
                    onChange={(evento) => setIdentificador(evento.target.value)}
                    placeholder="Ej: NONOS-8492 o MAC"
                    required
                    className="h-12 w-full rounded-xl border border-[#D7DFE6] bg-white px-3 text-base font-medium outline-none placeholder:text-[#667780] focus:border-[#1550E0] focus:ring-2 focus:ring-[#B7C8F0]"
                  />
                  <p className="text-sm text-[#435059]">El código figura en la base del dispositivo físico.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => { setMostrarRegistro(false); setErrorBoton(null); }} className="min-h-12 cursor-pointer rounded-xl border border-[#D7DFE6] bg-white font-bold text-[#16222C] hover:bg-[#E9EEF2] active:bg-[#D7DFE6]">Cancelar</button>
                    <button type="submit" disabled={registrando} className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1550E0] px-3 font-bold text-white hover:bg-[#1245BF] active:bg-[#0F389D] disabled:cursor-wait disabled:opacity-60">
                      {registrando ? "Registrando…" : "Confirmar"}
                    </button>
                  </div>
                </form>
              ) : (
                <button type="button" onClick={() => setMostrarRegistro(true)} className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-[#B7C8F0] bg-[#1550E0] px-4 text-lg font-bold text-white shadow-xs transition-colors hover:bg-[#1245BF] active:bg-[#0F389D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]">
                  <LuPlus aria-hidden="true" className="size-5" /> Registrar botón
                </button>
              )}
              {errorBoton && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{errorBoton}</p>}
              {secreto && (
                <p role="status" className="rounded-xl border border-[#BAEDD3] bg-[#E8FAF1] p-3 text-sm text-[#0B4C2B]">
                  Botón registrado. Anotá esta clave para configurarlo, se muestra una sola vez: <span className="font-mono font-bold">{secreto}</span>
                </p>
              )}
            </article>

            <PulseraConexion />
          </section>
        )}

        <div className="flex min-h-13 w-full items-center justify-between rounded-2xl border border-[#D7DFE6] bg-white px-4 text-base transition-colors">
          <span className="flex items-center gap-2 font-semibold text-[#16222C]"><LuLanguages aria-hidden="true" className="size-4" /> Idioma</span>
          <span className="flex items-center gap-1 text-[#435059]">Español</span>
        </div>

        <button type="button" id="abrir-cambiar-password" aria-expanded={cambiandoPassword} aria-controls={cambiandoPassword ? "cambiar-password" : undefined} onClick={() => setCambiandoPassword(!cambiandoPassword)} className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#D7DFE6] bg-white px-4 text-lg font-bold text-[#0049CC] transition-colors hover:bg-[#E7EDFB] active:bg-[#D7DFE6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]">
          <LuPencil aria-hidden="true" className="size-4" /> Cambiar mi contraseña
        </button>
        {cambiandoPassword && <CambiarPassword onCerrar={() => { setCambiandoPassword(false); document.getElementById("abrir-cambiar-password")?.focus(); }} />}

        {esAdulto && contactoApoyo && (
          <aside className="flex w-full items-start gap-3 rounded-2xl border border-[#BAEDD3] bg-[#E9EEF2] p-4">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E8FAF1] text-[#0B6D3C]"><LuShieldCheck aria-hidden="true" className="size-4" /></span>
            <div>
              <h2 className="text-sm font-bold">Red de apoyo vinculada</h2>
              <p className="mt-1 text-sm leading-5 text-[#0B4C2B]">
                Tu {etiquetaRolVinculo(contactoApoyo.tipoVinculo, contactoApoyo.tipoCuidador).toLowerCase()} <strong>{contactoApoyo.familiar.nombreCompleto}</strong> puede asistir con el acceso a tu cuenta.
              </p>
            </div>
          </aside>
        )}

        <button type="button" onClick={logout} className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#EABDBD] bg-white px-4 text-lg font-bold text-[#A92323] transition-colors hover:bg-[#FDEAEA] active:bg-[#F5D0D0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A92323]">
          <LuLogOut aria-hidden="true" className="size-5" /> Cerrar sesión
        </button>

        <details className="group flex w-full flex-col rounded-2xl border border-white/70 bg-white/60 p-4">
          <summary className="cursor-pointer list-none text-center text-sm font-semibold text-[#435059] underline decoration-[#9BA8B2] underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1550E0]">
            Más opciones de cuenta
          </summary>
          <div className="mt-4 flex flex-col gap-3">
            <MiPerfil />
            <Desplegable textoBoton={usuario?.rol === "CUIDADOR" ? "Invitar a un adulto mayor" : undefined} />
          </div>
        </details>

        <p className="pb-4 pt-1 text-center text-xs font-medium text-[#435059]">NONOS v2.4.1 — Cuenta protegida y cifrada</p>
      </div>
    </main>
  );
}
