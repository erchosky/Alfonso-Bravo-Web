"use client";

import { useFAQWidget } from "../FAQWidgetContext";
import { useFAQCategoryWithQuestions } from "../hooks/use-faq-data";
import { CONTACT_PROMPT_KEY, ContactPrompt } from "../ui/ContactPrompt";
import { ButtonList, ListButton } from "../ui/ListButton";
import { QueryView } from "../ui/QueryView";
import { IconLabel, ScreenHeader } from "../ui/ScreenHeader";

interface QuestionListProps {
  categoryId: string;
  restoreFocusKey?: string;
  onSelectQuestion: (questionId: string) => void;
  onContact: () => void;
}

/** Preguntas de una categoría. */
export function QuestionList({
  categoryId,
  restoreFocusKey,
  onSelectQuestion,
  onContact,
}: QuestionListProps) {
  const { texts } = useFAQWidget();
  const state = useFAQCategoryWithQuestions(categoryId);

  return (
    <QueryView state={state}>
      {({ category, questions }) => (
        <div className="flex flex-1 flex-col gap-4">
          <ScreenHeader
            title={
              category ? (
                <IconLabel icon={category.icon} label={category.label} />
              ) : (
                texts.panel.title
              )
            }
            description={category?.description}
          />

          {questions.length > 0 ? (
            <ButtonList>
              {questions.map((question) => (
                <li key={question.id}>
                  <ListButton
                    autoFocus={restoreFocusKey === question.id}
                    onClick={() => onSelectQuestion(question.id)}
                  >
                    {question.question}
                  </ListButton>
                </li>
              ))}
            </ButtonList>
          ) : (
            <p className="text-sm text-(--faq-muted)">
              {texts.states.emptyCategory}
            </p>
          )}

          <ContactPrompt
            onContact={onContact}
            autoFocus={restoreFocusKey === CONTACT_PROMPT_KEY}
          />
        </div>
      )}
    </QueryView>
  );
}
