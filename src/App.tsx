import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import PanelAdulto from "./Pages/panel-adulto";
import PanelCuidador from "./Pages/panel-cuidador";
import PanelFamilia from "./Pages/panel-familia";

function App() {
  console.log("/adulto, /cuidador, /familia")
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Adulto" element={<PanelAdulto />} />
          <Route path="/Familia" element={<PanelFamilia />} />
          <Route path="/Cuidador" element={<PanelCuidador />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
