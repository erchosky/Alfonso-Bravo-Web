import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  faqMascotConfig,
  type MascotMode,
  type MascotPose,
} from "@/config/faq-mascot.config";
import { useMediaQuery } from "./use-media-query";

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
const readHidden = () => document.hidden;
const serverHidden = () => true;

/** El saludo es puntual; solo el reposo se repite. Se pausa fuera de pantalla. */
export function useMascotAnimation(mode: MascotMode, hidden: boolean) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const pageHidden = useSyncExternalStore(subscribeVisibility, readHidden, serverHidden);
  const paused = hidden || pageHidden || reducedMotion;
  const playback = useRef({ mode, index: 0 });
  const [beat, setBeat] = useState<{ mode: MascotMode; pose: MascotPose }>({
    mode: "idle", pose: "neutral",
  });

  useEffect(() => {
    if (paused) return;
    if (playback.current.mode !== mode) playback.current = { mode, index: 0 };
    const sequence = faqMascotConfig.sequences[mode];
    const frames = [...sequence.intro, ...sequence.loop];
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const next = frames[playback.current.index];
      setBeat({ mode, pose: next.pose });
      playback.current.index++;
      if (playback.current.index >= frames.length) {
        playback.current.index = sequence.intro.length;
      }
      // Una expresión sostenida no necesita actualizaciones ni temporizadores.
      if (frames.length > 1) timer = setTimeout(tick, next.duration);
    };
    timer = setTimeout(tick, 0);
    return () => clearTimeout(timer);
  }, [mode, paused]);

  return {
    pose: paused || beat.mode !== mode ? "neutral" : beat.pose,
    paused,
  };
}
