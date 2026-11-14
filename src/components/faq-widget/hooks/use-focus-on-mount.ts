import { useEffect, type RefObject } from "react";

/**
 * Un elemento que aparece tras una carga solo toma el foco si este sigue
 * "en espera": en el contenedor de la pantalla, en su encabezado o perdido.
 * Así nunca se roba el foco a algo que el usuario ya esté usando.
 */
function canClaimFocus(element: HTMLElement) {
  const screen = element.closest("[data-faq-screen]");
  const active = document.activeElement;
  return (
    !active ||
    active === document.body ||
    active === screen ||
    (active.hasAttribute("data-faq-heading") && !!screen?.contains(active))
  );
}

/** Enfoca el elemento al montarse si `active` es true y el foco está libre. */
export function useFocusOnMount(
  ref: RefObject<HTMLElement | null>,
  active: boolean | undefined,
) {
  useEffect(() => {
    const element = ref.current;
    if (active && element && canClaimFocus(element)) element.focus();
  }, [ref, active]);
}
