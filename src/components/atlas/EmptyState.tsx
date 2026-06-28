import type { ReactNode } from "react";

type IconKey = "bag" | "heart" | "search" | "compass";

/**
 * Line-art SVG set. Thin stroke, currentColor. Sized at 56px, drawn on a 64-grid.
 * Sits in front of a faint glowing dot using the reserved --spark accent.
 */
function Icon({ name }: { name: IconKey }) {
  const common = {
    width: 56,
    height: 56,
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "bag":
      return (
        <svg {...common}>
          <path d="M16 22h32l-2 30a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4l-2-30Z" />
          <path d="M24 22v-4a8 8 0 0 1 16 0v4" />
          <path d="M26 32c.6 2.4 2.9 4 6 4s5.4-1.6 6-4" opacity={0.55} />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M32 52s-16-9.6-16-22a9 9 0 0 1 16-5.7A9 9 0 0 1 48 30c0 12.4-16 22-16 22Z" />
          <path d="M22 28a6 6 0 0 1 5-5" opacity={0.55} />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="28" cy="28" r="14" />
          <path d="M38.5 38.5 50 50" />
          <path d="M22 24a7 7 0 0 1 6-4" opacity={0.55} />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="22" />
          <path d="m38 26-9 3-3 9 9-3 3-9Z" />
          <circle cx="32" cy="32" r="1.4" fill="currentColor" />
          <path d="M32 6v4M32 54v4M6 32h4M54 32h4" opacity={0.55} />
        </svg>
      );
  }
}

export function EmptyState({
  icon,
  eyebrow,
  title,
  description,
  action,
  className = "",
  compact = false,
}: {
  icon: IconKey;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  /** Tight version for inside drawers/sheets */
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "px-6 py-10" : "rounded-3xl border border-dashed border-border bg-secondary/30 px-6 py-20"
      } ${className}`}
    >
      {/* Icon with reserved spark glow */}
      <div className="relative grid h-24 w-24 place-items-center">
        <span
          aria-hidden
          className="absolute inset-0 m-auto h-16 w-16 rounded-full blur-2xl opacity-70"
          style={{ background: "radial-gradient(closest-side, var(--spark), transparent 70%)" }}
        />
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "var(--spark)", boxShadow: "0 0 14px 2px color-mix(in oklab, var(--spark) 60%, transparent)" }}
        />
        <span className="relative text-foreground/80">
          <Icon name={icon} />
        </span>
      </div>

      {eyebrow && (
        <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</p>
      )}
      <h2 className={`mt-3 font-display font-light text-foreground ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
