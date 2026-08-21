export default function Boton1() {
  function Cambio() {
    console.log("cambio de pantalla");
  }

  return (
    <>
      <button onClick={Cambio}>Cambiar</button>
    </>
  );
}
