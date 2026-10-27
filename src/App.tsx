import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation
} from "react-router-dom";
import HomeAdulto from "./Pages/Adulto/Home";
import HomeCuidador from "./Pages/Cuidador/Home";
import HomeFamilia from "./Pages/Familia/Home";
import Ingreso from "./Pages/LogIn";
import PagCuenta from "./Pages/Cuenta";
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

function LayoutConFooter() {
  return (
    <>
      <Outlet />
      <Navbar />
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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Ingreso />} />
        <Route element={<RutaProtegida />}>
          <Route path="adulto-mayor/dispositivos" element={<VueltaPulsera />} />
          <Route element={<LayoutConFooter />}>
            <Route path="adulto">
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<HomeAdulto />} />
              <Route path="sos" element={<SOS />} />
              <Route path="salud" element={<Salud />} />
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

            <Route path="familia">
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<HomeFamilia />} />
            </Route>
            <Route path="cuidador">
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<HomeCuidador />} />
            </Route>
            <Route path="cuenta" element={<PagCuenta />} />
          </Route>
        </Route>
        <Route path="*" element={<SinRuta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
