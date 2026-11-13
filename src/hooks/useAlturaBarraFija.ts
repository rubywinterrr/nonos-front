import { useLayoutEffect, type RefObject } from "react";

export function useAlturaBarraFija(
  ref: RefObject<HTMLElement | null>,
  variable: "--alto-cabecera" | "--alto-navegacion",
) {
  useLayoutEffect(() => {
    const barra = ref.current;
    if (!barra) return;
    const raiz = document.documentElement;
    const medir = () => {
      const { top, bottom, height } = barra.getBoundingClientRect();
      // La barra inferior flota sobre el borde: reservar también esa separación.
      const alto = variable === "--alto-cabecera"
        ? bottom
        : height + Math.max(0, window.innerHeight - top - height);
      raiz.style.setProperty(variable, `${alto}px`);
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(barra);
    window.addEventListener("resize", medir);
    return () => {
      observador.disconnect();
      window.removeEventListener("resize", medir);
      raiz.style.removeProperty(variable);
    };
  }, [ref, variable]);
}
