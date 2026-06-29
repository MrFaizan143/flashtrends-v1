import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Pencil, Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  ssr: false,
  component: AdminProducts,
  head: () => ({ meta: [{ title: "Products · Admin" }] }),
});

type Product = Tables<"products">;
type Category = Tables<"categories">;

function AdminProducts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  const cats = useQuery({
    queryKey: ["admin", "cats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data as Category[];
    },
  });

  const products = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product deleted");
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const filtered = (products.data ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())
  );

  return (
    <AdminShell title="Products">
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <input
          placeholder="Search by name or slug…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-background"
        >
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border/60">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.slug}</div>
                </td>
                <td>${Number(p.price).toFixed(0)}</td>
                <td className={p.stock_quantity < 5 ? "text-destructive" : ""}>{p.stock_quantity}</td>
                <td>{p.is_featured ? "✓" : ""}</td>
                <td className="text-right pr-4">
                  <button onClick={() => setEditing(p)} className="p-1.5 hover:bg-secondary rounded">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"?`)) del.mutate(p.id);
                    }}
                    className="p-1.5 hover:bg-secondary rounded text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                {products.isLoading ? "Loading…" : "No products."}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductEditor
          product={editing === "new" ? null : editing}
          categories={cats.data ?? []}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            qc.invalidateQueries({ queryKey: ["admin", "products"] });
          }}
        />
      )}
    </AdminShell>
  );
}

function ProductEditor({
  product, categories, onClose, onSaved,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    tagline: product?.tagline ?? "",
    brand: product?.brand ?? "",
    description: product?.description ?? "",
    price: String(product?.price ?? ""),
    compare_at_price: product?.compare_at_price ? String(product.compare_at_price) : "",
    category_id: product?.category_id ?? "",
    stock_quantity: String(product?.stock_quantity ?? 0),
    is_featured: product?.is_featured ?? false,
    images: (product?.images ?? []).join("\n"),
  });
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload: TablesInsert<"products"> = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        tagline: form.tagline || null,
        brand: form.brand || null,
        description: form.description || null,
        price: Number(form.price),
        compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
        category_id: form.category_id || null,
        stock_quantity: Number(form.stock_quantity),
        is_featured: form.is_featured,
        images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      const res = product
        ? await supabase.from("products").update(payload).eq("id", product.id)
        : await supabase.from("products").insert(payload);
      if (res.error) throw res.error;
      toast.success(product ? "Saved" : "Created");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl overflow-y-auto bg-background border-l border-border p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-display text-xl">{product ? "Edit product" : "New product"}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={save} className="space-y-4">
          <Field label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
          <Field label="Slug"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from name" className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price"><input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} /></Field>
            <Field label="Compare-at"><input type="number" step="0.01" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} className={inputCls} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stock"><input required type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} className={inputCls} /></Field>
            <Field label="Category">
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputCls}>
                <option value="">—</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Tagline"><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputCls} /></Field>
          <Field label="Brand"><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={inputCls} /></Field>
          <Field label="Description"><textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} /></Field>
          <Field label="Image URLs (one per line)">
            <textarea rows={3} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className={inputCls} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
            Featured on homepage
          </label>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={busy} className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background disabled:opacity-60">{busy ? "Saving…" : "Save"}</button>
            <button type="button" onClick={onClose} className="rounded-full border border-border px-5 py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls = "mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>;
}
