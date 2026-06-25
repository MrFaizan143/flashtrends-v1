import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { CheckCircle2, Package, Truck, Home, ChevronRight } from "lucide-react";

type Step = "Placed" | "Shipped" | "Out for delivery" | "Delivered";
type OrderItem = { name: string; qty: number; price: number; image: string };
type Order = {
  id: string;
  date: string;
  status: Step;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  eta: string;
  address: string;
  carrier: string;
  tracking: string;
  items: OrderItem[];
};

const ORDERS: Record<string, Order> = {
  "AT-83012": {
    id: "AT-83012", date: "Mar 18, 2026", status: "Delivered", total: 689, subtotal: 689, shipping: 0, tax: 0,
    eta: "Delivered Mar 22, 2026", address: "32 Rua das Flores, 1200-194 Lisboa, PT",
    carrier: "DHL Express", tracking: "JD014600003428819000",
    items: [{ name: "Cashmere Overcoat", qty: 1, price: 689, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80" }],
  },
  "AT-82910": {
    id: "AT-82910", date: "Mar 02, 2026", status: "Out for delivery", total: 148, subtotal: 148, shipping: 0, tax: 0,
    eta: "Arrives today by 8pm", address: "32 Rua das Flores, 1200-194 Lisboa, PT",
    carrier: "DHL Express", tracking: "JD014600003428820100",
    items: [{ name: "Heavyweight Linen Shirt", qty: 1, price: 148, image: "https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&w=600&q=80" }],
  },
  "AT-82711": {
    id: "AT-82711", date: "Feb 20, 2026", status: "Delivered", total: 285, subtotal: 285, shipping: 0, tax: 0,
    eta: "Delivered Feb 24, 2026", address: "32 Rua das Flores, 1200-194 Lisboa, PT",
    carrier: "DHL Express", tracking: "JD014600003428799100",
    items: [{ name: "Stonewashed Linen Set", qty: 1, price: 285, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80" }],
  },
};

export const Route = createFileRoute("/orders/$id")({
  head: ({ params }) => ({ meta: [{ title: `Order ${params.id} — FlashTrends` }, { name: "robots", content: "noindex" }] }),
  loader: ({ params }) => {
    const order = ORDERS[params.id];
    if (!order) throw notFound();
    return { order };
  },
  component: OrderDetail,
  notFoundComponent: () => (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Order not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't locate that order number.</p>
        <Link to="/account" className="mt-6 inline-flex rounded-full bg-foreground px-6 py-3 text-sm text-background">Back to account</Link>
      </div>
    </Shell>
  ),
});

const STEPS: { label: Step; Icon: typeof CheckCircle2 }[] = [
  { label: "Placed", Icon: CheckCircle2 },
  { label: "Shipped", Icon: Package },
  { label: "Out for delivery", Icon: Truck },
  { label: "Delivered", Icon: Home },
];

function OrderDetail() {
  const { order } = Route.useLoaderData();
  const stepIdx = STEPS.findIndex((s) => s.label === order.status);
  const fmt = (n: number) => `$${n.toFixed(2)}`;

  return (
    <Shell>
      <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-10">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/account" className="hover:text-foreground">Account</Link>
          <ChevronRight size={12} />
          <span className="text-foreground">Order {order.id}</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Order {order.id}</p>
            <h1 className="mt-2 font-display text-3xl font-light sm:text-4xl">{order.eta}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Placed {order.date}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${order.status === "Delivered" ? "bg-secondary text-muted-foreground" : "bg-[color:var(--clay-soft)] text-[color:var(--clay)]"}`}>
            {order.status}
          </span>
        </div>

        <section className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-xl">Tracking</h2>
          <ol className="mt-6 grid grid-cols-4 gap-4">
            {STEPS.map((s, i) => {
              const done = i <= stepIdx;
              const next = STEPS[i + 1];
              const nextDone = next ? STEPS.findIndex((x) => x.label === next.label) <= stepIdx : false;
              return (
                <li key={s.label} className="relative">
                  <div className={`grid h-10 w-10 place-items-center rounded-full ${done ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
                    <s.Icon size={16} />
                  </div>
                  <p className="mt-2 text-[11px] leading-tight sm:text-xs">{s.label}</p>
                  {i < STEPS.length - 1 && (
                    <span className={`absolute left-10 top-5 h-px w-[calc(100%-2.5rem)] ${nextDone ? "bg-foreground" : "bg-border"}`} />
                  )}
                </li>
              );
            })}
          </ol>
          <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
            <div className="text-sm">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Carrier</p>
              <p className="mt-1">{order.carrier}</p>
            </div>
            <div className="text-sm">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Tracking number</p>
              <p className="mt-1 font-mono text-xs">{order.tracking}</p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-display text-xl">Items</h2>
            <ul className="mt-4 divide-y divide-border">
              {order.items.map((it) => (
                <li key={it.name} className="flex gap-4 py-4">
                  <img src={it.image} alt={it.name} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex flex-1 items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{it.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Qty {it.qty}</p>
                    </div>
                    <p className="text-sm font-medium">{fmt(it.price)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="font-display text-lg">Summary</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <Row k="Subtotal" v={fmt(order.subtotal)} />
                <Row k="Shipping" v={order.shipping === 0 ? "Free" : fmt(order.shipping)} />
                <Row k="Tax" v={fmt(order.tax)} />
                <div className="mt-2 flex items-center justify-between border-t border-border pt-3 font-medium">
                  <dt>Total</dt><dd>{fmt(order.total)}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="font-display text-lg">Ships to</h3>
              <p className="mt-2 text-sm text-muted-foreground">{order.address}</p>
              <Link to="/contact" className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-border px-4 py-2.5 text-sm hover:border-foreground">
                Need help with this order?
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{k}</dt><dd>{v}</dd>
    </div>
  );
}
