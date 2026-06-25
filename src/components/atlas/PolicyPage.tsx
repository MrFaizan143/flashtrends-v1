import type { ReactNode } from "react";
import { Shell } from "./Shell";
import { PageIntro } from "./PageIntro";

export type PolicySection = { heading: string; body: ReactNode };

export function PolicyPage({
  eyebrow = "Legal",
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow?: string;
  title: string;
  updated: string;
  intro?: string;
  sections: PolicySection[];
}) {
  return (
    <Shell>
      <div className="mx-auto max-w-[900px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <PageIntro eyebrow={eyebrow} title={title} lede={intro} />
        <p className="mx-auto mt-4 max-w-3xl text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Last updated · {updated}
        </p>
        <div className="mx-auto mt-12 max-w-3xl space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl text-foreground">{s.heading}</h2>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Shell>
  );
}
