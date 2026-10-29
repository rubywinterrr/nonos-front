import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import HomeAdulto from "./Pages/Adulto/Home";
import HomeCuidador from "./Pages/Cuidador/Home";
import SeccionPendiente from "./Pages/Cuidador/SeccionPendiente";
import HomeFamilia from "./Pages/Familia/Home";
import ContactosFamilia from "./Pages/Familia/contactos";
import Ingreso from "./Pages/LogIn";
import PagCuenta from "./Pages/Adulto/Cuenta";
import CuentaFamilia from "./Pages/Familia/Cuenta";
import { useAuth } from "./hooks/useAuth";
import SOS from "./Pages/Adulto/PantallaSOS";
import Salud from "./Pages/Adulto/Salud";
import Contactos from "./Pages/Adulto/Contactos";
import Config from "./Pages/Configuration";
import { ScrollToTop } from "./components/ScrollToTop";
import Navbar from "./components/NavBar";
import Codigo from "./Pages/Adulto/CodigoDeEmergencia";
import Ayuda from "./Pages/Adulto/Ayuda";
import Tutorial1 from "./Pages/Adulto/Tutorial1";
import Tutorial1_2 from "./Pages/Adulto/Tutorial1.2";
import SinRuta from "./Pages/SinRuta";
import Cuidados from "./Pages/Adulto/Cuidados";
import RutaProtegida from "./components/RutaProtegida";
import AdmVinculo from "./Pages/Adulto/administrarVinculo";
import SignosVitales from "./Pages/Familia/signosVitales";
import MedicacionActual from "./Pages/Adulto/MedicacionActual";
import RutaPorRol from "./components/RutaPorRol";
import ConfigCuenta1 from "./Pages/configCuenta1";
import ConfigCuenta2 from "./Pages/configCuenta2";
import Landing from "./Pages/Landing";
import ConfigFam from "./Pages/Familia/configuracion";
import MedFam from "./Pages/Familia/med";
import InfoAdulto from "./Pages/Familia/infoAdulto";
import Historial from "./Pages/Familia/historial";
import CodigoEmergencia from "./Pages/Familia/codigo";
import MedidasAnticipadas from "./Pages/Familia/medidasAnticipadas";

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
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ingresar" element={<Ingreso />} />
        <Route element={<RutaProtegida />}>
          <Route path="adulto-mayor/dispositivos" element={<VueltaPulsera />} />
          <Route element={<LayoutConFooter />}>
            <Route path="adulto" element={<RutaPorRol rol="ADULTO_MAYOR" />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="configurar-cuenta" element={<ConfigCuenta1 />} />
              <Route path="configurar-cuenta/2" element={<ConfigCuenta2 />} />
              <Route path="home" element={<HomeAdulto />} />
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
              <Route path="codigo-emergencia" element={<CodigoEmergencia />} />
              <Route
                path="medidas-anticipadas"
                element={<MedidasAnticipadas />}
              />
              <Route path="info/adulto" element={<InfoAdulto />} />
            </Route>
            <Route path="cuidador" element={<RutaPorRol rol="CUIDADOR" />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<HomeCuidador />} />
              <Route
                path="medicamentos"
                element={<SeccionPendiente titulo="Medicinas" />}
              />
              <Route
                path="contactos"
                element={<SeccionPendiente titulo="Contactos" />}
              />
              <Route
                path="configuracion"
                element={<SeccionPendiente titulo="Ajustes" />}
              />
            </Route>
            <Route path="cuenta" element={<CuentaSegunRol />} />
          </Route>
        </Route>
        <Route path="*" element={<SinRuta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
