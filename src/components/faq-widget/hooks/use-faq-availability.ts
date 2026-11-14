import type { FAQProvider } from "@/lib/faq/provider";
import type { FAQContext } from "@/lib/faq/types";
import { instanceKey, useFAQQuery } from "./use-faq-query";

/**
 * Qué ofrece el widget en el contexto actual. Si no hay preguntas
 * publicables ni contacto, el widget no debe mostrarse.
 */
export function useFAQAvailability(provider: FAQProvider, context?: FAQContext) {
  const state = useFAQQuery(
    `availability:${instanceKey(provider)}:${context ?? ""}`,
    () => provider.getCategories({ context }),
  );
  const categories = state.status === "success" ? state.data : [];
  const hasContent = categories.some((c) => c.kind === "faq");
  const hasContact = categories.some((c) => c.kind === "contact");

  return { visible: hasContent || hasContact, hasContact };
}
