import { useEffect } from "react";
export function FondoBlanco() {
  useEffect(() => {
    document.body.style.setProperty("background-color", "#FFFFFF", "important");
    return () => {
      document.body.style.removeProperty("background-color");
    };
  }, []);
}
