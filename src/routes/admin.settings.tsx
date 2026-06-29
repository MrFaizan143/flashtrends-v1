import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  ssr: false,
  component: AdminSettings,
  head: () => ({ meta: [{ title: "Settings · Admin" }] }),
});

type Setting = Tables<"site_settings">;
type Tier = Tables<"loyalty_tiers">;

function AdminSettings() {
  const qc = useQueryClient();
  const settings = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data as Setting[];
    },
  });
  const tiers = useQuery({
    queryKey: ["admin", "tiers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("loyalty_tiers").select("*").order("sort_order");
      if (error) throw error;
      return data as Tier[];
    },
  });

  const map = Object.fromEntries((settings.data ?? []).map((s) => [s.key, s.value])) as Record<string, any>;

  async function saveSetting(key: string, value: any) {
    const { error } = await supabase.from("site_settings").upsert({ key, value });
    if (error) toast.error(error.message);
    else { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin", "settings"] }); }
  }

  async function saveTier(id: string, patch: Partial<Tier>) {
    const { error } = await supabase.from("loyalty_tiers").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Tier saved"); qc.invalidateQueries({ queryKey: ["admin", "tiers"] }); }
  }

  if (settings.isLoading || tiers.isLoading) {
    return <AdminShell title="Site settings"><div className="text-sm text-muted-foreground">Loading…</div></AdminShell>;
  }

  return (
    <AdminShell title="Site settings">
      <div className="space-y-6 max-w-3xl">
        <HeroBlock value={map.hero ?? {}} onSave={(v) => saveSetting("hero", v)} />
        <PromoBlock value={map.promo_banner ?? {}} onSave={(v) => saveSetting("promo_banner", v)} />
        <TickerBlock value={map.trending_ticker ?? { phrases: [] }} onSave={(v) => saveSetting("trending_ticker", v)} />
        <TiersBlock tiers={tiers.data ?? []} onSave={saveTier} />
      </div>
    </AdminShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display text-lg mb-4">{title}</h2>
      {children}
    </div>
  );
}

function HeroBlock({ value, onSave }: { value: any; onSave: (v: any) => void }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <Section title="Homepage hero">
      <div className="space-y-3">
        <Field label="Eyebrow"><input value={v.eyebrow ?? ""} onChange={(e) => setV({ ...v, eyebrow: e.target.value })} className={inputCls} /></Field>
        <Field label="Headline"><input value={v.headline ?? ""} onChange={(e) => setV({ ...v, headline: e.target.value })} className={inputCls} /></Field>
        <Field label="Subhead"><textarea rows={2} value={v.subhead ?? ""} onChange={(e) => setV({ ...v, subhead: e.target.value })} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="CTA label"><input value={v.cta_label ?? ""} onChange={(e) => setV({ ...v, cta_label: e.target.value })} className={inputCls} /></Field>
          <Field label="CTA href"><input value={v.cta_href ?? ""} onChange={(e) => setV({ ...v, cta_href: e.target.value })} className={inputCls} /></Field>
        </div>
        <button onClick={() => onSave(v)} className="mt-2 rounded-full bg-foreground px-5 py-2 text-sm text-background">Save hero</button>
      </div>
    </Section>
  );
}

function PromoBlock({ value, onSave }: { value: any; onSave: (v: any) => void }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <Section title="Promo banner">
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!v.enabled} onChange={(e) => setV({ ...v, enabled: e.target.checked })} />
          Enabled
        </label>
        <Field label="Text"><input value={v.text ?? ""} onChange={(e) => setV({ ...v, text: e.target.value })} className={inputCls} /></Field>
        <Field label="Link"><input value={v.href ?? ""} onChange={(e) => setV({ ...v, href: e.target.value })} className={inputCls} /></Field>
        <button onClick={() => onSave(v)} className="mt-2 rounded-full bg-foreground px-5 py-2 text-sm text-background">Save banner</button>
      </div>
    </Section>
  );
}

function TickerBlock({ value, onSave }: { value: any; onSave: (v: any) => void }) {
  const [phrases, setPhrases] = useState<string[]>(Array.isArray(value.phrases) ? value.phrases : []);
  useEffect(() => setPhrases(Array.isArray(value.phrases) ? value.phrases : []), [value]);
  return (
    <Section title="Trending ticker">
      <div className="space-y-2">
        {phrases.map((p, i) => (
          <div key={i} className="flex gap-2">
            <input value={p} onChange={(e) => { const n = [...phrases]; n[i] = e.target.value; setPhrases(n); }} className={`${inputCls} mt-0 flex-1`} />
            <button onClick={() => setPhrases(phrases.filter((_, j) => j !== i))} className="p-2 hover:bg-secondary rounded text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        <button onClick={() => setPhrases([...phrases, ""])} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><Plus className="h-4 w-4" /> Add phrase</button>
        <div><button onClick={() => onSave({ phrases: phrases.filter(Boolean) })} className="mt-2 rounded-full bg-foreground px-5 py-2 text-sm text-background">Save ticker</button></div>
      </div>
    </Section>
  );
}

function TiersBlock({ tiers, onSave }: { tiers: Tier[]; onSave: (id: string, patch: Partial<Tier>) => void }) {
  return (
    <Section title="Loyalty tiers">
      <div className="space-y-4">
        {tiers.map((t) => <TierRow key={t.id} tier={t} onSave={(patch) => onSave(t.id, patch)} />)}
      </div>
    </Section>
  );
}

function TierRow({ tier, onSave }: { tier: Tier; onSave: (patch: Partial<Tier>) => void }) {
  const [name, setName] = useState(tier.name);
  const [threshold, setThreshold] = useState(String(tier.threshold));
  const [mult, setMult] = useState(String(tier.points_multiplier));
  const [perks, setPerks] = useState(tier.perks.join("\n"));
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="grid grid-cols-3 gap-2">
        <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
        <Field label="Threshold"><input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} className={inputCls} /></Field>
        <Field label="Multiplier"><input type="number" step="0.01" value={mult} onChange={(e) => setMult(e.target.value)} className={inputCls} /></Field>
      </div>
      <Field label="Perks (one per line)"><textarea rows={3} value={perks} onChange={(e) => setPerks(e.target.value)} className={inputCls} /></Field>
      <button
        onClick={() => onSave({ name, threshold: Number(threshold), points_multiplier: Number(mult), perks: perks.split("\n").map((s) => s.trim()).filter(Boolean) })}
        className="mt-2 rounded-full bg-foreground px-4 py-1.5 text-xs text-background"
      >Save</button>
    </div>
  );
}

const inputCls = "mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>;
}
