"use client";

import type { FAQCategory } from "@/lib/faq/types";
import { useFAQWidget } from "../FAQWidgetContext";
import { useFAQCategories } from "../hooks/use-faq-data";
import { ButtonList, ListButton } from "../ui/ListButton";
import { QueryView } from "../ui/QueryView";
import { ScreenHeading } from "../ui/ScreenHeader";

interface CategoryListProps {
  onSelect: (category: FAQCategory) => void;
  restoreFocusKey?: string;
}

/** Pantalla inicial: saludo y menú de categorías. */
export function CategoryList({ onSelect, restoreFocusKey }: CategoryListProps) {
  const { texts } = useFAQWidget();
  const state = useFAQCategories();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <p className="faq-heading-font text-base text-(--faq-text)">
          {texts.welcome.title}
        </p>
        <p className="text-sm leading-relaxed text-(--faq-muted)">
          {texts.welcome.body}
        </p>
      </div>

      <ScreenHeading>{texts.welcome.prompt}</ScreenHeading>

      <QueryView state={state}>
        {(categories) => (
          <ButtonList>
            {categories.map((category) => (
              <li key={category.id}>
                <ListButton
                  icon={category.icon}
                  autoFocus={restoreFocusKey === category.id}
                  onClick={() => onSelect(category)}
                >
                  {category.label}
                </ListButton>
              </li>
            ))}
          </ButtonList>
        )}
      </QueryView>
    </div>
  );
}
