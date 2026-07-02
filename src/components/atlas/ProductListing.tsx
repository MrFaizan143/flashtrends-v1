import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "./EmptyState";
import type { Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/products";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

type Sort = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export function ProductListing({
  title,
  subtitle,
  products,
  showCategoryFilter = true,
  loading = false,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  showCategoryFilter?: boolean;
  loading?: boolean;
}) {

  const [sort, setSort] = useState<Sort>("featured");
  const [cats, setCats] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(1000);
  const [inStock, setInStock] = useState(false);

  const filtered = useMemo(() => {
    let r = [...products];
    if (cats.length) r = r.filter((p) => cats.includes(p.category));
    r = r.filter((p) => p.price <= priceMax);
    if (inStock) r = r.filter((p) => p.stock > 0);
    switch (sort) {
      case "price-asc": r.sort((a, b) => a.price - b.price); break;
      case "price-desc": r.sort((a, b) => b.price - a.price); break;
      case "rating": r.sort((a, b) => b.rating - a.rating); break;
      case "newest": r.sort((a, b) => (b.badges?.includes("New") ? 1 : 0) - (a.badges?.includes("New") ? 1 : 0)); break;
    }
    return r;
  }, [products, sort, cats, priceMax, inStock]);

  const FilterPanel = (
    <div className="space-y-8">
      {showCategoryFilter && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Category</p>
          <ul className="space-y-2">
            {CATEGORIES.map((c) => {
              const checked = cats.includes(c.id);
              return (
                <li key={c.id}>
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setCats((prev) => (checked ? prev.filter((x) => x !== c.id) : [...prev, c.id]))}
                      className="h-4 w-4 rounded border-border accent-[color:var(--clay)]"
                    />
                    {c.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Max price</p>
        <input type="range" min={20} max={1000} step={10} value={priceMax} onChange={(e) => setPriceMax(+e.target.value)} className="w-full accent-[color:var(--clay)]" />
        <p className="mt-2 text-sm text-muted-foreground">Up to ${priceMax}</p>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Availability</p>
        <label className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 rounded border-border accent-[color:var(--clay)]" />
          In stock only
        </label>
      </div>

      {(cats.length > 0 || priceMax < 1000 || inStock) && (
        <button onClick={() => { setCats([]); setPriceMax(1000); setInStock(false); }} className="inline-flex items-center gap-1 text-xs text-muted-foreground underline hover:text-foreground">
          <X size={12} /> Reset filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
      <div className="border-b border-border pb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{subtitle}</p>
        <h1 className="mt-3 font-display text-4xl font-light sm:text-5xl">{title}</h1>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">{FilterPanel}</div>
        </aside>

        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{filtered.length} item{filtered.length === 1 ? "" : "s"}</p>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm lg:hidden">
                    <SlidersHorizontal size={14} /> Filter
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-6">
                  <SheetHeader><SheetTitle className="font-display text-2xl">Filters</SheetTitle></SheetHeader>
                  <div className="mt-6">{FilterPanel}</div>
                </SheetContent>
              </Sheet>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-9 cursor-pointer appearance-none rounded-full border border-border bg-background pl-4 pr-9 text-sm outline-none focus:ring-2 focus:ring-[color:var(--clay)]/40"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="rating">Top rated</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                  <Skeleton className="mt-3 h-3 w-1/2" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                  <Skeleton className="mt-2 h-3 w-1/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                icon="search"
                eyebrow="Nothing matched"
                title="No pieces here, yet"
                description="Try clearing a filter or browsing another category — there's plenty more to see."
                action={
                  <button onClick={() => { setCats([]); setPriceMax(1000); setInStock(false); }} className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]">
                    Clear filters
                  </button>
                }
              />
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} index={i} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
