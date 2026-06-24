import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Shell } from "@/components/atlas/Shell";
import { ProductCard } from "@/components/atlas/ProductCard";
import { CATEGORIES, PRODUCTS, formatPrice } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlashTrends — Curated goods for considered living" },
      { name: "description", content: "Fashion, beauty, electronics, home and lifestyle — chosen with care, shipped fast." },
      { property: "og:title", content: "FlashTrends — Curated goods for considered living" },
      { property: "og:description", content: "A curated marketplace for the things you actually want." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <Shell>
      <Hero />
      <Marquee />
      <Bento />
      <Bestsellers />
      <ValueProps />
      <UGCStrip />
      <EmailCapture />
    </Shell>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollytelling: 3 images crossfade as user scrolls through pinned section
  const imgs = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=80",
  ];

  return (
    <section ref={ref} className="relative" style={{ height: "220vh" }} aria-label="Featured story">
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {imgs.map((src, i) => {
          const stops = [0, 0.5, 1];
          const dist = Math.abs(progress - stops[i]);
          const opacity = Math.max(0, 1 - dist * 2.4);
          return (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden={i !== 0}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity, transform: `scale(${1.04 - opacity * 0.04})`, transition: "opacity 200ms linear, transform 600ms ease-out" }}
            />
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/55" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10 lg:pb-28">
          <p className="reveal text-xs uppercase tracking-[0.32em] text-white/80">Fall edition · 2026</p>
          <h1 className="reveal mt-4 max-w-4xl text-balance font-display text-5xl font-light leading-[0.95] text-white sm:text-7xl lg:text-[7rem]" style={{ animationDelay: "0.08s" }}>
            Considered things,<br />
            <em className="font-normal italic text-[color:var(--clay-soft)]">made to outlast trends.</em>
          </h1>
          <p className="reveal mt-6 max-w-xl text-pretty text-base text-white/85 sm:text-lg" style={{ animationDelay: "0.16s" }}>
            One curated marketplace. Five categories. Goods worth keeping — from heirloom outerwear to clean skincare and tools built to last decades.
          </p>
          <div className="reveal mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.24s" }}>
            <Link to="/shop" className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--clay)] px-6 py-3.5 text-sm font-medium text-[color:var(--accent-foreground)] transition-transform hover:scale-[1.02]">
              Shop the edit
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/shop/home" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur hover:bg-white/20">
              Explore home
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-px w-10 bg-white/40" style={{ background: i / 2 <= progress + 0.05 ? "white" : undefined }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Free shipping over $150", "60-day returns", "Carbon-neutral delivery", "Hand-picked by editors", "Verified reviews only"];
  return (
    <div className="border-y border-border bg-secondary/40">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 text-xs uppercase tracking-[0.18em] text-muted-foreground sm:px-6">
        {items.map((t) => <span key={t}>{t}</span>)}
      </div>
    </div>
  );
}

