import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { PageIntro } from "@/components/atlas/PageIntro";
import { RotateCcw, ShieldCheck, Repeat, Mail } from "lucide-react";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns & Exchanges — FlashTrends" },
      { name: "description", content: "60-day no-questions returns and free exchanges on every FlashTrends order." },
    ],
  }),
  component: Returns,
});

function Returns() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <PageIntro
          eyebrow="Returns"
          title="Sixty days to decide."
          lede="If something doesn't feel right, send it back. No fees, no questions, no expiry on store credit."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { Icon: RotateCcw, title: "60-day window", body: "From the day your order is delivered." },
            { Icon: Repeat, title: "Free exchanges", body: "Different size or color, on us." },
            { Icon: ShieldCheck, title: "Buyer protection", body: "Full refund if anything arrives damaged." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <Icon size={20} className="text-[color:var(--clay)]" />
              <p className="mt-4 font-display text-lg">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl sm:text-3xl">How returns work</h2>
          <ol className="mt-6 space-y-5">
            {[
              ["Start your return", "Sign into your account or use the return link in your shipping email. Pick the items and reason."],
              ["Print or scan the label", "We'll email you a prepaid carrier label. Or use the QR code at the carrier drop-off."],
              ["Pack and drop it off", "Reuse the original mailer where you can. Drop at any carrier location near you."],
              ["Refund or exchange", "We process within 2 business days of receiving the package. Refunds land in 3–5 days."],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-5 rounded-2xl border border-border bg-card p-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-foreground text-sm font-medium text-background">{i + 1}</span>
                <div>
                  <p className="font-display text-lg">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl">A few exceptions</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>· Final-sale items (clearly marked on the product page) cannot be returned.</li>
            <li>· Beauty and skincare products must be unopened and sealed.</li>
            <li>· Personalized or custom-made pieces are non-refundable unless defective.</li>
            <li>· Earrings and intimate apparel are final sale for hygiene reasons.</li>
          </ul>
        </section>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[color:var(--clay-soft)] p-8">
          <div>
            <p className="font-display text-xl text-foreground">Need a hand with a return?</p>
            <p className="mt-1 text-sm text-muted-foreground">Our care team replies in a few hours, every day.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:scale-[1.02]">
            <Mail size={15} /> Contact us
          </Link>
        </div>
      </div>
    </Shell>
  );
}
