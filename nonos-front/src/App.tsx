import "./App.css";
import { MiPantalla } from "./Panel-Adulto/main";
import CajaArriba from "./componentes/HeaderFolder/cajaArriba";
import CajaAbajo from "./componentes/FooterFolder/cajaAbajo";

function App() {
  return (
    <>
      <CajaArriba></CajaArriba>
      <MiPantalla />
      <CajaAbajo></CajaAbajo>
    </>
  );
}

export default App;
