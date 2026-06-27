import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-store";
import { formatPrice, PRODUCTS } from "@/lib/products";
import { Lock, Minus, Plus, RotateCcw, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Progress } from "@/components/ui/progress";
import { useAnimatedNumber } from "@/lib/use-animated-number";


const FREE_SHIP_THRESHOLD = 150;

export function CartDrawer() {
  const { open, setOpen, lines, setQty, remove, subtotal, add } = useCart();
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const upsell = PRODUCTS.find((p) => p.id === "p14" && !lines.some((l) => l.product.id === p.id))
    ?? PRODUCTS.find((p) => !lines.some((l) => l.product.id === p.id))!;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle className="font-display text-xl font-medium">Your bag</SheetTitle>
          <div className="mt-3">
            {remaining > 0 ? (
              <p className="text-xs text-muted-foreground">
                Add <span className="font-semibold text-foreground">{formatPrice(remaining)}</span> for free shipping
              </p>
            ) : (
              <p className="text-xs font-medium text-[color:var(--clay)]">You've unlocked free shipping</p>
            )}
            <Progress value={Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100)} className="mt-2 h-1.5" />
          </div>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-display text-2xl text-foreground">Your bag is empty</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">Browse the latest arrivals and pieces our editors are loving.</p>
            <Link to="/shop" onClick={() => setOpen(false)} className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm text-background">Shop now</Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="divide-y divide-border">
              {lines.map((l) => (
                <li key={l.product.id + (l.variant ?? "")} className="flex gap-4 py-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <img src={l.product.images[0]} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{l.product.name}</p>
                        <p className="text-xs text-muted-foreground">{l.product.brand}{l.variant ? ` · ${l.variant}` : ""}</p>
                      </div>
                      <button onClick={() => remove(l.product.id, l.variant)} aria-label="Remove" className="text-muted-foreground hover:text-foreground">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button onClick={() => setQty(l.product.id, l.qty - 1, l.variant)} className="grid h-8 w-8 place-items-center" aria-label="Decrease"><Minus size={14} /></button>
                        <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                        <button onClick={() => setQty(l.product.id, l.qty + 1, l.variant)} className="grid h-8 w-8 place-items-center" aria-label="Increase"><Plus size={14} /></button>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(l.product.price * l.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">You may also like</p>
              <div className="mt-3 flex items-center gap-3">
                <img src={upsell.images[0]} alt="" className="h-16 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{upsell.name}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(upsell.price)}</p>
                </div>
                <button
                  onClick={() => add(upsell)}
                  className="rounded-full border border-foreground px-3 py-1.5 text-xs font-medium transition hover:bg-foreground hover:text-background"
                >Add</button>
              </div>
            </div>
          </div>
        )}

        {lines.length > 0 && (
          <div className="border-t border-border bg-background px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Tax and shipping calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={() => setOpen(false)}
              className="mt-4 flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-foreground text-sm font-medium text-background transition-transform hover:scale-[1.01]"
            >
              <Lock size={13} /> Secure checkout · {formatPrice(subtotal)}
            </Link>
            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><RotateCcw size={11} /> Free 60-day returns</span>
              <span className="inline-flex items-center gap-1">256-bit SSL · Encrypted</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
