"use client";

import { useState, type Ref } from "react";
import type { MascotMode } from "@/config/faq-mascot.config";
import type { FAQWidgetPosition } from "@/config/faq-widget.config";
import { CloseIcon } from "./ui/icons";
import { FAQMascot } from "./ui/FAQMascot";

interface FloatingButtonProps {
  ref?: Ref<HTMLButtonElement>;
  open: boolean;
  /** Oculto mientras la hoja modal ocupa la pantalla (tiene su propio cierre). */
  hidden: boolean;
  mode: MascotMode;
  label: string;
  closeLabel: string;
  controlsId: string;
  position: FAQWidgetPosition;
  /** Punto discreto para quien aún no ha abierto el widget. */
  showIndicator: boolean;
  onClick: () => void;
}

const POSITION_CLASSES: Record<FAQWidgetPosition, string> = {
  "bottom-right": "right-4 sm:right-6",
  "bottom-left": "left-4 sm:left-6",
};

export function FloatingButton({
  ref,
  open,
  hidden,
  mode,
  label,
  closeLabel,
  controlsId,
  position,
  showIndicator,
  onClick,
}: FloatingButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const displayMode = open ? mode : hovered || focused ? "engaged" : "idle";

  return (
    <button
      ref={ref}
      type="button"
      hidden={hidden}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-expanded={open}
      aria-controls={open ? controlsId : undefined}
      aria-haspopup="dialog"
      aria-label={open ? closeLabel : label}
      data-position={position}
      data-open={open}
      className={["faq-mascot-launcher", POSITION_CLASSES[position]].join(" ")}
    >
      <FAQMascot mode={displayMode} hidden={hidden} />
      <span className="faq-mascot-tooltip" aria-hidden="true">
        {open ? closeLabel : label}
      </span>
      {open && (
        <span className="faq-mascot-close" aria-hidden="true">
          <CloseIcon className="size-3.5" />
        </span>
      )}
      {showIndicator && !open && (
        <span
          aria-hidden="true"
          className="faq-mascot-glint"
        />
      )}
    </button>
  );
}
