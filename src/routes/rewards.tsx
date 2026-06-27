import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/atlas/Shell";
import { PageIntro } from "@/components/atlas/PageIntro";
import { useRewards, REWARDS_CONSTANTS, type Tier } from "@/lib/rewards-store";
import { useReveal } from "@/lib/use-reveal";
import { useAnimatedNumber } from "@/lib/use-animated-number";

import { toast } from "sonner";
import { Award, Check, Copy, Gift, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — FlashTrends" },
      { name: "description", content: "Earn points on every order, climb three tiers, and redeem for credit at checkout. FlashTrends Rewards." },
    ],
  }),
  component: Rewards,
});

function Rewards() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <PageIntro
          eyebrow="FlashTrends Rewards"
          title="Earn quietly. Climb steadily."
          lede="One point for every dollar spent. Three tiers, real perks, and credit you can actually use at checkout."
        />

        <div className="mt-14 space-y-12">
          <StatusCard />
          <HowItWorks />
          <Tiers />
          <Referral />
          <Activity />
        </div>
      </div>
    </Shell>
  );
}

function StatusCard() {
  const r = useRewards();
  const { ref, visible } = useReveal<HTMLDivElement>();
  const animBalance = useAnimatedNumber(r.balance, 700);
  const animLifetime = useAnimatedNumber(r.lifetime, 700);
  const animCredit = useAnimatedNumber(r.pointsToDollars(r.balance), 700);
  const animToNext = useAnimatedNumber(r.pointsToNext, 700);

  return (
    <section
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 700ms ease, transform 700ms ease",
      }}
      className="overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10"
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <TierBadge tier={r.tier} />
            <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Current tier</span>
          </div>
          <p className="mt-5 font-display text-5xl font-light tabular-nums sm:text-6xl">
            {Math.round(animBalance).toLocaleString()} <span className="text-xl text-muted-foreground">pts</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Worth <span className="font-medium text-foreground tabular-nums">${animCredit.toFixed(2)}</span> in credit · <span className="tabular-nums">{Math.round(animLifetime).toLocaleString()}</span> lifetime
          </p>


          {r.nextTier ? (
            <div className="mt-7 max-w-md">
              <div className="flex items-end justify-between text-xs text-muted-foreground">
                <span>{r.tier}</span>
                <span>{r.nextTier}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-[color:var(--clay)] transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(4, r.tierProgress * 100))}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground tabular-nums">{Math.round(animToNext).toLocaleString()} pts</span> to {r.nextTier}
              </p>

            </div>
          ) : (
            <p className="mt-7 text-sm text-[color:var(--clay)]">You're at our top tier. Thank you.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Spendable" value={`${r.balance.toLocaleString()} pts`} sub={`$${r.pointsToDollars(r.balance).toFixed(2)}`} />
          <Stat label="Lifetime earned" value={`${r.lifetime.toLocaleString()} pts`} sub={r.tier} />
          <Stat label="Earning rate" value={`${r.multiplier}× pts`} sub="per $1 spent" />
          <Stat label="Min. redeem" value={`${REWARDS_CONSTANTS.MIN_REDEEM} pts`} sub="$4.00 off" />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/40 p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-xl">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  const styles: Record<Tier, string> = {
    Member: "bg-secondary text-foreground",
    Silver: "bg-foreground/10 text-foreground",
    Gold: "bg-[color:var(--clay)] text-[color:var(--accent-foreground)]",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${styles[tier]}`}>
      <Award size={12} /> {tier}
    </span>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Sparkles, title: "Earn", body: "1 point for every $1 spent. Tier multipliers boost your rate automatically." },
    { icon: TrendingUp, title: "Climb", body: "Lifetime points unlock Silver at 500 and Gold at 1,500. Your tier never resets." },
    { icon: Gift, title: "Redeem", body: "Apply 200+ points at checkout. Every 50 points is $1 off your order." },
  ];
  return (
    <section>
      <h2 className="font-display text-2xl sm:text-3xl">How it works</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--clay-soft)] text-[color:var(--clay)]">
                <s.icon size={16} />
              </span>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Step {i + 1}</p>
            </div>
            <p className="mt-4 font-display text-xl">{s.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const TIERS: { name: Tier; threshold: string; perks: string[] }[] = [
  {
    name: "Member",
    threshold: "0+ lifetime pts",
    perks: ["1× points on every order", "Birthday surprise", "Full Journal access"],
  },
  {
    name: "Silver",
    threshold: "500+ lifetime pts",
    perks: ["Free shipping always — no minimum", "1.25× points on every order", "Early access to new drops"],
  },
  {
    name: "Gold",
    threshold: "1,500+ lifetime pts",
    perks: ["Free 2-day shipping", "1.5× points on every order", "Private restock alerts", "Dedicated support line"],
  },
];

function Tiers() {
  const r = useRewards();
  return (
    <section>
      <h2 className="font-display text-2xl sm:text-3xl">Tiers & perks</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => {
          const active = t.name === r.tier;
          return (
            <div
              key={t.name}
              className={`rounded-2xl border p-6 transition ${
                active
                  ? "border-[color:var(--clay)] bg-[color:var(--clay-soft)]/40 shadow-sm"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <TierBadge tier={t.name} />
                {active && <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--clay)]">You're here</span>}
              </div>
              <p className="mt-4 font-display text-2xl">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.threshold}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check size={14} className="mt-0.5 shrink-0 text-[color:var(--clay)]" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Referral() {
  const r = useRewards();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(r.referralCode);
      setCopied(true);
      toast.success("Referral code copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy. Try again.");
    }
  };
  return (
    <section className="overflow-hidden rounded-3xl bg-foreground p-6 text-background sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-background/70">Refer a friend</p>
          <h2 className="mt-3 font-display text-3xl font-light sm:text-4xl">
            Give 15% off. Earn <span className="text-[color:var(--clay-soft)]">200 points</span> when they buy.
          </h2>
          <p className="mt-3 max-w-md text-sm text-background/75">
            Share your code with a friend. They get 15% off their first order. You earn 200 points (worth $4) the moment it ships.
          </p>
        </div>
        <div className="rounded-2xl bg-background/10 p-2 ring-1 ring-background/20">
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-xl bg-background/5 px-4 py-3 font-display text-2xl tracking-[0.18em] text-background">
              {r.referralCode}
            </div>
            <button
              onClick={copy}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[color:var(--clay)] px-4 text-sm font-medium text-[color:var(--accent-foreground)] transition-transform hover:scale-[1.02]"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Activity() {
  const r = useRewards();
  return (
    <section>
      <h2 className="font-display text-2xl sm:text-3xl">Points activity</h2>
      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {r.activity.length === 0 && (
            <li className="px-5 py-6 text-sm text-muted-foreground">No activity yet — your first order will start the clock.</li>
          )}
          {r.activity.map((a) => {
            const sign = a.type === "redeemed" ? "−" : "+";
            const color = a.type === "redeemed" ? "text-muted-foreground" : "text-[color:var(--clay)]";
            return (
              <li key={a.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.description}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                    {a.date} · {a.type}
                  </p>
                </div>
                <p className={`shrink-0 font-display text-lg tabular-nums ${color}`}>
                  {sign}
                  {a.points.toLocaleString()} pts
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Lifetime points (which determine your tier) never decrease, even when you redeem.
      </p>
    </section>
  );
}
