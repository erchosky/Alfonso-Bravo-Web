import { useFAQWidget } from "../FAQWidgetContext";
import { instanceKey, useFAQQuery } from "./use-faq-query";

/** Prefijo común: proveedor y contexto forman parte de cada consulta. */
function useScope() {
  const { provider, context } = useFAQWidget();
  return {
    provider,
    options: { context },
    scope: `${instanceKey(provider)}:${context ?? ""}`,
  };
}

export function useFAQCategories() {
  const { provider, options, scope } = useScope();
  return useFAQQuery(`categories:${scope}`, () =>
    provider.getCategories(options),
  );
}

export function useFAQCategoryWithQuestions(categoryId: string) {
  const { provider, options, scope } = useScope();
  return useFAQQuery(`category:${categoryId}:${scope}`, async () => {
    const [categories, questions] = await Promise.all([
      provider.getCategories(options),
      provider.getQuestions(categoryId, options),
    ]);
    const category = categories.find((c) => c.id === categoryId) ?? null;
    return { category, questions };
  });
}

/** Pregunta principal y su categoría. La categoría es opcional: si falla, no bloquea. */
export function useFAQQuestion(questionId: string) {
  const { provider, options, scope } = useScope();
  return useFAQQuery(`question:${questionId}:${scope}`, async () => {
    const [question, categories] = await Promise.all([
      provider.getQuestion(questionId, options),
      provider.getCategories(options).catch(() => []),
    ]);
    return {
      question,
      category: categories.find((c) => c.id === question?.categoryId) ?? null,
    };
  });
}

/**
 * Preguntas relacionadas, cargadas aparte de la respuesta principal.
 * Las que fallan o ya no están disponibles se omiten.
 */
export function useFAQRelated(ids: readonly string[]) {
  const { provider, options, scope } = useScope();
  return useFAQQuery(`related:${ids.join(",")}:${scope}`, async () => {
    const results = await Promise.allSettled(
      ids.map((id) => provider.getQuestion(id, options)),
    );
    return results.flatMap((result) =>
      result.status === "fulfilled" && result.value ? [result.value] : [],
    );
  });
}

export function useFAQContact() {
  const { provider, scope } = useScope();
  return useFAQQuery(`contact:${scope}`, () => provider.getContact());
}
