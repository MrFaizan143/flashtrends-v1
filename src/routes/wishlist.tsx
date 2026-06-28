import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { ProductCard } from "@/components/atlas/ProductCard";
import { EmptyState } from "@/components/atlas/EmptyState";
import { PRODUCTS } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist-store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — FlashTrends" }, { name: "robots", content: "noindex" }] }),
  component: Wishlist,
});

function Wishlist() {
  const { ids, clear } = useWishlist();
  const items = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <Shell>
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Saved for later</p>
            <h1 className="mt-2 font-display text-4xl font-light sm:text-5xl">Your wishlist</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {items.length === 0 ? "Nothing saved yet." : `${items.length} ${items.length === 1 ? "piece" : "pieces"} you're keeping an eye on.`}
            </p>
          </div>
          {items.length > 0 && (
            <button onClick={clear} className="rounded-full border border-border px-4 py-2 text-xs hover:border-foreground">
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              icon="heart"
              eyebrow="Nothing saved yet"
              title="Your wishlist is waiting"
              description="Tap the heart on any piece to save it here — we'll keep it ready for when you are."
              action={
                <Link to="/shop" className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]">
                  Start browsing
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </Shell>
  );
}
