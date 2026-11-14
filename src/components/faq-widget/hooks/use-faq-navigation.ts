import { useCallback, useState } from "react";
import {
  INITIAL_HISTORY,
  popScreen,
  pushScreen,
  type FAQScreen,
  type History,
} from "@/lib/faq/navigation";

export type { FAQScreen } from "@/lib/faq/navigation";

/**
 * Navegación interna del panel. Cuando cambia `resetKey` (p. ej. el contexto
 * de la página) vuelve al inicio para no dejar abierta una pregunta que ya
 * no corresponde.
 */
export function useFAQNavigation(resetKey: string) {
  const [state, setState] = useState<{ key: string; history: History }>({
    key: resetKey,
    history: INITIAL_HISTORY,
  });
  const history = state.key === resetKey ? state.history : INITIAL_HISTORY;

  const update = useCallback(
    (change: (history: History) => History) =>
      setState((prev) => ({
        key: resetKey,
        history: change(prev.key === resetKey ? prev.history : INITIAL_HISTORY),
      })),
    [resetKey],
  );

  const push = useCallback(
    (screen: FAQScreen, fromKey?: string) =>
      update((h) => pushScreen(h, screen, fromKey)),
    [update],
  );
  const back = useCallback(() => update(popScreen), [update]);
  const home = useCallback(() => update(() => INITIAL_HISTORY), [update]);

  const current = history[history.length - 1];

  return {
    screen: current.screen,
    restoreFocusKey: current.focusKey,
    depth: history.length,
    canGoBack: history.length > 1,
    push,
    back,
    home,
  };
}

export type FAQNavigation = ReturnType<typeof useFAQNavigation>;
