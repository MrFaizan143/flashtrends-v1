import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { PageIntro } from "@/components/atlas/PageIntro";
import { Leaf, Package, Recycle, Hammer } from "lucide-react";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability — FlashTrends" },
      { name: "description", content: "Our honest commitments around sourcing, packaging, and the brands we choose to carry." },
    ],
  }),
  component: Sustainability,
});

const PILLARS = [
  { Icon: Hammer, title: "How we pick brands", body: "We favor brands that publish where things are made, who makes them, and what they're made of. If a brand can't answer those three questions, we don't carry them." },
  { Icon: Leaf, title: "Materials we lean toward", body: "Natural fibers, recycled metals, FSC-certified wood, and refillable formats. We're not absolutist — we'd rather a long-lasting synthetic than a fragile natural one." },
  { Icon: Package, title: "Packaging", body: "All outer mailers and inserts are recyclable or compostable. We use minimum-viable packaging — protection first, marketing second." },
  { Icon: Recycle, title: "End of life", body: "Many of our brands offer repair, take-back, or resale programs. We surface this on the product page so you can factor it into the buy." },
];

function Sustainability() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <PageIntro
          eyebrow="Sustainability"
          title="Honest about what we're doing — and what we're not."
          lede="Curation is itself a sustainability lever: the best way to reduce waste is to sell things people actually want to keep."
        />

        <section className="mx-auto mt-12 max-w-3xl space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            We're not going to call FlashTrends a "sustainable marketplace." Selling physical goods has a footprint, full stop. What we can do — and what we work on — is buy from people who think hard about that footprint, and tell you what we know honestly.
          </p>
          <p>
            Below are the practices we currently hold ourselves and our brand partners to. We update this page as our standards evolve.
          </p>
        </section>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {PILLARS.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <Icon size={20} className="text-[color:var(--clay)]" />
              <p className="mt-4 font-display text-lg">{title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <section className="mt-16 rounded-3xl bg-secondary/50 p-8 sm:p-10">
          <h2 className="font-display text-2xl">What we're still working on</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>· A consolidated brand transparency scorecard, visible on every PDP.</li>
            <li>· Carbon estimates per shipment, in plain language.</li>
            <li>· A trade-in program for outerwear and footwear, expanding through 2026.</li>
            <li>· Replacing remaining plastic inserts with molded-pulp by end of year.</li>
          </ul>
          <p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">Last reviewed · June 2026</p>
        </section>
      </div>
    </Shell>
  );
}
