/**
 * Fly-to-cart: clone a product image and animate it on a soft arc
 * from a source element to the registered cart icon, then trigger
 * the existing cart-bump on landing.
 *
 * Skips entirely under prefers-reduced-motion or when no cart icon is registered.
 */

let cartIconEl: HTMLElement | null = null;

export function registerCartIcon(el: HTMLElement | null) {
  cartIconEl = el;
}

function reduced() {
  return (
    typeof window === "undefined" ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export function flyToCart(opts: { src: string; from: HTMLElement | DOMRect | null }) {
  if (reduced() || !cartIconEl) return;
  const startRect =
    !opts.from
      ? null
      : opts.from instanceof HTMLElement
        ? opts.from.getBoundingClientRect()
        : opts.from;
  if (!startRect) return;
  const endRect = cartIconEl.getBoundingClientRect();

  const startX = startRect.left + startRect.width / 2;
  const startY = startRect.top + startRect.height / 2;
  const endX = endRect.left + endRect.width / 2;
  const endY = endRect.top + endRect.height / 2;

  const size = 72;
  const img = document.createElement("img");
  img.src = opts.src;
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  img.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    `width:${size}px`,
    `height:${size}px`,
    "object-fit:cover",
    "border-radius:14px",
    "pointer-events:none",
    "z-index:80",
    "will-change:transform,opacity",
    "box-shadow:0 12px 30px -10px rgba(0,0,0,0.35)",
    `transform:translate3d(${startX - size / 2}px, ${startY - size / 2}px, 0) scale(1)`,
    "opacity:1",
    "transition:none",
  ].join(";");
  document.body.appendChild(img);

  // Mid-point for the arc — lift up by ~120px relative to the straight path.
  const midX = (startX + endX) / 2;
  const midY = Math.min(startY, endY) - 120;

  const duration = 560;
  const startTime = performance.now();

  const tick = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration);
    // ease-in-out cubic
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    // Quadratic Bezier from start→mid→end
    const x = (1 - e) * (1 - e) * startX + 2 * (1 - e) * e * midX + e * e * endX;
    const y = (1 - e) * (1 - e) * startY + 2 * (1 - e) * e * midY + e * e * endY;
    const scale = 1 - 0.65 * e;
    const opacity = e < 0.85 ? 1 : 1 - (e - 0.85) / 0.15;
    img.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0) scale(${scale})`;
    img.style.opacity = String(opacity);
    if (t < 1) requestAnimationFrame(tick);
    else {
      img.remove();
      // trigger the bump animation on the cart icon
      cartIconEl?.classList.remove("animate-cart-bump");
      // force reflow so the same class re-triggers
      void cartIconEl?.offsetWidth;
      cartIconEl?.classList.add("animate-cart-bump");
      setTimeout(() => cartIconEl?.classList.remove("animate-cart-bump"), 600);
    }
  };
  requestAnimationFrame(tick);
}
