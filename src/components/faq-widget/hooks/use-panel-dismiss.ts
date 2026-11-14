import { useEffect, type RefObject } from "react";

interface PanelDismissOptions {
  open: boolean;
  /** En modo modal, Escape cierra siempre; en no modal, solo con el foco dentro. */
  modal: boolean;
  closeOnOutsideClick: boolean;
  /** Contenedor del widget: lo que queda fuera se considera "exterior". */
  rootRef: RefObject<HTMLElement | null>;
  /** `returnFocus: false` cuando el usuario ya ha llevado el foco a otro sitio. */
  onDismiss: (returnFocus: boolean) => void;
}

/** Cierra el panel con Escape o al pulsar fuera de él. */
export function usePanelDismiss({
  open,
  modal,
  closeOnOutsideClick,
  rootRef,
  onDismiss,
}: PanelDismissOptions) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (modal || rootRef.current?.contains(event.target as Node)) {
        onDismiss(true);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onDismiss(false);
    };

    document.addEventListener("keydown", onKeyDown);
    if (closeOnOutsideClick) {
      document.addEventListener("pointerdown", onPointerDown);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, modal, closeOnOutsideClick, rootRef, onDismiss]);
}
