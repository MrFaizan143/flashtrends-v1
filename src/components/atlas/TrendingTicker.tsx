import { Flame } from "lucide-react";

const TRENDS = [
  "Linen",
  "Quiet luxury",
  "Studio lighting",
  "Cashmere",
  "Minimal tech",
  "Terracotta home",
  "Heirloom denim",
  "Clean skincare",
  "Stoneware",
  "Sculptural lamps",
  "Wide-leg tailoring",
  "Field jackets",
];

/**
 * Signature element: a slow, seamless trending strip.
 * Uses the reserved --spark accent (nowhere else in the UI).
 */
export function TrendingTicker({ className = "" }: { className?: string }) {
  const loop = [...TRENDS, ...TRENDS];
  return (
    <div
      className={`relative border-b border-border bg-foreground text-background ${className}`}
      role="region"
      aria-label="Trending now"
    >
      {/* edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-foreground to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-foreground to-transparent" aria-hidden />

      <div className="flex items-center gap-3 overflow-hidden py-2.5">
        <span className="z-20 ml-4 inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--spark)] sm:ml-6">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--spark)] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--spark)]" />
          </span>
          <Flame size={11} strokeWidth={2.4} />
          Trending now
        </span>
        <div className="flex w-full overflow-hidden">
          <ul className="flex shrink-0 animate-marquee items-center gap-8 whitespace-nowrap pr-8 text-[11px] uppercase tracking-[0.18em] text-background/85 will-change-transform">
            {loop.map((t, i) => (
              <li key={`${t}-${i}`} className="flex items-center gap-8">
                <span>{t}</span>
                <span aria-hidden className="text-background/30">/</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
