import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver-based reveal hook.
 * Once visible, stays visible. Respects prefers-reduced-motion (starts visible).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, visible]);

  return { ref, visible };
}

/**
 * Stagger helper — returns the inline style for a grid item so it
 * cascades in based on its index. Combine with `useReveal` on the item itself
 * OR on a shared parent — here we keep it per-item for simplicity.
 */
export function staggerStyle(visible: boolean, index: number, step = 50, base = 0) {
  const delay = visible ? base + index * step : 0;
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 650ms cubic-bezier(0.2,0.7,0.2,1) ${delay}ms, transform 650ms cubic-bezier(0.2,0.7,0.2,1) ${delay}ms`,
    willChange: visible ? undefined : ("opacity, transform" as const),
  };
}
