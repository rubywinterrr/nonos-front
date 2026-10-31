import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
const HomeAdulto = lazy(() => import("./Pages/Adulto/Home"));
const HomeCuidador = lazy(() => import("./Pages/Cuidador/Home"));
const HomeFamilia = lazy(() => import("./Pages/Familia/Home"));
const ContactosFamilia = lazy(() => import("./Pages/Familia/contactos"));
const Ingreso = lazy(() => import("./Pages/LogIn"));
const PagCuenta = lazy(() => import("./Pages/Adulto/Cuenta"));
const CuentaFamilia = lazy(() => import("./Pages/Familia/Cuenta"));
import { useAuth } from "./hooks/useAuth";
const SOS = lazy(() => import("./Pages/Adulto/PantallaSOS"));
const Salud = lazy(() => import("./Pages/Adulto/Salud"));
const Contactos = lazy(() => import("./Pages/Adulto/Contactos"));
const Config = lazy(() => import("./Pages/Adulto/Configuration"));
import { ScrollToTop } from "./components/ScrollToTop";
import Navbar from "./components/NavBar";
const Codigo = lazy(() => import("./Pages/Adulto/CodigoDeEmergencia"));
const Ayuda = lazy(() => import("./Pages/Adulto/Ayuda"));
const Tutorial1 = lazy(() => import("./Pages/Adulto/Tutorial1"));
const Tutorial1_2 = lazy(() => import("./Pages/Adulto/Tutorial1.2"));
import SinRuta from "./Pages/SinRuta";
const Cuidados = lazy(() => import("./Pages/Adulto/Cuidados"));
import RutaProtegida from "./components/RutaProtegida";
const AdmVinculo = lazy(() => import("./Pages/Adulto/administrarVinculo"));
const MedicacionActual = lazy(() => import("./Pages/Adulto/MedicacionActual"));
import RutaPorRol from "./components/RutaPorRol";
const ConfigCuenta1 = lazy(() => import("./Pages/configCuenta1"));
const ConfigCuenta2 = lazy(() => import("./Pages/configCuenta2"));
const ConfigFam = lazy(() => import("./Pages/Familia/configuracion"));
const MedFam = lazy(() => import("./Pages/Red/med"));
const InfoAdulto = lazy(() => import("./Pages/Red/infoAdulto"));
const Historial = lazy(() => import("./Pages/Red/historial"));
const CodigoEmergencia = lazy(() => import("./Pages/Red/codigo"));
const MedidasAnticipadas = lazy(() => import("./Pages/Red/medidasAnticipadas"));
const AdultosACargo = lazy(() => import("./Pages/Cuidador/adultosACargo"));
const AjustesCuidador = lazy(() => import("./Pages/Cuidador/AjustesAccess"));
// Signos vitales: la misma pantalla para los 3 roles (muestra al adulto que se está mirando)
const SignosAdulto = lazy(() => import("./Pages/Adulto/SignosVitales"));
const DetallePulso = lazy(() => import("./Pages/Signos/DetallePulso"));
const DetalleOxigeno = lazy(() => import("./Pages/Signos/DetalleOxigeno"));
const DetallePasos = lazy(() => import("./Pages/Signos/DetallePasos"));
const DetalleSueno = lazy(() => import("./Pages/Signos/DetalleSueno"));

function LayoutConFooter() {
  const location = useLocation();
  return (
    <>
      <Outlet />
      {!location.pathname.startsWith("/adulto/configurar-cuenta") && <Navbar />}
    </>
  );
}

// PARCHE: al terminar de conectar la pulsera, el back vuelve a /adulto-mayor/dispositivos,
// que no existe en el front. Esto manda a /cuenta conservando el ?conectado=1 o ?conectado=0.
// Sacarlo cuando el back redirija directo a /cuenta.
function VueltaPulsera() {
  const location = useLocation();
  return <Navigate to={`/cuenta${location.search}`} replace />;
}

