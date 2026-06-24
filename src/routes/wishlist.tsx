import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { ProductCard } from "@/components/atlas/ProductCard";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Atlas" }, { name: "robots", content: "noindex" }] }),
  component: Wishlist,
});

function Wishlist() {
  const items = PRODUCTS.slice(0, 6);
  return (
    <Shell>
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Saved for later</p>
        <h1 className="mt-2 font-display text-4xl font-light sm:text-5xl">Your wishlist</h1>
        <p className="mt-3 text-sm text-muted-foreground">{items.length} pieces you're keeping an eye on.</p>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </Shell>
  );
}
