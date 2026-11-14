/** Expresiones y ritmo del personaje, separados de los textos y de las preguntas. */
export type MascotPose = "neutral" | "blink" | "left" | "right" | "hello" | "thoughtful";
export type MascotActivity = "loading" | "error" | "ready";
export type MascotMode = "idle" | "engaged" | "active" | "contact" | "loading" | "error";
export interface MascotBeat { pose: MascotPose; duration: number }
interface MascotSequence {
  /** Solo se reproduce una vez al entrar en este modo. */
  intro: readonly MascotBeat[];
  loop: readonly MascotBeat[];
}

const resting: readonly MascotBeat[] = [
  { pose: "neutral", duration: 4500 },
  { pose: "blink", duration: 130 },
  { pose: "neutral", duration: 6200 },
  { pose: "blink", duration: 130 },
];

export const faqMascotConfig = {
  image: "/images/faq-familiar-top-hat.png",
  /** Una consulta local rápida no debe aparentar que el personaje está pensando. */
  loadingDelay: 200,
  sequences: {
    idle: { intro: [], loop: resting },
    engaged: { intro: [{ pose: "hello", duration: 700 }], loop: resting },
    active: { intro: [], loop: resting },
    contact: { intro: [{ pose: "hello", duration: 700 }], loop: resting },
    loading: { intro: [], loop: [{ pose: "thoughtful", duration: 1800 }] },
    error: { intro: [], loop: [{ pose: "thoughtful", duration: 1800 }] },
  } satisfies Record<MascotMode, MascotSequence>,
};
