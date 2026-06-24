import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/atlas/Shell";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/products";
import { Apple, CheckCircle2, CreditCard, Lock, ShieldCheck, Truck } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — FlashTrends" }, { name: "robots", content: "noindex" }] }),
  component: Checkout,
});

function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const [step, setStep] = useState<1 | 2 | 3 | "done">(1);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 9;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + shipping + tax;

  if (step === "done") {
    return (
      <Shell>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <CheckCircle2 className="mx-auto text-[color:var(--clay)]" size={48} />
          <h1 className="mt-6 font-display text-4xl">Order confirmed</h1>
          <p className="mt-3 text-muted-foreground">A receipt is on its way to your inbox. Track your order anytime from your account.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/account" className="rounded-full bg-foreground px-6 py-3 text-sm text-background">Track order</Link>
            <Link to="/shop" className="rounded-full border border-border px-6 py-3 text-sm">Keep shopping</Link>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-[1300px] px-4 py-10 sm:px-6 lg:px-10">
        <Link to="/" className="font-display text-2xl">FlashTrends</Link>
        <h1 className="mt-6 font-display text-3xl sm:text-4xl">Checkout</h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <form
            onSubmit={(e) => { e.preventDefault(); if (step < 3) setStep((step + 1) as 2 | 3); else { clear(); setStep("done"); } }}
            className="space-y-8"
          >
            {/* Express */}
            <section className="rounded-2xl border border-border p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider">Express checkout</p>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" className="flex h-12 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background"><Apple size={16} className="mr-1.5" /> Pay</button>
                <button type="button" className="flex h-12 items-center justify-center rounded-full bg-[#5A31F4] text-sm font-medium text-white">Shop Pay</button>
                <button type="button" className="flex h-12 items-center justify-center rounded-full bg-[#FFC439] text-sm font-medium text-black">PayPal</button>
              </div>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> Or pay with card <span className="h-px flex-1 bg-border" /></div>
            </section>

            {/* Contact */}
            <Section title="Contact" step={1} current={step}>
              <Input label="Email" type="email" autoComplete="email" required />
              <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" defaultChecked className="accent-[color:var(--clay)]" /> Email me with news and offers</label>
            </Section>

            {/* Shipping */}
            <Section title="Shipping address" step={2} current={step}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="First name" autoComplete="given-name" required />
                <Input label="Last name" autoComplete="family-name" required />
              </div>
              <Input label="Address" autoComplete="street-address" required />
              <div className="grid gap-3 sm:grid-cols-3">
                <Input label="City" autoComplete="address-level2" required />
                <Input label="State" autoComplete="address-level1" required />
                <Input label="ZIP" autoComplete="postal-code" required inputMode="numeric" />
              </div>
              <Input label="Phone" type="tel" autoComplete="tel" />
            </Section>

            {/* Payment */}
            <Section title="Payment" step={3} current={step}>
              <Input label="Card number" autoComplete="cc-number" inputMode="numeric" placeholder="1234 5678 9012 3456" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Expiry (MM/YY)" autoComplete="cc-exp" placeholder="MM/YY" required />
                <Input label="CVC" autoComplete="cc-csc" inputMode="numeric" placeholder="123" required />
              </div>
              <Input label="Name on card" autoComplete="cc-name" required />
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Lock size={12} /> Encrypted, never stored.</p>
            </Section>

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-transform hover:scale-[1.005]"
            >
              {step === 3 ? <><CreditCard size={16} /> Pay {formatPrice(total)}</> : `Continue to ${step === 1 ? "shipping" : "payment"}`}
            </button>

            <p className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <ShieldCheck size={12} /> 256-bit SSL · <Truck size={12} /> Free 60-day returns
            </p>
          </form>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-secondary/40 p-6">
              <p className="font-display text-xl">Order summary</p>
              <ul className="mt-4 space-y-4 border-b border-border pb-4">
                {lines.length === 0 && <li className="text-sm text-muted-foreground">Your bag is empty.</li>}
                {lines.map((l) => (
                  <li key={l.product.id + (l.variant ?? "")} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-background">
                      <img src={l.product.images[0]} alt="" className="h-full w-full object-cover" />
                      <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-foreground text-[10px] text-background">{l.qty}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{l.product.name}</p>
                      <p className="text-xs text-muted-foreground">{l.variant ?? l.product.brand}</p>
                    </div>
                    <p className="text-sm">{formatPrice(l.product.price * l.qty)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={formatPrice(subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
                <Row label="Tax" value={formatPrice(tax)} />
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-sm">Total</span>
                <span className="font-display text-2xl">{formatPrice(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

function Section({ title, step, current, children }: { title: string; step: number; current: number | "done"; children: React.ReactNode }) {
  const active = current === step;
  const done = typeof current === "number" && current > step;
  return (
    <section className={`rounded-2xl border p-5 transition ${active ? "border-foreground" : "border-border"} ${active ? "" : "opacity-80"}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{step}. {title}</p>
        {done && <CheckCircle2 size={16} className="text-[color:var(--clay)]" />}
      </div>
      {active && <div className="mt-4 space-y-3">{children}</div>}
    </section>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        {...props}
        className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-foreground focus:ring-2 focus:ring-[color:var(--clay)]/30"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><dt className="text-muted-foreground">{label}</dt><dd>{value}</dd></div>;
}
