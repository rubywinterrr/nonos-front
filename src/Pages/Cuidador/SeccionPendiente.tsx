import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";

export default function SeccionPendiente({ titulo }: { titulo: string }) {
  return (
    <main className="mainBody">
      <Header />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <VueltaAtras titulo={titulo} compacto />
        <section className="rounded-2xl bg-white p-5 text-[#16222C]">
          <h2 className="text-lg font-bold">{titulo}</h2>
          <p className="mt-2 text-sm text-[#435059]">Esta sección estará disponible próximamente.</p>
        </section>
      </div>
    </main>
  );
}
