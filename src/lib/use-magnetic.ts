import { useEffect, useRef } from "react";

/**
 * Subtle magnetic pull toward the cursor within `radius` px.
 * Skips on touch devices and prefers-reduced-motion.
 */
export function useMagnetic<T extends HTMLElement>(radius = 80, strength = 0.28) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia?.("(pointer: fine)").matches;
    if (reduce || !finePointer) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let targetX = 0;
    let targetY = 0;
    let active = false;

    const apply = () => {
      tx += (targetX - tx) * 0.18;
      ty += (targetY - ty) * 0.18;
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      if (Math.abs(targetX - tx) > 0.1 || Math.abs(targetY - ty) > 0.1 || active) {
        raf = requestAnimationFrame(apply);
      } else {
        el.style.transform = "";
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(rect.width, rect.height) / 2 + radius;
      if (dist > reach) {
        if (active) {
          active = false;
          targetX = 0;
          targetY = 0;
          if (!raf) raf = requestAnimationFrame(apply);
        }
        return;
      }
      active = true;
      targetX = dx * strength;
      targetY = dy * strength;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      active = false;
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [radius, strength]);

  return ref;
}
