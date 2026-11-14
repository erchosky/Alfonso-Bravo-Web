/**
 * Historial de pantallas del panel, sin dependencias de React
 * para poder probarlo de forma aislada.
 */

export type FAQScreen =
  | { type: "home" }
  | { type: "category"; categoryId: string }
  | { type: "answer"; questionId: string }
  | { type: "contact" };

export interface HistoryEntry {
  screen: FAQScreen;
  /** Elemento desde el que se salió de esta pantalla, para devolverle el foco al volver. */
  focusKey?: string;
}

export type History = readonly HistoryEntry[];

export const INITIAL_HISTORY: History = [{ screen: { type: "home" } }];

export function pushScreen(
  history: History,
  screen: FAQScreen,
  fromKey?: string,
): History {
  const current = history[history.length - 1];
  return [...history.slice(0, -1), { ...current, focusKey: fromKey }, { screen }];
}

export function popScreen(history: History): History {
  return history.length > 1 ? history.slice(0, -1) : history;
}

export function screenKey(screen: FAQScreen) {
  switch (screen.type) {
    case "category":
      return `category:${screen.categoryId}`;
    case "answer":
      return `answer:${screen.questionId}`;
    default:
      return screen.type;
  }
}
