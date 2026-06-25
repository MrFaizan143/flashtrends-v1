import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { PageIntro } from "@/components/atlas/PageIntro";
import { Mail, MessageCircle, Clock, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — FlashTrends" },
      { name: "description", content: "Reach the FlashTrends team. We reply in a few hours, every day." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(5, "Message is too short").max(1000),
});

const FAQS = [
  { q: "How fast do you reply?", a: "Within a few hours during the day, almost always under 24 hours." },
  { q: "Can I change my shipping address?", a: "Yes — as long as the order hasn't shipped. Email us with your order number ASAP." },
  { q: "Do you ship internationally?", a: "We deliver to over 60 countries. Duties are calculated at checkout, no surprise fees on delivery." },
  { q: "Is checkout secure?", a: "Yes. Every checkout uses 256-bit SSL, and we never store full card numbers." },
  { q: "Can I cancel an order?", a: "If your order hasn't been picked yet, we can cancel it. After that, you can return it free within 60 days." },
  { q: "Do you offer gift wrapping?", a: "Yes — choose gift wrap at checkout for a handwritten note and our signature wrap." },
];

function Contact() {
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof schema>, string>>>({});
  const [open, setOpen] = useState<number | null>(0);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { name: String(fd.get("name") || ""), email: String(fd.get("email") || ""), message: String(fd.get("message") || "") };
    const r = schema.safeParse(data);
    if (!r.success) {
      const next: typeof errors = {};
      for (const i of r.error.issues) next[i.path[0] as keyof typeof errors] = i.message;
      setErrors(next);
      return;
    }
    setErrors({});
    (e.currentTarget as HTMLFormElement).reset();
    toast.success("Message sent. We'll be in touch shortly.");
  };

  return (
    <Shell>
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <PageIntro
          eyebrow="Contact"
          title="We're here when you need us."
          lede="Real humans, fast replies. Send a note and we'll get back to you within a few hours."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_360px]">
          <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" autoComplete="name" error={errors.name} />
              <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} />
            </div>
            <div className="mt-4">
              <label className="text-xs uppercase tracking-wider text-muted-foreground" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                aria-invalid={!!errors.message}
                className={`mt-1.5 w-full resize-none rounded-2xl border bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-[color:var(--clay)]/40 ${errors.message ? "border-[color:var(--clay)]" : "border-border"}`}
                placeholder="Tell us a bit about what you need…"
              />
              {errors.message && <p className="mt-1 text-xs text-[color:var(--clay)]">{errors.message}</p>}
            </div>
            <button type="submit" className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-7 text-sm font-medium text-background transition-transform hover:scale-[1.02]">
              Send message
            </button>
          </form>

          <aside className="space-y-3">
            {[
              { Icon: Mail, title: "Email", body: "care@flashtrends.com" },
              { Icon: MessageCircle, title: "Live chat", body: "Use the concierge in the corner" },
              { Icon: Clock, title: "Hours", body: "Mon–Sun · 7am–11pm ET" },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                <Icon size={18} className="mt-0.5 text-[color:var(--clay)]" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
                  <p className="mt-0.5 text-sm font-medium">{body}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>

        <section className="mt-20">
          <h2 className="font-display text-2xl sm:text-3xl">Frequently asked</h2>
          <div className="mt-6 divide-y divide-border rounded-3xl border border-border">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-medium">{f.q}</span>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                  {isOpen && <p className="px-6 pb-5 text-sm text-muted-foreground">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Field({ label, name, type = "text", autoComplete, error }: { label: string; name: string; type?: string; autoComplete?: string; error?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={`mt-1.5 h-12 w-full rounded-full border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-[color:var(--clay)]/40 ${error ? "border-[color:var(--clay)]" : "border-border"}`}
      />
      {error && <p className="mt-1 text-xs text-[color:var(--clay)]">{error}</p>}
    </div>
  );
}
