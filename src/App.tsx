import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./Pages/Home";
import PanelAdulto from "./Pages/Adulto/panel-adulto";
import PanelCuidador from "./Pages/Cuidador/panel-cuidador";
import PanelFamilia from "./Pages/Familia/panel-familia";
import Ingreso from "./Pages/LogIn";
import PagCuenta from "./Pages/Cuenta";
import SOS from "./Pages/PantallaSOS";
import Salud from "./Pages/Salud";
import Contactos from "./Pages/Contactos";
import Config from "./Pages/Configuration";
import { ScrollToTop } from "./components/ScrollToTop";
import Footer from "./components/NavBar";
import Codigo from "./Pages/CodigoDeEmergencia";

// Layout que incluye el Footer 
function LayoutConFooter() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  console.log("/adulto, /cuidador, /familia");
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Ingreso />} />

        <Route element={<LayoutConFooter />}>
          <Route path="/home" element={<Home />} />
          <Route path="/adulto" element={<PanelAdulto />} />
          <Route path="/familia" element={<PanelFamilia />} />
          <Route path="/cuidador" element={<PanelCuidador />} />
          <Route path="/cuenta" element={<PagCuenta />} />
          <Route path="/SOS" element={<SOS />} />
          <Route path="/salud" element={<Salud />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/configuracion" element={<Config />} />
          <Route path="/codigo" element={<Codigo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;