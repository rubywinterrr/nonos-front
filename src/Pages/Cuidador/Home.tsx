import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";

// Panel principal para el perfil del cuidador.
// Se utiliza para mostrar información relevante y acceso rápido a herramientas del cuidado.
export default function PanelCuidador() {
  return (
    <>
      <main className="mainBody">
        <Header />
        <VueltaAtras />
      </main>
    </>
  );
}
