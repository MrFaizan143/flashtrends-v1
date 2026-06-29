import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Dashboard · Admin" }] }),
});

function AdminDashboard() {
  const orders = useQuery({
    queryKey: ["admin", "orders-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, total, email, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  const totals = useQuery({
    queryKey: ["admin", "totals"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("total, status");
      if (error) throw error;
      const revenue = (data ?? [])
        .filter((o) => o.status !== "cancelled")
        .reduce((s, o) => s + Number(o.total ?? 0), 0);
      return { count: data?.length ?? 0, revenue };
    },
  });

  const lowStock = useQuery({
    queryKey: ["admin", "low-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, stock_quantity")
        .lt("stock_quantity", 10)
        .order("stock_quantity", { ascending: true })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminShell title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Stat label="Orders" value={totals.data?.count ?? "—"} />
        <Stat label="Revenue" value={totals.data ? formatPrice(totals.data.revenue) : "—"} />
        <Stat label="Low-stock SKUs" value={lowStock.data?.length ?? "—"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent orders">
          {orders.data?.length ? (
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr><th className="py-2">Order</th><th>Email</th><th>Status</th><th className="text-right">Total</th></tr>
              </thead>
              <tbody>
                {orders.data.map((o) => (
                  <tr key={o.id} className="border-b border-border/60">
                    <td className="py-2">
                      <Link to="/admin/orders" className="hover:underline">{o.order_number}</Link>
                    </td>
                    <td className="text-muted-foreground">{o.email}</td>
                    <td><Badge>{o.status}</Badge></td>
                    <td className="text-right">{formatPrice(Number(o.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-sm text-muted-foreground">No orders yet.</p>}
        </Card>

        <Card title="Low stock">
          {lowStock.data?.length ? (
            <ul className="divide-y divide-border">
              {lowStock.data.map((p) => (
                <li key={p.id} className="flex justify-between py-2 text-sm">
                  <span>{p.name}</span>
                  <span className={p.stock_quantity < 5 ? "text-destructive font-medium" : "text-muted-foreground"}>{p.stock_quantity} left</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">Everything well stocked.</p>}
        </Card>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl">{value}</div>
    </div>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display text-lg mb-3">{title}</h2>
      {children}
    </div>
  );
}
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs">{children}</span>;
}
