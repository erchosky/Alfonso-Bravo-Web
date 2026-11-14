import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function read(key: string) {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return true; // Sin acceso a localStorage: no insistimos con el indicador.
  }
}

/**
 * Recuerda si el usuario ya abrió el widget alguna vez.
 * Es el único dato que se guarda y no contiene información personal.
 */
export function useSeenFlag(key: string) {
  const seen = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => true,
  );

  const markSeen = useCallback(() => {
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      // Ignorado: modo privado o almacenamiento bloqueado.
    }
    listeners.forEach((listener) => listener());
  }, [key]);

  return [seen, markSeen] as const;
}
