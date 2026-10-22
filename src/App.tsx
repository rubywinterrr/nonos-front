import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
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
import Navbar2 from "./components/NavBar2";
import Codigo from "./Pages/Adulto/CodigoDeEmergencia";
import Ayuda from "./Pages/Adulto/Ayuda";
import Tutorial1 from "./Pages/Adulto/Tutorial1";
import Tutorial1_2 from "./Pages/Adulto/Tutorial1.2";
import SinRuta from "./Pages/SinRuta";
import Cuidados from "./Pages/Adulto/Cuidados";
import RutaProtegida from "./components/RutaProtegida";

function LayoutConFooter() {
  return (
    <>
      <Outlet />
      <Navbar2 />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Ingreso />} />
        <Route element={<RutaProtegida />}>
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
