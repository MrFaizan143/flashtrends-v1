import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { findArticle, relatedArticles, type Article } from "@/lib/journal-articles";
import { useReveal } from "@/lib/use-reveal";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/journal/$slug")({
  head: ({ params }) => {
    const a = findArticle(params.slug);
    return {
      meta: [
        { title: a ? `${a.title} — FlashTrends Journal` : "Journal — FlashTrends" },
        { name: "description", content: a?.excerpt ?? "Field notes from FlashTrends." },
        { property: "og:title", content: a?.title ?? "FlashTrends Journal" },
        { property: "og:description", content: a?.excerpt ?? "" },
        { property: "og:image", content: a?.image ?? "" },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const article = findArticle(slug);
  const { ref, visible } = useReveal<HTMLDivElement>();
  if (!article) {
    throw notFound();
  }
  const a: Article = article;
  const related = relatedArticles(a.slug, 3);

  return (
    <Shell>
      <article className="bg-background">
        <div className="mx-auto max-w-[1100px] px-4 pt-10 sm:px-6 lg:px-10">
          <Link to="/journal" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft size={12} /> Back to Journal
          </Link>
        </div>

        <header className="mx-auto mt-8 max-w-[820px] px-4 text-center sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--clay)]">{article.cat}</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-[1.05] text-balance sm:text-5xl lg:text-6xl">{article.title}</h1>
          <p className="mt-5 text-sm text-muted-foreground">
            By <span className="font-medium text-foreground">{article.author.name}</span>, {article.author.role} · {article.date}
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-[1100px] px-4 sm:px-6 lg:px-10">
          <div className="overflow-hidden rounded-3xl bg-secondary">
            <img src={article.image} alt={article.title} className="aspect-[16/9] w-full object-cover" />
          </div>
        </div>

        <div
          ref={ref}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
          className="mx-auto mt-12 max-w-[680px] px-4 sm:px-6"
        >
          {article.paragraphs.map((p, i) => {
            const insertQuoteAfter = Math.min(2, article.paragraphs.length - 2);
            return (
              <div key={i}>
                <p className="font-display text-lg leading-[1.7] text-foreground/90 sm:text-xl sm:leading-[1.7]">
                  {p}
                </p>
                {i === insertQuoteAfter && (
                  <blockquote className="my-10 border-l-2 border-[color:var(--clay)] pl-6 text-[color:var(--clay)]">
                    <p className="font-display text-2xl font-light italic leading-snug sm:text-3xl">
                      "{article.pullQuote}"
                    </p>
                  </blockquote>
                )}
                {i !== article.paragraphs.length - 1 && <div className="h-6" />}
              </div>
            );
          })}

          <hr className="my-14 border-border" />

          <div className="rounded-3xl border border-border bg-secondary/40 p-6 sm:p-10">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">The newsletter</p>
            <h3 className="mt-3 font-display text-2xl sm:text-3xl">Get the next essay in your inbox.</h3>
            <p className="mt-2 text-sm text-muted-foreground">One thoughtful piece a week. No noise, no upsells.</p>
            <form className="mt-6 flex flex-col gap-2 sm:flex-row">
              <input type="email" placeholder="your@email.com" aria-label="Email" className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-[color:var(--clay)]/40" />
              <button className="h-11 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-transform hover:scale-[1.02]">Subscribe</button>
            </form>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mx-auto mt-20 max-w-[1200px] px-4 pb-24 sm:px-6 lg:px-10">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl sm:text-3xl">Related reading</h2>
              <Link to="/journal" className="inline-flex items-center gap-1 text-sm hover:text-[color:var(--clay)]">
                All articles <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {related.map((a) => (
                <Link key={a.slug} to="/journal/$slug" params={{ slug: a.slug }} className="group">
                  <div className="overflow-hidden rounded-2xl bg-secondary">
                    <img src={a.image} alt={a.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
                  </div>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--clay)]">{a.cat}</p>
                  <p className="mt-1 font-display text-lg leading-snug transition-colors group-hover:text-[color:var(--clay)]">{a.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </Shell>
  );
}

// Reference to ensure ARTICLES is tree-shaken correctly if needed
void ARTICLES;
