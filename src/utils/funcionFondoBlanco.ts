import { useEffect } from "react";
export function FondoBlanco() {
  useEffect(() => {
    document.body.style.setProperty("background-color", "#f7f9ff", "important");
    return () => {
      document.body.style.removeProperty("background-color");
    };
  }, []);
}
