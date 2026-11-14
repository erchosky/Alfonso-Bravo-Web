"use client";

import type { FAQScreen } from "@/lib/faq/navigation";
import type { FAQCategory } from "@/lib/faq/types";
import type { FAQNavigation } from "../hooks/use-faq-navigation";
import { CONTACT_PROMPT_KEY } from "../ui/ContactPrompt";
import { AnswerView } from "./AnswerView";
import { CategoryList } from "./CategoryList";
import { ContactView } from "./ContactView";
import { QuestionList } from "./QuestionList";

interface CurrentScreenProps {
  screen: FAQScreen;
  restoreFocusKey?: string;
  push: FAQNavigation["push"];
}

/** Elige la pantalla según el historial y le conecta la navegación. */
export function CurrentScreen({
  screen,
  restoreFocusKey,
  push,
}: CurrentScreenProps) {
  const openQuestion = (questionId: string) =>
    push({ type: "answer", questionId }, questionId);
  const openContact = () => push({ type: "contact" }, CONTACT_PROMPT_KEY);
  const openCategory = (category: FAQCategory) =>
    push(
      category.kind === "contact"
        ? { type: "contact" }
        : { type: "category", categoryId: category.id },
      category.id,
    );

  switch (screen.type) {
    case "home":
      return (
        <CategoryList
          onSelect={openCategory}
          restoreFocusKey={restoreFocusKey}
        />
      );
    case "category":
      return (
        <QuestionList
          categoryId={screen.categoryId}
          restoreFocusKey={restoreFocusKey}
          onSelectQuestion={openQuestion}
          onContact={openContact}
        />
      );
    case "answer":
      return (
        <AnswerView
          questionId={screen.questionId}
          restoreFocusKey={restoreFocusKey}
          onSelectQuestion={openQuestion}
          onContact={openContact}
        />
      );
    case "contact":
      return <ContactView />;
  }
}
