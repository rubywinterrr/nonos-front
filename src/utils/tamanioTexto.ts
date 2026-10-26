export type TamanioTexto = "normal" | "grande" | "muy_grande";

// nombre con el que se guarda el tamaño elegido en el navegador
const CLAVE_TAMANIO = "nonos_tamanio_texto";

// lee el tamaño guardado; si no hay ninguno (o es un valor raro), usa "grande", el recomendado
export function leerTamanioGuardado(): TamanioTexto {
  const guardado = localStorage.getItem(CLAVE_TAMANIO);
  if (guardado === "normal" || guardado === "muy_grande") {
    return guardado;
  }
  return "grande";
}

// cambia el tamaño de letra de toda la app y lo guarda para la próxima vez
export function aplicarTamanioTexto(tamanio: TamanioTexto) {
  if (tamanio === "normal") {
    document.documentElement.style.fontSize = "15px";
  } else if (tamanio === "grande") {
    document.documentElement.style.fontSize = "16px";
  } else if (tamanio === "muy_grande") {
    document.documentElement.style.fontSize = "17px";
  }
  localStorage.setItem(CLAVE_TAMANIO, tamanio);
}