import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import PanelAdulto from "./Pages/Adulto/panel-adulto";
import PanelCuidador from "./Pages/Cuidador/panel-cuidador";
import PanelFamilia from "./Pages/Familia/panel-familia";
import LogIn from "./Pages/LogIn";
import PagCuenta from "./Pages/Cuenta";

function App() {
  console.log("/adulto, /cuidador, /familia");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Adulto" element={<PanelAdulto />} />
          <Route path="/Familia" element={<PanelFamilia />} />
          <Route path="/Cuidador" element={<PanelCuidador />} />
          <Route path="/" element={<LogIn />} />
          <Route path="/cuenta" element={<PagCuenta />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
