import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { PageIntro } from "@/components/atlas/PageIntro";
import { useReveal } from "@/lib/use-reveal";

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

const ARTICLES = [
  {
    cat: "Field notes",
    title: "On owning fewer, better things",
    excerpt: "Why the most expensive purchase is often the one you replace every two years.",
    date: "May 24, 2026",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    cat: "Interview",
    title: "Inside a Northampton shoemaking workshop",
    excerpt: "Three generations, one bench, and the goodyear welt that outlasts everyone in the room.",
    date: "May 11, 2026",
    image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    cat: "Buying guide",
    title: "Linen, properly: a primer",
    excerpt: "How to read weight, weave, and finish — and skip the marketing entirely.",
    date: "Apr 28, 2026",
    image: "https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&w=1200&q=80",
  },
  {
    cat: "Rituals",
    title: "A slow-morning coffee setup that lasts a decade",
    excerpt: "Six pieces of kit we'd buy again tomorrow, and three we wouldn't.",
    date: "Apr 14, 2026",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    cat: "Home",
    title: "The case for one good lamp",
    excerpt: "Lighting is the easiest, cheapest upgrade you can make to a room. Here's where to start.",
    date: "Mar 30, 2026",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    cat: "Beauty",
    title: "Five-step skincare, deconstructed",
    excerpt: "What you actually need, in what order, and why the ten-step routine is mostly marketing.",
    date: "Mar 16, 2026",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
  },
];

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
          {ARTICLES.map((a) => <ArticleCard key={a.title} {...a} />)}
        </div>
      </div>
    </Shell>
  );
}

function ArticleCard(a: (typeof ARTICLES)[number]) {
  const { ref, visible } = useReveal<HTMLElement>();
  return (
    <article
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 600ms cubic-bezier(0.2,0.7,0.2,1), transform 600ms cubic-bezier(0.2,0.7,0.2,1)",
      }}
      className="group cursor-pointer"
    >
      <div className="overflow-hidden rounded-2xl bg-secondary">
        <img src={a.image} alt={a.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
      </div>
      <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[color:var(--clay)]">{a.cat}</p>
      <h2 className="mt-2 font-display text-xl leading-snug text-foreground sm:text-2xl">{a.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
      <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{a.date}</p>
    </article>
  );
}
