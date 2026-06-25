import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type WishlistCtx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
};

const Ctx = createContext<WishlistCtx | null>(null);
const KEY = "flashtrends-wishlist-v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch {}
  }, [ids]);

  const value = useMemo<WishlistCtx>(() => ({
    ids,
    has: (id) => ids.includes(id),
    toggle: (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
    remove: (id) => setIds((p) => p.filter((x) => x !== id)),
    clear: () => setIds([]),
    count: ids.length,
  }), [ids]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWishlist outside provider");
  return v;
}
