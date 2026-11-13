import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const ID_CONTENIDO = "contenido-principal";

// Las transiciones de React Router no anuncian una página nueva como lo hace el navegador.
export function NavegacionAccesible() {
  const { pathname } = useLocation();
  const rutaAnterior = useRef<string | null>(null);

  useLayoutEffect(() => {
    const main = document.getElementById(ID_CONTENIDO);
    if (!main) return;

    const anterior = rutaAnterior.current;
    rutaAnterior.current = pathname;
    const titulo = main.querySelector("h1");
    const nombre = pathname.endsWith("/home") ? "Inicio" : titulo?.textContent?.trim();
    document.title = nombre ? `${nombre} | NONOS` : "NONOS";

    if (anterior !== null && anterior !== pathname) {
      window.scrollTo(0, 0);
      const destino = titulo ?? main;
      destino.tabIndex = -1;
      destino.focus({ preventScroll: true });
    }
  }, [pathname]);

  return (
    <a
      href={`#${ID_CONTENIDO}`}
      className="saltar-contenido"
      onClick={(evento) => {
        const main = document.getElementById(ID_CONTENIDO);
        if (!main) return;
        evento.preventDefault();
        main.focus();
        window.scrollTo(0, 0);
      }}
    >
      Saltar al contenido principal
    </a>
  );
}
