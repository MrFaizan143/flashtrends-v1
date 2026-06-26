import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { useRewards } from "@/lib/rewards-store";
import { Award, CheckCircle2, Package, Truck, ChevronRight, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — FlashTrends" }, { name: "robots", content: "noindex" }] }),
  component: Account,
});

const PROFILE = { name: "Maya Okafor", email: "maya@flashtrends.com", member: "Member since 2023" };

const ORDERS = [
  { id: "AT-82910", date: "Mar 02, 2026", status: "In transit" as const, total: "$148.00", items: "Heavyweight Linen Shirt", qty: 1 },
  { id: "AT-83012", date: "Mar 18, 2026", status: "Delivered" as const, total: "$689.00", items: "Cashmere Overcoat", qty: 1 },
  { id: "AT-82711", date: "Feb 20, 2026", status: "Delivered" as const, total: "$285.00", items: "Stonewashed Linen Set", qty: 1 },
];

function Account() {
  const r = useRewards();
  return (
    <Shell>
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Welcome back</p>
            <h1 className="mt-2 font-display text-4xl font-light sm:text-5xl">Hello, Maya</h1>
          </div>
          <button className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-foreground">Sign out</button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav className="space-y-1 lg:sticky lg:top-24 lg:self-start">
            {[
              ["Orders", "/account"],
              ["Rewards", "/rewards"],
              ["Wishlist", "/wishlist"],
              ["Addresses", "/account"],
              ["Payment methods", "/account"],
              ["Preferences", "/account"],
            ].map(([label, href], i) => (
              <Link key={label} to={href} className={`block rounded-lg px-4 py-2.5 text-sm ${i === 0 ? "bg-secondary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="space-y-10">
            <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[color:var(--clay-soft)] font-display text-xl text-[color:var(--clay)]">M</div>
                  <div>
                    <p className="font-display text-xl">{PROFILE.name}</p>
                    <p className="text-sm text-muted-foreground">{PROFILE.email}</p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{PROFILE.member}</p>
                  </div>
                </div>
                <button className="rounded-full border border-border px-4 py-2 text-sm hover:border-foreground">Edit profile</button>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl">Active order</h2>
              <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-card">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/40 px-6 py-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Order AT-82910</p>
                    <p className="mt-0.5 font-medium">Arrives Wed, Mar 25</p>
                  </div>
                  <span className="rounded-full bg-[color:var(--clay-soft)] px-3 py-1 text-xs font-medium text-[color:var(--clay)]">In transit</span>
                </div>
                <div className="px-6 py-6">
                  <ol className="grid grid-cols-4 gap-4">
                    {[
                      { label: "Placed", icon: CheckCircle2, done: true },
                      { label: "Shipped", icon: Package, done: true },
                      { label: "Out for delivery", icon: Truck, done: false },
                      { label: "Delivered", icon: CheckCircle2, done: false },
                    ].map((s, i, arr) => (
                      <li key={s.label} className="relative">
                        <div className={`grid h-10 w-10 place-items-center rounded-full ${s.done ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
                          <s.icon size={16} />
                        </div>
                        <p className="mt-2 text-[11px] leading-tight sm:text-xs">{s.label}</p>
                        {i < arr.length - 1 && <span className={`absolute left-10 top-5 h-px w-[calc(100%-2.5rem)] ${arr[i + 1].done ? "bg-foreground" : "bg-border"}`} />}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="border-t border-border px-6 py-4">
                  <Link to="/orders/$id" params={{ id: "AT-82910" }} className="inline-flex items-center gap-1 text-sm font-medium hover:text-[color:var(--clay)]">
                    View details <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl">Order history</h2>
              <div className="mt-4 space-y-3">
                {ORDERS.map((o) => (
                  <Link
                    key={o.id}
                    to="/orders/$id"
                    params={{ id: o.id }}
                    className="group flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:border-foreground"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium">{o.id}</p>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] ${o.status === "Delivered" ? "bg-secondary text-muted-foreground" : "bg-[color:var(--clay-soft)] text-[color:var(--clay)]"}`}>{o.status}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{o.date} · {o.qty} {o.qty === 1 ? "item" : "items"}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{o.items}</p>
                    </div>
                    <p className="font-medium">{o.total}</p>
                    <ChevronRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Shell>
  );
}
