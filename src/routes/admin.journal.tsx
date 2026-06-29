import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Pencil, Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/admin/journal")({
  ssr: false,
  component: AdminJournal,
  head: () => ({ meta: [{ title: "Journal · Admin" }] }),
});

type Article = Tables<"journal_articles">;

function AdminJournal() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Article | "new" | null>(null);

  const articles = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("journal_articles").select("*").order("published_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data as Article[];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journal_articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Article deleted");
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
    },
  });

  return (
    <AdminShell title="Journal">
      <div className="mb-5">
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-background">
          <Plus className="h-4 w-4" /> New article
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr><th className="px-4 py-3">Title</th><th>Category</th><th>Published</th><th></th></tr>
          </thead>
          <tbody>
            {(articles.data ?? []).map((a) => (
              <tr key={a.id} className="border-b border-border/60">
                <td className="px-4 py-3">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.slug}</div>
                </td>
                <td className="text-muted-foreground">{a.category}</td>
                <td>{a.published ? "✓" : "—"}</td>
                <td className="text-right pr-4">
                  <button onClick={() => setEditing(a)} className="p-1.5 hover:bg-secondary rounded"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => { if (confirm("Delete article?")) del.mutate(a.id); }} className="p-1.5 hover:bg-secondary rounded text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {!articles.data?.length && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                {articles.isLoading ? "Loading…" : "No articles."}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ArticleEditor
          article={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); qc.invalidateQueries({ queryKey: ["admin", "articles"] }); }}
        />
      )}
    </AdminShell>
  );
}

function ArticleEditor({ article, onClose, onSaved }: { article: Article | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    excerpt: article?.excerpt ?? "",
    body: article?.body ?? "",
    cover_image: article?.cover_image ?? "",
    category: article?.category ?? "",
    author_name: article?.author_name ?? "",
    author_role: article?.author_role ?? "",
    pull_quote: article?.pull_quote ?? "",
    published: article?.published ?? false,
  });
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload: TablesInsert<"journal_articles"> = {
        ...form,
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        published_at: form.published ? (article?.published_at ?? new Date().toISOString()) : null,
      };
      const res = article
        ? await supabase.from("journal_articles").update(payload).eq("id", article.id)
        : await supabase.from("journal_articles").insert(payload);
      if (res.error) throw res.error;
      toast.success(article ? "Saved" : "Created");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl overflow-y-auto bg-background border-l border-border p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-display text-xl">{article ? "Edit article" : "New article"}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={save} className="space-y-4">
          <Field label="Title"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} /></Field>
          <Field label="Slug"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from title" className={inputCls} /></Field>
          <Field label="Excerpt"><textarea rows={2} value={form.excerpt ?? ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputCls} /></Field>
          <Field label="Body (separate paragraphs with blank lines)">
            <textarea rows={14} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required className={inputCls} />
          </Field>
          <Field label="Pull quote"><textarea rows={2} value={form.pull_quote ?? ""} onChange={(e) => setForm({ ...form, pull_quote: e.target.value })} className={inputCls} /></Field>
          <Field label="Cover image URL"><input value={form.cover_image ?? ""} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className={inputCls} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Category"><input value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} /></Field>
            <Field label="Author"><input value={form.author_name ?? ""} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className={inputCls} /></Field>
            <Field label="Author role"><input value={form.author_role ?? ""} onChange={(e) => setForm({ ...form, author_role: e.target.value })} className={inputCls} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
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
