import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { PageIntro } from "@/components/atlas/PageIntro";
import { useReveal, staggerStyle } from "@/lib/use-reveal";
import { ARTICLES, type Article } from "@/lib/journal-articles";


export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — FlashTrends" },
      { name: "description", content: "Field notes on objects worth owning — interviews with makers, buying guides, and quiet essays from the FlashTrends team." },
      { property: "og:title", content: "Journal — FlashTrends" },
    ],
  }),
  component: Journal,
});

function Journal() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <PageIntro
          eyebrow="Journal"
          title="Field notes from the shop floor."
          lede="Interviews with makers, honest buying guides, and quiet essays from the FlashTrends team."
        />

        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a, i) => <ArticleCard key={a.slug} article={a} index={i} />)}
        </div>
      </div>
    </Shell>
  );
}

function ArticleCard({ article: a, index = 0 }: { article: Article; index?: number }) {
  const { ref, visible } = useReveal<HTMLElement>();
  return (
    <article
      ref={ref}
      style={staggerStyle(visible, index)}
      className="group"
    >

      <Link to="/journal/$slug" params={{ slug: a.slug }} className="block">
        <div className="overflow-hidden rounded-2xl bg-secondary">
          <img src={a.image} alt={a.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[color:var(--clay)]">{a.cat}</p>
        <h2 className="mt-2 font-display text-xl leading-snug text-foreground transition-colors group-hover:text-[color:var(--clay)] sm:text-2xl">{a.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
        <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{a.date}</p>
      </Link>
    </article>
  );
}
