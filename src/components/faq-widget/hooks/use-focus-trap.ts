import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Mantiene el foco del teclado dentro de `ref` mientras `active` sea true. */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    const container = ref.current;
    if (!active || !container) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      // El foco puede estar en un elemento no tabulable (p. ej. un encabezado
      // con tabIndex=-1): se busca el siguiente/anterior por orden del DOM.
      if (current && !focusable.includes(current as HTMLElement)) {
        const target = event.shiftKey
          ? focusable.findLast(
              (el) =>
                el.compareDocumentPosition(current) &
                Node.DOCUMENT_POSITION_FOLLOWING,
            )
          : focusable.find(
              (el) =>
                current.compareDocumentPosition(el) &
                Node.DOCUMENT_POSITION_FOLLOWING,
            );
        event.preventDefault();
        (target ?? (event.shiftKey ? last : first)).focus();
      } else if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [ref, active]);
}
