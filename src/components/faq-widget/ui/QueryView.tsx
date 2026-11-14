"use client";

import { useEffect, useState, type ReactNode } from "react";
import { faqMascotConfig } from "@/config/faq-mascot.config";
import { useFAQWidget } from "../FAQWidgetContext";
import type { QueryState } from "../hooks/use-faq-query";

/** Pinta los estados de carga y error comunes a todas las pantallas. */
export function QueryView<T>({
  state,
  children,
}: {
  state: QueryState<T>;
  children: (data: T) => ReactNode;
}) {
  const { texts, setMascotActivity } = useFAQWidget();

  useEffect(() => {
    const timer = setTimeout(
      () => setMascotActivity(state.status === "success" ? "ready" : state.status),
      state.status === "loading" ? faqMascotConfig.loadingDelay : 0,
    );
    return () => clearTimeout(timer);
  }, [state.status, setMascotActivity]);

  if (state.status === "loading") return <LoadingSkeleton />;
  if (state.status === "error") {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 py-8">
        <p className="text-center text-sm text-(--faq-muted)">
          {texts.states.error}
        </p>
        <button
          type="button"
          onClick={state.retry}
          className="min-h-11 rounded-full border border-(--faq-border) px-4 text-sm text-(--faq-text) transition-colors hover:border-(--faq-primary)/50"
        >
          {texts.states.retry}
        </button>
      </div>
    );
  }
  return <>{children(state.data)}</>;
}

/**
 * Esqueleto de carga. Aparece solo si la carga tarda, para evitar
 * parpadeos con datos locales.
 */
function LoadingSkeleton() {
  const { texts } = useFAQWidget();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div role="status" className="flex flex-col gap-2">
      <span className="sr-only">{texts.states.loading}</span>
      {visible &&
        [0, 1, 2].map((i) => (
          <div
            key={i}
            aria-hidden="true"
            className="h-11 animate-pulse rounded-[calc(var(--faq-radius)*0.65)] bg-(--faq-surface)"
          />
        ))}
    </div>
  );
}
