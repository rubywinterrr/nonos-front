import "./App.css";
import { MiPantalla } from "./Panel-Adulto/main";
import CajaArriba from "./componentes/cajaArriba";
import CajaAbajo from "./componentes/cajaAbajo";

function App() {
  return (
    <>
      <CajaArriba></CajaArriba>
      <MiPantalla></MiPantalla>
      <CajaAbajo></CajaAbajo>
    </>
  );
}

export default App;
