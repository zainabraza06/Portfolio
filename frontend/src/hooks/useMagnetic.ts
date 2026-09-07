import { useEffect, useRef } from 'react';

/**
 * Pulls an element gently toward the cursor while it is nearby, then lets it
 * spring back. Pointer-precision only — touch and reduced-motion get nothing.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.28, radius = 90) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (distance < rect.width / 2 + radius) {
          el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
        } else {
          el.style.transform = '';
        }
      });
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      el.style.transform = '';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('blur', reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('blur', reset);
    };
  }, [strength, radius]);

  return ref;
}
