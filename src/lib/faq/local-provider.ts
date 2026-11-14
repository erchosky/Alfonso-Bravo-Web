import { buildContactHref } from "./contact-links.ts";
import type { FAQProvider } from "./provider";
import type {
  FAQCategory,
  FAQContactInfo,
  FAQContext,
  FAQQueryOptions,
  FAQQuestion,
} from "./types";
import { isPublishable, validateFAQContent, type FAQContent } from "./validate.ts";

export interface LocalFAQProviderOptions {
  /**
   * Vista previa: muestra borradores y canales de contacto sin dato.
   * Activada en desarrollo; nunca debe llegar a los visitantes.
   */
  preview?: boolean;
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/** Una pregunta sin `contexts` aplica en todas partes. */
function appliesTo(question: FAQQuestion, context?: FAQContext) {
  if (!question.contexts?.length || !context) return true;
  return question.contexts.includes(context);
}

/** Las preguntas específicas del contexto actual van primero. */
function contextRank(question: FAQQuestion, context?: FAQContext) {
  return context && question.contexts?.includes(context) ? 0 : 1;
}

/** Lee el contenido desde archivos locales. Sin red ni base de datos. */
export class LocalFAQProvider implements FAQProvider {
  private readonly data: FAQContent;
  private readonly preview: boolean;

  constructor(data: FAQContent, options: LocalFAQProviderOptions = {}) {
    this.data = data;
    this.preview = options.preview ?? false;
    if (process.env.NODE_ENV === "development") {
      for (const issue of validateFAQContent(data)) {
        console.warn(`[FAQ] ${issue}`);
      }
    }
  }

  async getCategories(options?: FAQQueryOptions): Promise<FAQCategory[]> {
    const questions = this.visibleQuestions(options?.context);
    const hasContact = (await this.getContact()).channels.length > 0;

    return this.data.categories
      .filter((category) => {
        if (!category.enabled) return false;
        if (category.kind === "contact") return hasContact;
        return questions.some((q) => q.categoryId === category.id);
      })
      .sort(byOrder);
  }

  async getQuestions(
    categoryId: string,
    options?: FAQQueryOptions,
  ): Promise<FAQQuestion[]> {
    const context = options?.context;
    return this.visibleQuestions(context)
      .filter((q) => q.categoryId === categoryId)
      .sort(
        (a, b) =>
          contextRank(a, context) - contextRank(b, context) || byOrder(a, b),
      );
  }

  async getQuestion(
    id: string,
    options?: FAQQueryOptions,
  ): Promise<FAQQuestion | null> {
    return (
      this.visibleQuestions(options?.context).find((q) => q.id === id) ?? null
    );
  }

  async getContact(): Promise<FAQContactInfo> {
    const channels = this.data.contact.channels
      .filter((channel) => this.preview || buildContactHref(channel) !== null)
      .sort(byOrder);
    return { ...this.data.contact, channels };
  }

  private visibleQuestions(context?: FAQContext) {
    const enabledCategories = new Set(
      this.data.categories
        .filter((c) => c.enabled && c.kind === "faq")
        .map((c) => c.id),
    );
    return this.data.questions.filter(
      (q) =>
        q.enabled &&
        (this.preview || isPublishable(q)) &&
        enabledCategories.has(q.categoryId) &&
        appliesTo(q, context),
    );
  }
}
