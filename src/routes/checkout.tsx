import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type InputHTMLAttributes } from "react";
import { Shell } from "@/components/atlas/Shell";
import { useCart } from "@/lib/cart-store";
import { useRewards, REWARDS_CONSTANTS } from "@/lib/rewards-store";
import { useAnimatedNumber } from "@/lib/use-animated-number";
import { useMagnetic } from "@/lib/use-magnetic";
import { formatPrice } from "@/lib/products";
import { Apple, Award, CheckCircle2, Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";


export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — FlashTrends" }, { name: "robots", content: "noindex" }] }),
  component: Checkout,
});

type Errors = Record<string, string | undefined>;

const required = (v: string) => (v.trim().length === 0 ? "Required" : undefined);
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validators: Record<string, (v: string) => string | undefined> = {
  email: (v) => (!v ? "Required" : !emailRe.test(v) ? "Enter a valid email" : undefined),
  firstName: required,
  lastName: required,
  address: required,
  city: required,
  state: required,
  zip: (v) => (!v ? "Required" : !/^\d{4,10}$/.test(v.replace(/\s/g, "")) ? "Enter a valid postal code" : undefined),
  phone: (v) => (v && !/^[+\d\s()-]{7,}$/.test(v) ? "Enter a valid phone number" : undefined),
  cardNumber: (v) => {
    const d = v.replace(/\s/g, "");
    if (!d) return "Required";
    if (!/^\d{13,19}$/.test(d)) return "Card number looks off";
    return undefined;
  },
  cardExp: (v) => {
    if (!v) return "Required";
    const m = v.match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!m) return "Use MM/YY";
    const mm = parseInt(m[1], 10);
    if (mm < 1 || mm > 12) return "Invalid month";
    return undefined;
  },
  cardCvc: (v) => (!v ? "Required" : !/^\d{3,4}$/.test(v) ? "3 or 4 digits" : undefined),
  cardName: required,
};

