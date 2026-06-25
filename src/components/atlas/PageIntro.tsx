import type { ReactNode } from "react";
import { useReveal } from "@/lib/use-reveal";

export function PageIntro({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 700ms cubic-bezier(0.2,0.7,0.2,1), transform 700ms cubic-bezier(0.2,0.7,0.2,1)",
      }}
      className="mx-auto max-w-3xl"
    >
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</p>
      )}
      <h1 className="mt-3 font-display text-4xl font-light leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {lede && <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{lede}</p>}
      {children}
    </div>
  );
}
