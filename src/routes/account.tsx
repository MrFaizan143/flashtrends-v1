import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { CheckCircle2, Package, Truck } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Atlas" }, { name: "robots", content: "noindex" }] }),
  component: Account,
});

const ORDERS = [
  { id: "AT-83012", date: "Mar 18, 2026", status: "Delivered", total: "$689", items: "Cashmere Overcoat" },
  { id: "AT-82910", date: "Mar 02, 2026", status: "In transit", total: "$148", items: "Heavyweight Linen Shirt" },
  { id: "AT-82711", date: "Feb 20, 2026", status: "Delivered", total: "$285", items: "Stonewashed Linen Set" },
];

function Account() {
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
                      { label: "Ordered", icon: CheckCircle2, done: true },
                      { label: "Packed", icon: Package, done: true },
                      { label: "Shipped", icon: Truck, done: true },
                      { label: "Delivered", icon: CheckCircle2, done: false },
                    ].map((s, i, arr) => (
                      <li key={s.label} className="relative">
                        <div className={`grid h-10 w-10 place-items-center rounded-full ${s.done ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
                          <s.icon size={16} />
                        </div>
                        <p className="mt-2 text-xs">{s.label}</p>
                        {i < arr.length - 1 && <span className={`absolute left-10 top-5 h-px w-[calc(100%-2.5rem)] ${arr[i + 1].done ? "bg-foreground" : "bg-border"}`} />}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl">Order history</h2>
              <div className="mt-4 divide-y divide-border rounded-3xl border border-border">
                {ORDERS.map((o) => (
                  <div key={o.id} className="grid grid-cols-2 items-center gap-3 px-6 py-5 text-sm sm:grid-cols-5">
                    <div>
                      <p className="font-medium">{o.id}</p>
                      <p className="text-xs text-muted-foreground">{o.date}</p>
                    </div>
                    <p className="text-muted-foreground sm:col-span-2">{o.items}</p>
                    <span className={`justify-self-start rounded-full px-3 py-1 text-xs ${o.status === "Delivered" ? "bg-secondary text-muted-foreground" : "bg-[color:var(--clay-soft)] text-[color:var(--clay)]"}`}>{o.status}</span>
                    <p className="justify-self-end font-medium">{o.total}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Shell>
  );
}
