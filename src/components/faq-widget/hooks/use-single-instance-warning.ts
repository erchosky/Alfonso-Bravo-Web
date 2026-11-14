import { useEffect } from "react";

let mountedInstances = 0;

/** En desarrollo, avisa si se monta más de un widget a la vez. */
export function useSingleInstanceWarning() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    mountedInstances += 1;
    if (mountedInstances > 1) {
      console.warn(
        "[FAQ] Hay más de un <FAQWidget /> montado. Usa una sola instancia (layout raíz) y define el contexto por ruta.",
      );
    }
    return () => {
      mountedInstances -= 1;
    };
  }, []);
}
