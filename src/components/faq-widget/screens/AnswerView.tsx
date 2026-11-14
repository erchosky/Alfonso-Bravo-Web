"use client";

import Link from "next/link";
import { isExternalHref } from "@/lib/faq/contact-links";
import type { FAQLink } from "@/lib/faq/types";
import { useFAQWidget } from "../FAQWidgetContext";
import { useFAQQuestion, useFAQRelated } from "../hooks/use-faq-data";
import { CONTACT_PROMPT_KEY, ContactPrompt } from "../ui/ContactPrompt";
import { ButtonList, ListButton } from "../ui/ListButton";
import { QueryView } from "../ui/QueryView";
import { RichText } from "../ui/RichText";
import { IconLabel, ScreenHeader } from "../ui/ScreenHeader";

interface AnswerViewProps {
  questionId: string;
  restoreFocusKey?: string;
  onSelectQuestion: (questionId: string) => void;
  onContact: () => void;
}

/** Respuesta a una pregunta, con enlaces y preguntas relacionadas. */
export function AnswerView({
  questionId,
  restoreFocusKey,
  onSelectQuestion,
  onContact,
}: AnswerViewProps) {
  const { texts } = useFAQWidget();
  const state = useFAQQuestion(questionId);

  return (
    <QueryView state={state}>
      {({ question, category }) =>
        question ? (
          <article className="flex flex-1 flex-col gap-4">
            <ScreenHeader
              size="lg"
              eyebrow={
                category && (
                  <IconLabel icon={category.icon} label={category.label} />
                )
              }
              title={question.question}
            />

            <RichText text={question.answer.text} />

            {question.answer.links && question.answer.links.length > 0 && (
              <AnswerLinks links={question.answer.links} />
            )}

            {question.relatedIds && question.relatedIds.length > 0 && (
              <RelatedQuestions
                ids={question.relatedIds}
                restoreFocusKey={restoreFocusKey}
                onSelectQuestion={onSelectQuestion}
              />
            )}

            {question.answer.showContact && (
              <ContactPrompt
                onContact={onContact}
                autoFocus={restoreFocusKey === CONTACT_PROMPT_KEY}
              />
            )}
          </article>
        ) : (
          <div className="flex flex-1 flex-col gap-4">
            <ScreenHeader title={texts.answer.notFound} />
            <ContactPrompt onContact={onContact} />
          </div>
        )
      }
    </QueryView>
  );
}

/**
 * Se carga aparte: la respuesta principal no espera por ella y,
 * si falla, simplemente no se muestra.
 */
function RelatedQuestions({
  ids,
  restoreFocusKey,
  onSelectQuestion,
}: {
  ids: string[];
  restoreFocusKey?: string;
  onSelectQuestion: (questionId: string) => void;
}) {
  const { texts } = useFAQWidget();
  const state = useFAQRelated(ids);

  if (state.status !== "success" || state.data.length === 0) return null;

  return (
    <section className="flex flex-col gap-2 pt-2">
      <h3 className="text-xs tracking-wide text-(--faq-muted)">
        {texts.answer.related}
      </h3>
      <ButtonList>
        {state.data.map((item) => (
          <li key={item.id}>
            <ListButton
              autoFocus={restoreFocusKey === item.id}
              onClick={() => onSelectQuestion(item.id)}
            >
              {item.question}
            </ListButton>
          </li>
        ))}
      </ButtonList>
    </section>
  );
}

function AnswerLinks({ links }: { links: FAQLink[] }) {
  const { closePanel } = useFAQWidget();
  const className =
    "inline-flex min-h-10 items-center rounded-full border border-(--faq-primary)/40 px-3.5 text-sm text-(--faq-primary) transition-colors hover:bg-(--faq-primary)/10";

  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((link, index) => (
        <li key={`${index}-${link.href}`}>
          {isExternalHref(link.href) ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {link.label}
            </a>
          ) : (
            // Al ir a otra página de la web se cierra el panel para dejarla ver.
            <Link href={link.href} onClick={closePanel} className={className}>
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
