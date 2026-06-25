import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { PageIntro } from "@/components/atlas/PageIntro";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — FlashTrends" },
      { name: "description", content: "FlashTrends is a curated marketplace built on a simple idea: fewer, better things, chosen with care." },
      { property: "og:title", content: "Our Story — FlashTrends" },
      { property: "og:description", content: "FlashTrends is a curated marketplace built on a simple idea: fewer, better things, chosen with care." },
    ],
  }),
  component: OurStory,
});

const TIMELINE = [
  { year: "2022", title: "A garage in Lisbon", body: "Two friends, a spreadsheet of favorite makers, and a frustration with bloated marketplaces." },
  { year: "2023", title: "First 50 brands", body: "We invited the makers we already loved. They invited the ones they admired." },
  { year: "2024", title: "Beyond fashion", body: "Beauty, home, and electronics joined — same standard, same restraint." },
  { year: "2026", title: "Today", body: "Five categories, hundreds of brands, one belief: curation is a service." },
];

const VALUES = [
  { title: "Considered over endless", body: "We'd rather show you 300 things you'll love than 30,000 you won't." },
  { title: "Honest by default", body: "Real photography, real reviews, real timelines. No filler copy, no fake urgency." },
  { title: "Built to outlast trends", body: "We pick brands that prioritize materials, craft, and repairability." },
];

function OurStory() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <PageIntro
          eyebrow="Our story"
          title="Fewer, better things — chosen by people who actually care."
          lede="FlashTrends started as a private list shared between friends. It's still the same list, just bigger, and now we'd love to share it with you."
        />

        <figure className="mt-14 overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
            alt="A quiet retail interior with warm light and considered objects"
            className="aspect-[16/9] w-full object-cover"
          />
        </figure>

        <section className="mx-auto mt-16 max-w-3xl space-y-5 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            We never set out to start a marketplace. We started with a shared note — the kitchen knives, the perfume, the chair, the linen shirt — things our friends asked us about so often that the list became a habit.
          </p>
          <p>
            Eventually, the list outgrew the note. So we built FlashTrends: a single, calm place to find the things we'd already tell you to buy. Every brand is one we'd give as a gift. Every product earns its place.
          </p>
          <p className="text-foreground">— Mira & Theo, founders</p>
        </section>

        <section className="mt-20">
          <h2 className="font-display text-2xl sm:text-3xl">What we believe</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-6">
                <p className="font-display text-lg">{v.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-display text-2xl sm:text-3xl">A short timeline</h2>
          <ol className="mt-8 space-y-6 border-l border-border pl-6">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[31px] top-1 grid h-3 w-3 place-items-center rounded-full bg-[color:var(--clay)]" />
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.year}</p>
                <p className="mt-1 font-display text-xl">{t.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-secondary/60 p-8">
          <div>
            <p className="font-display text-xl">Wander the shelves.</p>
            <p className="mt-1 text-sm text-muted-foreground">Five categories, curated by hand.</p>
          </div>
          <Link to="/shop" className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:scale-[1.02]">Shop everything</Link>
        </div>
      </div>
    </Shell>
  );
}