function Bento() {
  // hero card + 5 small
  const hero = PRODUCTS[0];
  const small = [PRODUCTS[4], PRODUCTS[7], PRODUCTS[10], PRODUCTS[11], PRODUCTS[13]];
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Shop by category</p>
          <h2 className="mt-3 max-w-2xl text-balance font-display text-4xl font-light sm:text-5xl">Five worlds, one trusted address.</h2>
        </div>
        <Link to="/shop" className="hidden shrink-0 items-center gap-2 text-sm font-medium hover:text-[color:var(--clay)] sm:inline-flex">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[180px]">
        {/* Hero card */}
        <Link to="/shop/$category" params={{ category: "fashion" }} className="group relative col-span-1 row-span-1 overflow-hidden rounded-3xl bg-secondary md:col-span-2 md:row-span-3">
          <img src={CATEGORIES[0].image} alt="" className="h-full min-h-[420px] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">Fashion</p>
            <h3 className="mt-2 font-display text-3xl font-light text-white sm:text-5xl">Quiet luxury, in pieces you'll keep.</h3>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-white">Shop fashion <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
          </div>
        </Link>

        {/* Tall card */}
        <Link to="/shop/$category" params={{ category: "beauty" }} className="group relative overflow-hidden rounded-3xl bg-secondary md:col-span-1 md:row-span-2">
          <img src={CATEGORIES[1].image} alt="" className="h-full min-h-[260px] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">Beauty</p>
            <h3 className="mt-1 font-display text-2xl text-white">Clean rituals</h3>
          </div>
        </Link>

        {/* Featured product card */}
        <div className="relative overflow-hidden rounded-3xl bg-[color:var(--clay-soft)] p-6 md:col-span-1 md:row-span-1">
          <Sparkles className="text-[color:var(--clay)]" size={18} />
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-foreground/70">This week's hero</p>
          <h3 className="mt-2 font-display text-xl text-foreground">{hero.name}</h3>
          <p className="mt-1 text-sm text-foreground/70">{formatPrice(hero.price)}</p>
          <Link to="/product/$slug" params={{ slug: hero.slug }} className="absolute bottom-4 right-4 inline-flex items-center gap-1 text-xs font-medium hover:text-[color:var(--clay)]">
            See it <ArrowRight size={12} />
          </Link>
        </div>

        <Link to="/shop/$category" params={{ category: "electronics" }} className="group relative overflow-hidden rounded-3xl bg-secondary md:col-span-1 md:row-span-1">
          <img src={CATEGORIES[2].image} alt="" className="h-full min-h-[180px] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">Electronics</p>
            <h3 className="mt-1 font-display text-xl text-white">Tools that last</h3>
          </div>
        </Link>

        <Link to="/shop/$category" params={{ category: "home" }} className="group relative overflow-hidden rounded-3xl bg-secondary md:col-span-2 md:row-span-1">
          <img src={CATEGORIES[3].image} alt="" className="h-full min-h-[180px] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">Home</p>
            <h3 className="mt-1 font-display text-2xl text-white sm:text-3xl">Objects for slow living</h3>
          </div>
        </Link>
      </div>
    </section>
  );
}

function Bestsellers() {
  const ref = useRef<HTMLDivElement | null>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  const items = PRODUCTS.filter((p) => p.badges?.includes("Bestseller")).concat(PRODUCTS.slice(8, 14)).slice(0, 8);

  return (
    <section className="border-t border-border bg-secondary/30 py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Best sellers</p>
            <h2 className="mt-3 font-display text-3xl font-light sm:text-4xl">What everyone's loving</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll(-1)} aria-label="Scroll left" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background hover:bg-foreground hover:text-background"><ChevronLeft size={16} /></button>
            <button onClick={() => scroll(1)} aria-label="Scroll right" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background hover:bg-foreground hover:text-background"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:gap-6">
          {items.map((p) => (
            <div key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[44%] md:w-[30%] lg:w-[23%]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueProps() {
  const items = [
    { icon: Truck, title: "Free shipping over $150", body: "Carbon-neutral, delivered in 2–4 days." },
    { icon: RotateCcw, title: "60-day returns", body: "Free returns and exchanges, no fuss." },
    { icon: ShieldCheck, title: "Secure checkout", body: "Encrypted payments, buyer protection." },
    { icon: Sparkles, title: "Editor curated", body: "Every brand is vetted by our team." },
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i) => (
          <div key={i.title} className="rounded-2xl border border-border bg-card p-6">
            <i.icon size={20} className="text-[color:var(--clay)]" />
            <p className="mt-4 text-sm font-semibold">{i.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{i.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function UGCStrip() {
  const imgs = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80",
  ];
  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">@atlas</p>
          <h2 className="mt-3 font-display text-3xl font-light sm:text-4xl">As lived in by 240,000 readers</h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
          {imgs.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl bg-secondary">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmailCapture() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-14 text-background sm:px-12 sm:py-20">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[color:var(--clay)]/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-background/70">Stay in the loop</p>
          <h2 className="mt-3 font-display text-4xl font-light text-balance sm:text-5xl">First looks, last drops, no noise.</h2>
          <p className="mt-3 text-background/75">One email a week. Editor picks, restocks, and quiet sales. Unsubscribe any time.</p>
          <form className="mt-7 flex flex-col gap-2 sm:flex-row">
            <input type="email" placeholder="your@email.com" aria-label="Email" className="h-12 flex-1 rounded-full bg-background/10 px-5 text-sm text-background outline-none ring-1 ring-background/20 placeholder:text-background/50 focus:ring-2 focus:ring-[color:var(--clay)]" />
            <button className="h-12 rounded-full bg-[color:var(--clay)] px-7 text-sm font-medium text-[color:var(--accent-foreground)] transition-transform hover:scale-[1.02]">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
}
