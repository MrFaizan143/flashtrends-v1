import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { PageIntro } from "@/components/atlas/PageIntro";
import { Truck, Globe2, PackageCheck, Clock } from "lucide-react";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — FlashTrends" },
      { name: "description", content: "Shipping rates, timelines and tracking for every FlashTrends order." },
    ],
  }),
  component: Shipping,
});

const RATES = [
  { region: "United States", standard: "2–4 business days", express: "Next business day", free: "Free over $75" },
  { region: "Canada", standard: "4–6 business days", express: "2 business days", free: "Free over $120" },
  { region: "United Kingdom & EU", standard: "5–7 business days", express: "2–3 business days", free: "Free over €150" },
  { region: "Rest of world", standard: "7–12 business days", express: "3–5 business days", free: "Calculated at checkout" },
];

function Shipping() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <PageIntro
          eyebrow="Shipping"
          title="Carefully packed. Reliably delivered."
          lede="Every order ships from our climate-controlled facility within 24 hours, in recyclable packaging built for the journey."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Clock, title: "Ships in 24h", body: "Orders placed before 2pm ET ship same day." },
            { Icon: Truck, title: "Free over $75", body: "Complimentary US ground shipping over $75." },
            { Icon: Globe2, title: "Worldwide", body: "We deliver to 60+ countries. Duties calculated at checkout." },
            { Icon: PackageCheck, title: "Tracked end-to-end", body: "You'll receive a tracking link the moment we hand it off." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <Icon size={20} className="text-[color:var(--clay)]" />
              <p className="mt-4 font-display text-lg">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl sm:text-3xl">Rates & timelines</h2>
          <div className="mt-6 overflow-hidden rounded-3xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">Region</th>
                  <th className="px-5 py-4 font-medium">Standard</th>
                  <th className="hidden px-5 py-4 font-medium sm:table-cell">Express</th>
                  <th className="px-5 py-4 font-medium">Free shipping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {RATES.map((r) => (
                  <tr key={r.region}>
                    <td className="px-5 py-4 font-medium">{r.region}</td>
                    <td className="px-5 py-4 text-muted-foreground">{r.standard}</td>
                    <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">{r.express}</td>
                    <td className="px-5 py-4 text-muted-foreground">{r.free}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">Tracking your order</h2>
            <p className="mt-3 text-muted-foreground">
              You'll get a confirmation email with a tracking number as soon as your order is handed to the carrier. You can also check live status from your <Link to="/account" className="underline-offset-4 hover:underline">account</Link>.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl">Something off?</h2>
            <p className="mt-3 text-muted-foreground">
              Wrong address, delayed package, or missing parcel — our team responds within a few hours. <Link to="/contact" className="underline-offset-4 hover:underline">Reach out</Link> and we'll make it right.
            </p>
          </div>
        </section>
      </div>
    </Shell>
  );
}