function CuentaSegunRol() {
  const { usuario } = useAuth();
  return usuario?.rol === "FAMILIAR" ? <CuentaFamilia /> : <PagCuenta />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="mainBody" aria-live="polite" aria-busy="true" />
        }
      >
        <Routes>
          <Route path="/ingresar" element={<Ingreso />} />
          <Route element={<RutaProtegida />}>
            <Route
              path="adulto-mayor/dispositivos"
              element={<VueltaPulsera />}
            />
            <Route element={<LayoutConFooter />}>
              <Route path="adulto" element={<RutaPorRol rol="ADULTO_MAYOR" />}>
                <Route index element={<Navigate to="home" replace />} />
                <Route path="configurar-cuenta" element={<ConfigCuenta1 />} />
                <Route path="configurar-cuenta/2" element={<ConfigCuenta2 />} />
                <Route path="home" element={<HomeAdulto />} />
                <Route path="signos" element={<SignosAdulto />} />
                <Route path="signos/pulso" element={<DetallePulso />} />
                <Route path="signos/oxigeno" element={<DetalleOxigeno />} />
                <Route path="signos/pasos" element={<DetallePasos />} />
                <Route path="signos/sueno" element={<DetalleSueno />} />
                <Route path="sos" element={<SOS />} />
                <Route path="salud" element={<Salud />} />
                <Route path="medicamentos" element={<MedicacionActual />} />
                <Route path="contactos" element={<Contactos />} />
                <Route path="configuracion" element={<Config />} />
                <Route path="codigo" element={<Codigo />} />
                <Route path="cuidados" element={<Cuidados />} />
                <Route path="Administrar-Vinculo" element={<AdmVinculo />} />
                <Route path="ayuda">
                  <Route index element={<Ayuda />} />
                  <Route path="tutorial1" element={<Tutorial1 />} />
                  <Route path="tutorial1.2" element={<Tutorial1_2 />} />
                </Route>
              </Route>

              <Route path="familia" element={<RutaPorRol rol="FAMILIAR" />}>
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<HomeFamilia />} />
                <Route path="signos" element={<SignosAdulto />} />
                <Route path="signos/pulso" element={<DetallePulso />} />
                <Route path="signos/oxigeno" element={<DetalleOxigeno />} />
                <Route path="signos/pasos" element={<DetallePasos />} />
                <Route path="signos/sueno" element={<DetalleSueno />} />
                <Route path="contactos" element={<ContactosFamilia />} />
                <Route path="configuracion" element={<ConfigFam />} />
                <Route path="medicacion" element={<MedFam />} />
                <Route path="historial/adulto" element={<Historial />} />
                <Route
                  path="codigo-emergencia"
                  element={<CodigoEmergencia />}
                />
                <Route
                  path="medidas-anticipadas"
                  element={<MedidasAnticipadas />}
                />
                <Route path="info/adulto" element={<InfoAdulto />} />
              </Route>
              <Route path="cuidador" element={<RutaPorRol rol="CUIDADOR" />}>
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<HomeCuidador />} />
                <Route path="signos" element={<SignosAdulto />} />
                <Route path="signos/pulso" element={<DetallePulso />} />
                <Route path="signos/oxigeno" element={<DetalleOxigeno />} />
                <Route path="signos/pasos" element={<DetallePasos />} />
                <Route path="signos/sueno" element={<DetalleSueno />} />
                <Route path="medicamentos" element={<MedFam />} />
                <Route path="historial/adulto" element={<Historial />} />
                <Route path="codigo-emergencia" element={<CodigoEmergencia />} />
                <Route path="adultos-a-cargo" element={<AdultosACargo />} />
                <Route path="info/adulto" element={<InfoAdulto />} />
                {/* todavía sin diseño propio del cuidador: usan las del familiar */}
                <Route path="medidas-anticipadas" element={<MedidasAnticipadas />} />
                <Route path="contactos" element={<ContactosFamilia />} />
                <Route path="configuracion" element={<AjustesCuidador />} />
              </Route>
              <Route path="cuenta" element={<CuentaSegunRol />} />
            </Route>
          </Route>
          <Route path="*" element={<SinRuta />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
