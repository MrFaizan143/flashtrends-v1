import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { PageIntro } from "@/components/atlas/PageIntro";
import { MapPin, Briefcase, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — FlashTrends" },
      { name: "description", content: "Help us build a calmer, more honest marketplace. Open roles at FlashTrends." },
    ],
  }),
  component: Careers,
});

const ROLES = [
  { title: "Senior Product Designer", team: "Design", location: "Lisbon · Hybrid", type: "Full-time" },
  { title: "Buying Manager — Beauty", team: "Buying", location: "London · On-site", type: "Full-time" },
  { title: "Full-stack Engineer", team: "Engineering", location: "Remote · EU", type: "Full-time" },
  { title: "Customer Care Specialist", team: "Operations", location: "Remote · North America", type: "Full-time" },
  { title: "Editorial Lead, Journal", team: "Content", location: "Lisbon · Hybrid", type: "Part-time" },
];

function Careers() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <PageIntro
          eyebrow="Careers"
          title="Help build a calmer marketplace."
          lede="We're a small, deliberate team. We hire slowly, give people room to do their best work, and protect the focus we ask of each other."
        />

        <section className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Small teams", body: "Most projects are run by two or three people, end to end." },
            { title: "Generous time off", body: "Five weeks paid, plus the days between Dec 25 and Jan 2." },
            { title: "Real craft", body: "Budget and time to ship something you'd actually be proud of." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-6">
              <p className="font-display text-lg">{c.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl sm:text-3xl">Open roles</h2>
          <div className="mt-6 divide-y divide-border rounded-3xl border border-border">
            {ROLES.map((r) => (
              <div key={r.title} className="grid gap-3 px-6 py-5 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center">
                <div>
                  <p className="font-display text-lg leading-tight">{r.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[color:var(--clay)]">
                    <Briefcase size={11} /> {r.team} · {r.type}
                  </p>
                </div>
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={13} /> {r.location}
                </p>
                <a
                  href={`mailto:careers@flashtrends.com?subject=${encodeURIComponent(r.title)}`}
                  className="inline-flex items-center gap-1.5 justify-self-start rounded-full border border-border px-4 py-2 text-sm hover:border-foreground sm:justify-self-end"
                >
                  Apply <ArrowUpRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16 rounded-3xl bg-[color:var(--clay-soft)] p-8 text-center sm:p-10">
          <p className="font-display text-2xl text-foreground">Don't see your role?</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            We're always interested in hearing from thoughtful people. Send us a note about what you'd want to do here.
          </p>
          <a href="mailto:careers@flashtrends.com" className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:scale-[1.02]">
            careers@flashtrends.com
          </a>
        </div>
      </div>
    </Shell>
  );
}
