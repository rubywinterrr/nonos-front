// Configuración principal de rutas de la aplicación.
// Se define aquí el flujo principal entre login, home, perfiles y pantallas de salud/contactos.
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import PanelAdulto from "./Pages/Adulto/panel-adulto";
import PanelCuidador from "./Pages/Cuidador/panel-cuidador";
import PanelFamilia from "./Pages/Familia/panel-familia";
import LogIn from "./Pages/LogIn";
import PagCuenta from "./Pages/Cuenta";
import SOS from "./Pages/PantallaSOS";
import Salud from "./Pages/Salud";
import Contactos from "./Pages/Contactos";
import Config from "./Pages/Configuration";

function App() {
  console.log("/adulto, /cuidador, /familia");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Adulto" element={<PanelAdulto />} />
          <Route path="/adulto" element={<PanelAdulto />} />
          <Route path="/Familia" element={<PanelFamilia />} />
          <Route path="/familia" element={<PanelFamilia />} />
          <Route path="/Cuidador" element={<PanelCuidador />} />
          <Route path="/cuidador" element={<PanelCuidador />} />
          <Route path="/" element={<LogIn />} />
          <Route path="/cuenta" element={<PagCuenta />} />
          <Route path="/Cuenta" element={<PagCuenta />} />
          <Route path="/SOS" element={<SOS />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/Salud" element={<Salud />} />
          <Route path="/salud" element={<Salud />} />
          <Route path="/Contactos" element={<Contactos />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/Configuracion" element={<Config />} />
          <Route path="/configuracion" element={<Config />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
