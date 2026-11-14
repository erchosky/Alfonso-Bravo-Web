"use client";

import { buildContactHref } from "@/lib/faq/contact-links";
import { useFAQWidget } from "../FAQWidgetContext";
import { useFAQContact } from "../hooks/use-faq-data";
import { ContactCTA } from "../ui/ContactCTA";
import { QueryView } from "../ui/QueryView";
import { ScreenHeader } from "../ui/ScreenHeader";

/** Pantalla de contacto dentro del panel. */
export function ContactView() {
  const { texts, preview } = useFAQWidget();
  const state = useFAQContact();

  return (
    <QueryView state={state}>
      {(info) => (
        <div className="flex flex-col gap-4">
          <ScreenHeader title={info.title} description={info.description} />
          <ContactCTA
            info={info}
            showPlaceholders={preview}
            placeholderLabel={texts.preview.missingChannel}
          />
          {preview && !info.channels.some((c) => buildContactHref(c)) && (
            <p className="text-sm">
              <mark className="faq-pending">{texts.preview.noContact}</mark>
            </p>
          )}
        </div>
      )}
    </QueryView>
  );
}
