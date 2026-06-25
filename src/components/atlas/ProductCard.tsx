import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { Rating } from "./Rating";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useReveal } from "@/lib/use-reveal";
import { toast } from "sonner";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { add, setOpen } = useCart();
  const { has, toggle } = useWishlist();
  const saved = has(product.id);
  const { ref, visible } = useReveal<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      to="/product/$slug"
      params={{ slug: product.slug }}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 600ms cubic-bezier(0.2,0.7,0.2,1), transform 600ms cubic-bezier(0.2,0.7,0.2,1)",
      }}
      className="group relative block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
        <img
          src={product.images[0]}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {product.badges?.[0] && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground backdrop-blur">
            {product.badges[0]}
          </span>
        )}
        {product.compareAt && (
          <span className="absolute right-3 top-3 rounded-full bg-[color:var(--clay)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--accent-foreground)]">
            Save {formatPrice(product.compareAt - product.price)}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
            toast.success(saved ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
          }}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all ${saved ? "bg-[color:var(--clay)] text-[color:var(--accent-foreground)]" : "bg-background/80 text-foreground hover:bg-background"} ${product.compareAt ? "top-12" : ""}`}
        >
          <Heart size={15} fill={saved ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            add(product);
            setOpen(true);
            toast.success(`${product.name} added to cart`);
          }}
          aria-label={`Quick add ${product.name}`}
          className="absolute bottom-3 right-3 inline-flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-foreground text-background opacity-0 shadow-soft transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110 focus-visible:translate-y-0 focus-visible:opacity-100"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{product.brand}</p>
          <h3 className="mt-1 truncate text-sm font-medium text-foreground">{product.name}</h3>
          <div className="mt-1 flex items-center gap-1.5">
            <Rating value={product.rating} size={12} />
            <span className="text-[11px] text-muted-foreground">({product.reviewCount})</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</p>
          {product.compareAt && (
            <p className="text-[11px] text-muted-foreground line-through">{formatPrice(product.compareAt)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
