"use client";

import type { ReactNode } from "react";
import { useFAQWidget } from "./FAQWidgetContext";
import { BackIcon, CloseIcon, HomeIcon } from "./ui/icons";
import { FAQMascot } from "./ui/FAQMascot";

interface PanelHeaderProps {
  titleId: string;
  /** Profundidad del historial: decide qué botones de navegación se ven. */
  depth: number;
  onBack: () => void;
  onHome: () => void;
  onClose: () => void;
}

/** Cabecera del panel: volver, título, menú principal y cerrar. */
export function PanelHeader({
  titleId,
  depth,
  onBack,
  onHome,
  onClose,
}: PanelHeaderProps) {
  const { texts, mascotMode } = useFAQWidget();
  const canGoBack = depth > 1;
  const canGoHome = depth > 2;
  // Laterales del mismo ancho para que el título quede centrado.
  const sideWidth = canGoHome ? "w-[5.5rem]" : "w-11";

  return (
    <header className="flex shrink-0 items-center gap-1 border-b border-(--faq-border) px-1.5 py-1.5">
      <div className={`flex shrink-0 justify-start ${sideWidth}`}>
        {canGoBack && (
          <HeaderButton label={texts.panel.back} onClick={onBack}>
            <BackIcon />
          </HeaderButton>
        )}
      </div>

      <p
        id={titleId}
        className="faq-heading-font flex min-w-0 flex-1 items-center justify-center gap-2 text-sm tracking-wide text-(--faq-text)"
      >
        <span className="faq-panel-mascot"><FAQMascot mode={mascotMode} hidden={false} compact /></span>
        <span className="faq-panel-title-label truncate">{texts.panel.title}</span>
      </p>

      <div className={`flex shrink-0 justify-end ${sideWidth}`}>
        {canGoHome && (
          <HeaderButton label={texts.panel.home} onClick={onHome}>
            <HomeIcon />
          </HeaderButton>
        )}
        <HeaderButton label={texts.panel.close} onClick={onClose}>
          <CloseIcon />
        </HeaderButton>
      </div>
    </header>
  );
}

function HeaderButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-11 items-center justify-center rounded-full text-(--faq-muted) transition-colors hover:bg-(--faq-surface) hover:text-(--faq-text) active:bg-(--faq-surface)"
    >
      {children}
    </button>
  );
}
