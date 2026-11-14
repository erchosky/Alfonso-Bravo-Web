"use client";

import Image from "next/image";
import { faqMascotConfig, type MascotMode } from "@/config/faq-mascot.config";
import { useMascotAnimation } from "../hooks/use-mascot-animation";
import "./faq-mascot.css";

interface FAQMascotProps {
  mode: MascotMode;
  hidden: boolean;
  compact?: boolean;
}

/** Seis expresiones del mismo personaje; el botón conserva el nombre accesible. */
export function FAQMascot({ mode, hidden, compact = false }: FAQMascotProps) {
  const { pose, paused } = useMascotAnimation(mode, hidden);
  return (
    <span
      className="faq-mascot"
      data-pose={pose}
      data-mode={mode}
      data-paused={paused}
      aria-hidden="true"
    >
      <span className="faq-mascot-shadow" />
      <span className="faq-mascot-body">
        <span className="faq-mascot-viewport">
          <Image
            src={faqMascotConfig.image}
            alt=""
            width={1536}
            height={1024}
            sizes={compact ? "96px" : "(max-width: 639px) 264px, 312px"}
            loading="eager"
            draggable={false}
            className="faq-mascot-atlas"
          />
        </span>
      </span>
      <span className="faq-mascot-dots"><i /><i /><i /></span>
    </span>
  );
}
