import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartLine = { product: Product; qty: number; variant?: string };

type CartCtx = {
  lines: CartLine[];
  open: boolean;
  bump: number;
  setOpen: (v: boolean) => void;
  add: (p: Product, variant?: string, qty?: number) => void;
  remove: (id: string, variant?: string) => void;
  setQty: (id: string, qty: number, variant?: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "atlas-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }, [lines]);

  const value = useMemo<CartCtx>(() => {
    const same = (l: CartLine, id: string, variant?: string) =>
      l.product.id === id && (l.variant ?? "") === (variant ?? "");
    return {
      lines, open, bump, setOpen,
      add: (p, variant, qty = 1) => {
        setLines((prev) => {
          const i = prev.findIndex((l) => same(l, p.id, variant));
          if (i >= 0) {
            const next = [...prev];
            next[i] = { ...next[i], qty: next[i].qty + qty };
            return next;
          }
          return [...prev, { product: p, variant, qty }];
        });
        setBump((b) => b + 1);
      },
      remove: (id, variant) => setLines((prev) => prev.filter((l) => !same(l, id, variant))),
      setQty: (id, qty, variant) =>
        setLines((prev) =>
          prev.flatMap((l) => (same(l, id, variant) ? (qty <= 0 ? [] : [{ ...l, qty }]) : [l]))
        ),
      clear: () => setLines([]),
      subtotal: lines.reduce((s, l) => s + l.product.price * l.qty, 0),
      count: lines.reduce((s, l) => s + l.qty, 0),
    };
  }, [lines, open, bump]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart outside provider");
  return v;
}
