"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { useFocusOnMount } from "../hooks/use-focus-on-mount";
import { ChevronIcon } from "./icons";

interface ListButtonProps {
  onClick: () => void;
  icon?: string;
  /** Recupera el foco al volver a esta pantalla. */
  autoFocus?: boolean;
  children: ReactNode;
}

/** Opción de una lista (categoría o pregunta). */
export function ListButton({
  onClick,
  icon,
  autoFocus,
  children,
}: ListButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useFocusOnMount(ref, autoFocus);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="group flex min-h-11 w-full items-center gap-3 rounded-[calc(var(--faq-radius)*0.65)] border border-(--faq-border) bg-(--faq-surface) px-3.5 py-2.5 text-left text-sm leading-snug text-(--faq-text) transition-[background-color,border-color,transform] duration-150 hover:border-(--faq-primary)/40 hover:bg-(--faq-primary)/8 active:scale-[0.99] active:bg-(--faq-primary)/12"
    >
      {icon && (
        <span aria-hidden="true" className="w-5 shrink-0 text-center text-base">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1 break-words">{children}</span>
      <ChevronIcon className="size-4 shrink-0 text-(--faq-muted) transition-transform group-hover:translate-x-0.5 group-hover:text-(--faq-primary)" />
    </button>
  );
}

const NAVIGATION_KEYS = ["ArrowDown", "ArrowUp", "Home", "End"] as const;
type NavigationKey = (typeof NAVIGATION_KEYS)[number];

/** Lista de opciones navegable también con flechas, Inicio y Fin. */
export function ButtonList({ children }: { children: ReactNode }) {
  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (!NAVIGATION_KEYS.includes(event.key as NavigationKey)) return;

    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        ":scope > li > button",
      ),
    );
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;

    event.preventDefault();
    const last = buttons.length - 1;
    const next: Record<NavigationKey, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    buttons[next[event.key as NavigationKey]]?.focus();
  };

  return (
    <ul className="flex flex-col gap-2" onKeyDown={onKeyDown}>
      {children}
    </ul>
  );
}
