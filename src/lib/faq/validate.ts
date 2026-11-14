import { buildContactHref } from "./contact-links.ts";
import type {
  FAQCategory,
  FAQContactInfo,
  FAQQuestion,
  FAQUiTexts,
} from "./types";

export const PENDING_MARKER = "[PENDIENTE";

export interface FAQContent {
  categories: FAQCategory[];
  questions: FAQQuestion[];
  contact: FAQContactInfo;
}

/** Recorre un objeto de textos y devuelve cada cadena con su ruta. */
function collectStrings(value: unknown, path: string): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      collectStrings(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

/** Una pregunta solo se publica si está aprobada y no contiene marcas pendientes. */
export function isPublishable(question: FAQQuestion) {
  return (
    question.status === "published" &&
    !question.answer.text.includes(PENDING_MARKER) &&
    !question.question.includes(PENDING_MARKER)
  );
}

/** Detecta errores habituales al editar el contenido. Devuelve un aviso por problema. */
export function validateFAQContent(
  { categories, questions, contact }: FAQContent,
  /** Textos de la interfaz; si se pasan, también se revisan. */
  ui?: FAQUiTexts,
): string[] {
  const issues: string[] = [];

  // Textos que el visitante puede ver aunque no dependan de una pregunta.
  // Las preguntas tienen su propio estado de publicación (más abajo).
  // Los textos de `preview` solo se ven en desarrollo: se excluyen.
  const visibleUi = ui ? { ...ui, preview: undefined } : {};
  const visibleTexts = [
    ...categories
      .filter((c) => c.enabled)
      .flatMap((c) => collectStrings(c, `categoría "${c.id}"`)),
    ...collectStrings(
      { ...contact, channels: contact.channels.map((c) => c.label) },
      "contacto",
    ),
    ...collectStrings(visibleUi, "interfaz"),
  ];
  for (const [path, text] of visibleTexts) {
    if (text.includes(PENDING_MARKER)) {
      issues.push(`Texto visible con ${PENDING_MARKER} en ${path}`);
    }
  }
  const categoryIds = new Set<string>();
  const questionsById = new Map<string, FAQQuestion>();

  for (const category of categories) {
    if (categoryIds.has(category.id)) {
      issues.push(`Id de categoría duplicado: "${category.id}"`);
    }
    categoryIds.add(category.id);
  }

  for (const question of questions) {
    if (questionsById.has(question.id)) {
      issues.push(`Id de pregunta duplicado: "${question.id}"`);
    }
    questionsById.set(question.id, question);

    if (!categoryIds.has(question.categoryId)) {
      issues.push(
        `"${question.id}" usa una categoría inexistente: "${question.categoryId}"`,
      );
    }
    if (
      question.status === "published" &&
      (question.answer.text.includes(PENDING_MARKER) ||
        question.question.includes(PENDING_MARKER))
    ) {
      issues.push(
        `"${question.id}" está publicada pero contiene ${PENDING_MARKER}: no se mostrará`,
      );
    }
  }

  const orders = new Map<string, string>();
  for (const question of questions) {
    const slot = `${question.categoryId}#${question.order}`;
    const previous = orders.get(slot);
    if (previous) {
      issues.push(
        `"${question.id}" y "${previous}" comparten order ${question.order}: el orden no es fiable`,
      );
    }
    orders.set(slot, question.id);
  }

  for (const question of questions) {
    for (const relatedId of question.relatedIds ?? []) {
      const related = questionsById.get(relatedId);
      if (relatedId === question.id) {
        issues.push(`"${question.id}" se relaciona consigo misma`);
      } else if (!related) {
        issues.push(
          `"${question.id}" relaciona un id inexistente: "${relatedId}"`,
        );
      } else if (isPublishable(question) && !isPublishable(related)) {
        issues.push(
          `"${question.id}" está publicada pero relaciona "${relatedId}", que no lo está`,
        );
      }
    }
  }

  for (const channel of contact.channels) {
    if (channel.value !== null && buildContactHref(channel) === null) {
      issues.push(`Canal "${channel.type}" con formato no válido`);
    }
  }

  return issues;
}
