import Header from "../components/Header2";

// Vista principal para información relacionada con salud y seguimiento del usuario.
export default function Salud() {
  return (
    <>
      <Header />
      <main className="w-screen min-h-main flex flex-col justify-center items-center">
        <h1 className="text-4xl font-extrabold">Salud</h1>
      </main>
    </>
  );
}
