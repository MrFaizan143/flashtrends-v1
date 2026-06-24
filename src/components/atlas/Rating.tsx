import { Star } from "lucide-react";

export function Rating({ value, size = 14, className = "" }: { value: number; size?: number; className?: string }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            width={size} height={size}
            className={filled ? "fill-[color:var(--clay)] text-[color:var(--clay)]" : "fill-transparent text-muted-foreground/40"}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}