function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const rewards = useRewards();
  const [done, setDone] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Points redemption (Silver+ also gets free shipping)
  const [pointsInput, setPointsInput] = useState<string>("");
  const [pointsApplied, setPointsApplied] = useState(0);
  const [pointsMsg, setPointsMsg] = useState<string | null>(null);

  const silverPlus = rewards.tier === "Silver" || rewards.tier === "Gold";
  const shipping = subtotal === 0 ? 0 : silverPlus || subtotal > 150 ? 0 : 9;
  const tax = +(subtotal * 0.08).toFixed(2);
  const pointsDiscount = +(pointsApplied / REWARDS_CONSTANTS.POINTS_PER_DOLLAR).toFixed(2);
  const total = Math.max(0, +(subtotal + shipping + tax - pointsDiscount).toFixed(2));
  const animatedTotal = useAnimatedNumber(total, 550);
  const payBtnRef = useMagnetic<HTMLButtonElement>(60, 0.22);


  const formValid = useMemo(() => {
    const fields = Object.keys(validators);
    return fields.every((f) => !validators[f](values[f] ?? ""));
  }, [values]);

  const setVal = (name: string, v: string) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    // Live-clear error if the field is already touched and now valid
    if (touched[name]) {
      const err = validators[name]?.(v);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };
  const onBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validators[name]?.(values[name] ?? "");
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all
    const next: Errors = {};
    let firstInvalid: string | undefined;
    for (const f of Object.keys(validators)) {
      const err = validators[f](values[f] ?? "");
      next[f] = err;
      if (err && !firstInvalid) firstInvalid = f;
    }
    setErrors(next);
    setTouched(Object.fromEntries(Object.keys(validators).map((k) => [k, true])));
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    // Deduct redeemed points (already redeemed via Apply button, no-op here)
    // Award new points based on dollars spent (post-discount, pre-tax)
    const dollarsForPoints = Math.max(0, subtotal - pointsDiscount);
    const earned = rewards.award(dollarsForPoints);
    setEarnedPoints(earned);
    clear();
    setDone(true);
  };

  const onApplyPoints = () => {
    const n = Math.floor(Number(pointsInput));
    if (!Number.isFinite(n) || n <= 0) {
      setPointsMsg("Enter a number of points to apply.");
      return;
    }
    if (n < REWARDS_CONSTANTS.MIN_REDEEM) {
      setPointsMsg(`Minimum redemption is ${REWARDS_CONSTANTS.MIN_REDEEM} points.`);
      return;
    }
    if (n > rewards.balance) {
      setPointsMsg("You don't have that many points.");
      return;
    }
    const maxBySubtotal = Math.floor(subtotal * REWARDS_CONSTANTS.POINTS_PER_DOLLAR);
    if (n > maxBySubtotal) {
      setPointsMsg(`You can apply up to ${maxBySubtotal.toLocaleString()} pts on this order.`);
      return;
    }
    const res = rewards.redeem(n);
    if (!res.ok) {
      setPointsMsg("Couldn't redeem those points.");
      return;
    }
    setPointsApplied(n);
    setPointsMsg(null);
    setPointsInput("");
  };

  if (done) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <CheckCircle2 className="mx-auto text-[color:var(--clay)]" size={48} />
          <h1 className="mt-6 font-display text-4xl">Order confirmed</h1>
          <p className="mt-3 text-muted-foreground">A receipt is on its way to your inbox. Track your order anytime from your account.</p>
          {earnedPoints > 0 && (
            <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-[color:var(--clay-soft)]/40 px-5 py-3">
              <Award size={18} className="text-[color:var(--clay)]" />
              <p className="text-sm">
                You earned <span className="font-semibold">{earnedPoints.toLocaleString()} points</span> on this order.
              </p>
            </div>
          )}
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/account" className="rounded-full bg-foreground px-6 py-3 text-sm text-background">Track order</Link>
            <Link to="/rewards" className="rounded-full border border-border px-6 py-3 text-sm">View rewards</Link>
            <Link to="/shop" className="rounded-full border border-border px-6 py-3 text-sm">Keep shopping</Link>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-[1300px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-2xl lowercase">flashtrends</Link>
          <p className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
            <Lock size={12} /> Secure checkout · 256-bit SSL
          </p>
        </div>
        <h1 className="mt-6 font-display text-3xl sm:text-4xl">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Checking out as a guest. <button type="button" className="underline underline-offset-2 hover:text-foreground">Sign in</button> if you'd like — it's optional.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8">
            {/* Express */}
            <section aria-label="Express checkout" className="rounded-2xl border border-border p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Express checkout — one tap</p>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" aria-label="Pay with Apple Pay" className="flex h-12 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background transition-transform hover:scale-[1.02]">
                  <Apple size={16} className="mr-1.5" /> Pay
                </button>
                <button type="button" aria-label="Pay with Google Pay" className="flex h-12 items-center justify-center gap-1.5 rounded-full border border-border bg-background text-sm font-medium transition-colors hover:bg-secondary">
                  <span className="font-semibold tracking-tight"><span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span></span>
                  <span>Pay</span>
                </button>
                <button type="button" aria-label="Pay with Shop Pay" className="flex h-12 items-center justify-center rounded-full bg-[#5A31F4] text-sm font-semibold text-white transition-transform hover:scale-[1.02]">
                  Shop Pay
                </button>
              </div>
              <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> Or pay with card <span className="h-px flex-1 bg-border" />
              </div>
            </section>

            {/* Contact */}
            <Section title="Contact" subtitle="So we can send your receipt and tracking">
              <Field
                id="email" label="Email" type="email" autoComplete="email" inputMode="email"
                value={values.email} error={errors.email}
                onChange={(v) => setVal("email", v)} onBlur={() => onBlur("email")}
                placeholder="you@example.com" required
              />
              <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" defaultChecked className="accent-[color:var(--clay)]" />
                Email me about new arrivals (optional)
              </label>
            </Section>

            {/* Shipping */}
            <Section title="Shipping address" subtitle="Where should we send your order?">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id="firstName" label="First name" autoComplete="given-name" value={values.firstName} error={errors.firstName} onChange={(v) => setVal("firstName", v)} onBlur={() => onBlur("firstName")} required />
                <Field id="lastName" label="Last name" autoComplete="family-name" value={values.lastName} error={errors.lastName} onChange={(v) => setVal("lastName", v)} onBlur={() => onBlur("lastName")} required />
              </div>
              <Field id="address" label="Address" autoComplete="street-address" value={values.address} error={errors.address} onChange={(v) => setVal("address", v)} onBlur={() => onBlur("address")} required />
              <div className="grid gap-3 sm:grid-cols-3">
                <Field id="city" label="City" autoComplete="address-level2" value={values.city} error={errors.city} onChange={(v) => setVal("city", v)} onBlur={() => onBlur("city")} required />
                <Field id="state" label="State" autoComplete="address-level1" value={values.state} error={errors.state} onChange={(v) => setVal("state", v)} onBlur={() => onBlur("state")} required />
                <Field id="zip" label="ZIP" autoComplete="postal-code" inputMode="numeric" value={values.zip} error={errors.zip} onChange={(v) => setVal("zip", v)} onBlur={() => onBlur("zip")} required />
              </div>
              <Field id="phone" label="Phone (optional)" type="tel" autoComplete="tel" inputMode="tel" value={values.phone} error={errors.phone} onChange={(v) => setVal("phone", v)} onBlur={() => onBlur("phone")} />
            </Section>

            {/* Payment */}
            <Section
              title="Payment"
              subtitle={
                <span className="inline-flex items-center gap-1.5 text-[color:var(--clay)]">
                  <Lock size={12} /> Encrypted with 256-bit SSL · Never stored on our servers
                </span>
              }
            >
              <Field id="cardNumber" label="Card number" autoComplete="cc-number" inputMode="numeric" placeholder="1234 5678 9012 3456" value={values.cardNumber} error={errors.cardNumber} onChange={(v) => setVal("cardNumber", v)} onBlur={() => onBlur("cardNumber")} required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id="cardExp" label="Expiry (MM/YY)" autoComplete="cc-exp" placeholder="MM/YY" value={values.cardExp} error={errors.cardExp} onChange={(v) => setVal("cardExp", v)} onBlur={() => onBlur("cardExp")} required />
                <Field id="cardCvc" label="CVC" autoComplete="cc-csc" inputMode="numeric" placeholder="123" value={values.cardCvc} error={errors.cardCvc} onChange={(v) => setVal("cardCvc", v)} onBlur={() => onBlur("cardCvc")} required />
              </div>
              <Field id="cardName" label="Name on card" autoComplete="cc-name" value={values.cardName} error={errors.cardName} onChange={(v) => setVal("cardName", v)} onBlur={() => onBlur("cardName")} required />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {["VISA", "MC", "AMEX", "DISC"].map((b) => (
                  <span key={b} className="rounded-md border border-border bg-secondary/50 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-foreground/60">{b}</span>
                ))}
              </div>
            </Section>

            <div>
              <button
                ref={payBtnRef}
                type="submit"
                disabled={lines.length === 0}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-transform hover:scale-[1.005] disabled:cursor-not-allowed disabled:opacity-50 will-change-transform"
              >
                <Lock size={14} /> Pay <span className="tabular-nums">{formatPrice(animatedTotal)}</span>
              </button>

              {!formValid && Object.keys(touched).length > 0 && (
                <p className="mt-2 text-center text-xs text-[color:var(--clay)]">Please fix the highlighted fields above.</p>
              )}
              <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><ShieldCheck size={11} /> 256-bit SSL</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1"><RotateCcw size={11} /> Free 60-day returns</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1"><Truck size={11} /> Carbon-neutral shipping</span>
              </p>
            </div>
          </div>

          {/* Sticky summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-secondary/40 p-6">
              <p className="font-display text-xl">Order summary</p>
              <ul className="mt-4 max-h-[280px] space-y-4 overflow-y-auto border-b border-border pb-4 pr-1">
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
                    <p className="text-sm tabular-nums">{formatPrice(l.product.price * l.qty)}</p>
                  </li>
                ))}
              </ul>

              <form className="mt-4 flex items-center gap-2">
                <input
                  type="text" name="promo" placeholder="Promo code" aria-label="Promo code"
                  className="h-9 flex-1 rounded-full border border-border bg-background px-3 text-xs outline-none focus:border-foreground"
                />
                <button type="button" className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-foreground">Apply</button>
              </form>

              {/* Rewards: apply points */}
              <div className="mt-4 rounded-2xl border border-border bg-background/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--clay)]">
                    <Award size={12} /> Rewards
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {rewards.balance.toLocaleString()} pts · ${rewards.pointsToDollars(rewards.balance).toFixed(2)}
                  </p>
                </div>
                {pointsApplied > 0 ? (
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                    <span>
                      Applied <span className="font-medium">{pointsApplied.toLocaleString()} pts</span> · −${pointsDiscount.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setPointsApplied(0); setPointsMsg(null); }}
                      className="rounded-full border border-border px-2.5 py-1 text-[10px] hover:border-foreground"
                    >Remove</button>
                  </div>
                ) : (
                  <>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="numeric"
                        min={REWARDS_CONSTANTS.MIN_REDEEM}
                        max={rewards.balance}
                        step={50}
                        value={pointsInput}
                        onChange={(e) => setPointsInput(e.target.value)}
                        placeholder={`Min ${REWARDS_CONSTANTS.MIN_REDEEM}`}
                        aria-label="Points to apply"
                        className="h-9 flex-1 rounded-full border border-border bg-background px-3 text-xs outline-none focus:border-foreground"
                      />
                      <button
                        type="button"
                        onClick={onApplyPoints}
                        disabled={rewards.balance < REWARDS_CONSTANTS.MIN_REDEEM || subtotal === 0}
                        className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      >Apply</button>
                    </div>
                    {pointsMsg && <p className="mt-1.5 text-[11px] text-[color:var(--clay)]">{pointsMsg}</p>}
                    {!pointsMsg && (
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        50 pts = $1 off. Min {REWARDS_CONSTANTS.MIN_REDEEM} pts.
                      </p>
                    )}
                  </>
                )}
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={formatPrice(subtotal)} />
                <Row label={silverPlus ? "Shipping (Silver perk)" : shipping === 0 ? "Shipping (free over $150)" : "Shipping"} value={shipping === 0 ? "Free" : formatPrice(shipping)} />
                <Row label="Tax (est.)" value={formatPrice(tax)} />
                {pointsApplied > 0 && (
                  <div className="flex items-center justify-between text-[color:var(--clay)]">
                    <dt>Points discount ({pointsApplied.toLocaleString()} pts)</dt>
                    <dd className="tabular-nums">−{formatPrice(pointsDiscount)}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-sm">Total</span>
                <span className="font-display text-2xl tabular-nums">{formatPrice(total)}</span>
              </div>

              <div className="mt-5 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <p className="flex items-start gap-2"><Truck size={12} className="mt-0.5 shrink-0 text-[color:var(--clay)]" /> Ships in 1–2 business days · Tracked delivery</p>
                <p className="flex items-start gap-2"><RotateCcw size={12} className="mt-0.5 shrink-0 text-[color:var(--clay)]" /> Free returns within 60 days, no questions asked</p>
                <p className="flex items-start gap-2"><ShieldCheck size={12} className="mt-0.5 shrink-0 text-[color:var(--clay)]" /> Buyer protection on every order</p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </Shell>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`sec-${title}`} className="rounded-2xl border border-border p-5">
      <header>
        <h2 id={`sec-${title}`} className="font-display text-lg">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </header>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "onBlur" | "value" | "id"> & {
  id: string;
  label: string;
  value?: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
};

function Field({ id, label, value = "", error, onChange, onBlur, required, ...props }: FieldProps) {
  const errId = `${id}-error`;
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs text-muted-foreground">
        {label}
        {required && <span aria-hidden className="ml-0.5 text-[color:var(--clay)]">*</span>}
      </span>
      <input
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        {...props}
        className={`mt-1 h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:ring-2 ${
          error
            ? "border-[color:var(--clay)] focus:border-[color:var(--clay)] focus:ring-[color:var(--clay)]/30"
            : "border-border focus:border-foreground focus:ring-[color:var(--clay)]/30"
        }`}
      />
      {error && (
        <span id={errId} role="alert" className="mt-1 block text-[11px] text-[color:var(--clay)]">{error}</span>
      )}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><dt className="text-muted-foreground">{label}</dt><dd className="tabular-nums">{value}</dd></div>;
}
