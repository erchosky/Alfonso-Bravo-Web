"use client";

import { Component, type ReactNode } from "react";

/**
 * El widget está en el layout raíz: un fallo inesperado en él no debe
 * tumbar la página. Si algo falla, el widget desaparece y la web sigue.
 */
export class FAQErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[FAQ] El widget se ha desactivado por un error:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
