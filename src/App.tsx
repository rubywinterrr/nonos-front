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
const SignosVitales = lazy(() => import("./Pages/Familia/signosVitales"));
const MedicacionActual = lazy(() => import("./Pages/Adulto/MedicacionActual"));
import RutaPorRol from "./components/RutaPorRol";
const ConfigCuenta1 = lazy(() => import("./Pages/configCuenta1"));
const ConfigCuenta2 = lazy(() => import("./Pages/configCuenta2"));
const ConfigFam = lazy(() => import("./Pages/Familia/configuracion"));
const MedFam = lazy(() => import("./Pages/Familia/med"));
const InfoAdulto = lazy(() => import("./Pages/Familia/infoAdulto"));
const Historial = lazy(() => import("./Pages/Familia/historial"));
const CodigoEmergencia = lazy(() => import("./Pages/Familia/codigo"));
const MedidasAnticipadas = lazy(
  () => import("./Pages/Familia/medidasAnticipadas"),
);
const SignosCuidador = lazy(() => import("./Pages/Cuidador/signosVitales"));
const MedCuidador = lazy(() => import("./Pages/Cuidador/med"));
const HistorialCuidador = lazy(() => import("./Pages/Cuidador/historial"));
const CodigoCuidador = lazy(() => import("./Pages/Cuidador/codigo"));
const AdultosACargo = lazy(() => import("./Pages/Cuidador/adultosACargo"));
const InfoAdultoCuidador = lazy(() => import("./Pages/Cuidador/infoAdulto"));
const AjustesCuidador = lazy(() => import("./Pages/Cuidador/AjustesAccess"));
const SignosAdulto = lazy(() => import("./Pages/Adulto/SignosVitales"));

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
          <Route path="/" element={<Navigate to="/ingresar" replace />} />
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
                <Route path="signos" element={<SignosVitales />} />
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
                <Route path="signos" element={<SignosCuidador />} />
                <Route path="medicamentos" element={<MedCuidador />} />
                <Route path="historial/adulto" element={<HistorialCuidador />} />
                <Route path="codigo-emergencia" element={<CodigoCuidador />} />
                <Route path="adultos-a-cargo" element={<AdultosACargo />} />
                <Route path="info/adulto" element={<InfoAdultoCuidador />} />
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
