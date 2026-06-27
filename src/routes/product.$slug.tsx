import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Shell } from "@/components/atlas/Shell";
import { ProductCard } from "@/components/atlas/ProductCard";
import { Rating } from "@/components/atlas/Rating";
import { findProduct, formatPrice, PRODUCTS, REVIEWS, RATING_DISTRIBUTION } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { useMagnetic } from "@/lib/use-magnetic";
import { flyToCart } from "@/lib/fly-to-cart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeCheck, ChevronRight, Heart, Lock, Minus, Plus, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";


export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = findProduct(params.slug);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.product.name} — FlashTrends` : "Product" },
      { name: "description", content: loaderData?.product.description ?? "" },
      { property: "og:title", content: loaderData?.product.name },
      { property: "og:description", content: loaderData?.product.description ?? "" },
      { property: "og:image", content: loaderData?.product.images[0] },
    ],
  }),
  notFoundComponent: () => <Shell><div className="mx-auto max-w-xl px-4 py-32 text-center"><h1 className="font-display text-4xl">Product not found</h1></div></Shell>,
  errorComponent: ({ reset }) => <Shell><div className="mx-auto max-w-xl px-4 py-32 text-center"><h1 className="font-display text-3xl">Something went wrong</h1><button onClick={reset} className="mt-4 rounded-full bg-foreground px-5 py-2.5 text-sm text-background">Retry</button></div></Shell>,
  component: PDP,
});

function PDP() {
  const data = Route.useLoaderData() as { product: import("@/lib/products").Product };
  const { product } = data;
  const { add, setOpen } = useCart();
  const [variant, setVariant] = useState<string | undefined>(product.variants?.options[0]);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const buyBtnRef = useMagnetic<HTMLButtonElement>(60, 0.22);

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const fbt = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
  const fbtTotal = fbt.reduce((s, p) => s + p.price, product.price);

  const addToCart = () => {
    flyToCart({ src: product.images[active], from: galleryRef.current });
    add(product, variant, qty);
    setOpen(true);
    toast.success(`${product.name} added to cart`);
  };


  return (
    <Shell>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop/$category" params={{ category: product.category }} className="capitalize hover:text-foreground">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Sticky gallery */}
          <div>
            <div className="grid gap-3">
              <div
                ref={galleryRef}
                className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary"
              >
                {product.images.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={i === active ? product.name : ""}
                    aria-hidden={i !== active}
                    style={
                      i === active
                        ? { viewTransitionName: `product-${product.slug}` }
                        : undefined
                    }
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                      i === active ? "opacity-100 ken-burns" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`overflow-hidden rounded-xl border transition ${active === i ? "border-foreground" : "border-border"}`}
                  >
                    <img src={src} alt="" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>


          {/* Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{product.brand}</p>
            <h1 className="mt-2 font-display text-3xl font-light leading-tight sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-base text-muted-foreground">{product.tagline}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              <Rating value={product.rating} />
              <span className="text-sm text-muted-foreground">{product.rating} · {product.reviewCount.toLocaleString()} reviews</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--clay-soft)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[color:var(--clay)]">
                <BadgeCheck size={10} /> Verified
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl">{formatPrice(product.price)}</span>
              {product.compareAt && <span className="text-base text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>}
              {product.compareAt && <span className="rounded-full bg-[color:var(--clay-soft)] px-2 py-0.5 text-xs font-semibold text-[color:var(--clay)]">Save {formatPrice(product.compareAt - product.price)}</span>}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Tax included. Shipping calculated at checkout.</p>

            {product.variants && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{product.variants.label}: <span className="text-muted-foreground">{variant}</span></p>
                  <button className="text-xs text-muted-foreground underline">Size guide</button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.options.map((o) => (
                    <button
                      key={o}
                      onClick={() => setVariant(o)}
                      className={`h-11 min-w-[44px] rounded-full border px-4 text-sm transition ${variant === o ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-xs">
              <span className={`relative inline-flex h-2 w-2 rounded-full ${product.stock < 10 ? "bg-[color:var(--clay)]" : "bg-emerald-600"}`}>
                <span className={`absolute inset-0 animate-ping rounded-full opacity-60 ${product.stock < 10 ? "bg-[color:var(--clay)]" : "bg-emerald-600"}`} />
              </span>
              <span className={product.stock < 10 ? "font-medium text-[color:var(--clay)]" : "text-foreground"}>
                {product.stock < 10 ? `Only ${product.stock} left` : "In stock"}
              </span>
              <span className="text-muted-foreground">· Ships today on orders before 3pm</span>
            </div>


            <div className="mt-6 flex items-stretch gap-3">
              <div className="inline-flex items-center rounded-full border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease" className="grid h-12 w-12 place-items-center"><Minus size={16} /></button>
                <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                <button onClick={() => setQty(qty + 1)} aria-label="Increase" className="grid h-12 w-12 place-items-center"><Plus size={16} /></button>
              </div>
              <button
                ref={buyBtnRef}
                onClick={addToCart}
                className="flex-1 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform hover:scale-[1.01] will-change-transform"
              >
                Add to bag · {formatPrice(product.price * qty)}
              </button>

              <button aria-label="Add to wishlist" className="grid h-12 w-12 place-items-center rounded-full border border-border hover:border-foreground">
                <Heart size={16} />
              </button>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Lock size={11} /> Secure checkout · Free 60-day returns · No questions asked
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-border bg-secondary/40 p-4 text-center">
              {[
                { icon: Truck, label: "Free shipping", sub: "Over $150" },
                { icon: RotateCcw, label: "60-day returns", sub: "Free & easy" },
                { icon: ShieldCheck, label: "Secure pay", sub: "256-bit SSL" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-1">
                  <t.icon size={16} className="text-[color:var(--clay)]" />
                  <p className="text-xs font-medium">{t.label}</p>
                  <p className="text-[10px] text-muted-foreground">{t.sub}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="desc" className="mt-10">
              <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
                <TabsTrigger value="desc" className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pr-6 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">Description</TabsTrigger>
                <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pr-6 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">Specs</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pr-6 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="desc" className="pt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</TabsContent>
              <TabsContent value="specs" className="pt-5">
                <dl className="divide-y divide-border">
                  {product.specs.map((s) => (
                    <div key={s.label} className="flex items-center justify-between py-3 text-sm">
                      <dt className="text-muted-foreground">{s.label}</dt>
                      <dd className="font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </TabsContent>
              <TabsContent value="reviews" className="pt-5">
                <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
                  <div>
                    <p className="font-display text-4xl">{product.rating}</p>
                    <Rating value={product.rating} />
                    <p className="mt-1 text-xs text-muted-foreground">{product.reviewCount} reviews</p>
                  </div>
                  <ul className="space-y-1.5">
                    {RATING_DISTRIBUTION.map((d) => (
                      <li key={d.stars} className="flex items-center gap-3 text-xs">
                        <span className="w-3 text-muted-foreground">{d.stars}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                          <div className="h-full bg-[color:var(--clay)]" style={{ width: `${d.pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-muted-foreground">{d.pct}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className="mt-8 space-y-6">
                  {REVIEWS.map((r) => (
                    <li key={r.id} className="border-t border-border pt-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><Rating value={r.rating} /><p className="text-sm font-medium">{r.title}</p></div>
                        <span className="text-xs text-muted-foreground">{r.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{r.author}{r.verified && " · Verified buyer"}</p>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* FBT */}
        <section className="mt-24 border-t border-border pt-16">
          <h2 className="font-display text-2xl sm:text-3xl">Frequently bought together</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px] lg:items-center">
            <div className="flex flex-wrap items-center gap-4">
              {fbt.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <Link to="/product/$slug" params={{ slug: p.slug }} className="group block">
                    <div className="h-28 w-28 overflow-hidden rounded-2xl bg-secondary">
                      <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <p className="mt-2 max-w-[112px] truncate text-xs">{p.name}</p>
                  </Link>
                  {i < fbt.length - 1 && <Plus size={16} className="text-muted-foreground" />}
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-border p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Bundle total</p>
              <p className="mt-1 font-display text-2xl">{formatPrice(fbtTotal)}</p>
              <button onClick={() => { fbt.forEach((p) => add(p)); add(product); setOpen(true); }} className="mt-4 w-full rounded-full bg-foreground py-3 text-sm text-background">Add all to bag</button>
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="mt-24 border-t border-border pt-16">
          <h2 className="font-display text-2xl sm:text-3xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>

      {/* Sticky mobile add-to-cart */}
      <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <button onClick={addToCart} className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background">
          Add to bag · {formatPrice(product.price * qty)}
        </button>
        <p className="mt-1.5 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <Lock size={10} /> Secure checkout · 60-day free returns
        </p>
      </div>
    </Shell>
  );
}
