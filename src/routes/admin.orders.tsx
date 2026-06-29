import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatPrice } from "@/lib/products";
import { toast } from "sonner";
import type { Tables, Enums } from "@/integrations/supabase/types";
import { X } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
  ssr: false,
  component: AdminOrders,
  head: () => ({ meta: [{ title: "Orders · Admin" }] }),
});

type Order = Tables<"orders">;
type OrderItem = Tables<"order_items">;
type Status = Enums<"order_status">;
const STATUSES: Status[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

function AdminOrders() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const orders = useQuery({
    queryKey: ["admin", "orders", filter],
    queryFn: async () => {
      let q = supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data as Order[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  return (
    <AdminShell title="Orders">
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-wider ${
              filter === s ? "bg-foreground text-background" : "bg-secondary text-foreground"
            }`}
          >{s}</button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-right pr-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {(orders.data ?? []).map((o) => (
              <tr key={o.id} className="border-b border-border/60 cursor-pointer hover:bg-secondary/40" onClick={() => setOpenId(o.id)}>
                <td className="px-4 py-3 font-medium">{o.order_number}</td>
                <td className="text-muted-foreground">{o.email}</td>
                <td>
                  <select
                    value={o.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => update.mutate({ id: o.id, status: e.target.value as Status })}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="text-right pr-4">{formatPrice(Number(o.total))}</td>
              </tr>
            ))}
            {!orders.data?.length && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                {orders.isLoading ? "Loading…" : "No orders."}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {openId && <OrderDetail id={openId} onClose={() => setOpenId(null)} />}
    </AdminShell>
  );
}

function OrderDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const order = useQuery({
    queryKey: ["admin", "order", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Order;
    },
  });
  const items = useQuery({
    queryKey: ["admin", "order-items", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("order_items").select("*").eq("order_id", id);
      if (error) throw error;
      return data as OrderItem[];
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-xl overflow-y-auto bg-background border-l border-border p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-display text-xl">Order {order.data?.order_number ?? "…"}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded"><X className="h-4 w-4" /></button>
        </div>
        {order.data && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <Info label="Email" value={order.data.email} />
              <Info label="Status" value={order.data.status} />
              <Info label="Subtotal" value={formatPrice(Number(order.data.subtotal))} />
              <Info label="Total" value={formatPrice(Number(order.data.total))} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Shipping</div>
              <pre className="rounded-lg bg-card border border-border p-3 text-xs overflow-x-auto">
                {JSON.stringify(order.data.shipping_address, null, 2)}
              </pre>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Items</div>
              <ul className="divide-y divide-border rounded-lg border border-border">
                {(items.data ?? []).map((it) => (
                  <li key={it.id} className="flex justify-between p-3">
                    <div>
                      <div className="font-medium">{it.product_name}</div>
                      {it.variant_label && <div className="text-xs text-muted-foreground">{it.variant_label}</div>}
                    </div>
                    <div className="text-right">
                      <div>{it.quantity} × {formatPrice(Number(it.unit_price))}</div>
                    </div>
                  </li>
                ))}
                {!items.data?.length && <li className="p-3 text-muted-foreground text-xs">No line items recorded.</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5">{value}</div>
    </div>
  );
}
