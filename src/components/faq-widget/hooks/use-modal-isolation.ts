import { useEffect, type RefObject } from "react";

/**
 * Aísla el widget mientras se comporta como diálogo modal:
 * - marca como `inert` todo lo que no es el widget (sin tocar su árbol);
 * - bloquea el desplazamiento del documento.
 * Al desactivarse restaura exactamente el estado anterior.
 */
export function useModalIsolation(
  rootRef: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!active || !root) return;

    const madeInert: Element[] = [];
    let node: Element = root;
    while (node.parentElement && node !== document.body) {
      for (const sibling of Array.from(node.parentElement.children)) {
        if (
          sibling !== node &&
          !sibling.hasAttribute("inert") &&
          !["SCRIPT", "STYLE", "LINK"].includes(sibling.tagName)
        ) {
          sibling.setAttribute("inert", "");
          madeInert.push(sibling);
        }
      }
      node = node.parentElement;
    }

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    return () => {
      madeInert.forEach((element) => element.removeAttribute("inert"));
      html.style.overflow = previousOverflow;
    };
  }, [rootRef, active]);
}
