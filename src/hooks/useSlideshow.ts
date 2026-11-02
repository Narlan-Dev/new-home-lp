import { useCallback, useEffect, useEffectEvent, useState } from 'react';

// ===============================|| HOOKS - SLIDESHOW ||=============================== //

export default function useSlideshow(count: number, intervalMs: number) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((current) => (current + 1) % count), [count]);
  const prev = useCallback(() => setIndex((current) => (current - 1 + count) % count), [count]);

  // evento do efeito: lê sempre o `next` mais recente sem reiniciar o temporizador
  const advance = useEffectEvent(() => next());

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reducedMotion || count < 2) return;

    // `index` reinicia a contagem quando a pessoa navega manualmente
    const timer = window.setInterval(advance, intervalMs);
    return () => window.clearInterval(timer);
  }, [paused, count, intervalMs, index]);

  return { index, next, prev, goTo: setIndex, setPaused };
}
