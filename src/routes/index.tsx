import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Award, ChevronLeft, ChevronRight, Gift, Sparkles, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Shell } from "@/components/atlas/Shell";
import { ProductCard } from "@/components/atlas/ProductCard";
import { TrendingTicker } from "@/components/atlas/TrendingTicker";
import { formatPrice, type Product } from "@/lib/products";
import { useMagnetic } from "@/lib/use-magnetic";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useArticles,
  useCategories,
  useFeaturedProducts,
  useHeroSettings,
  type StorefrontCategory,
} from "@/lib/storefront";
import type { Article } from "@/lib/journal-articles";


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
      <TrendingTicker />
      <Hero />
      <Marquee />
      <Bento />
      <Bestsellers />
      <ValueProps />
      <RewardsBanner />
      <UGCStrip />
      <JournalTeaser />
      <EmailCapture />
    </Shell>
  );
}


function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const { data: hero, isLoading } = useHeroSettings();
  const { data: featured } = useFeaturedProducts(1);

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

  const imgs = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=80",
  ];

  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const parallaxY = reduced ? 0 : progress * 60;

  // Split headline: "Considered things, made to outlast."
  // First clause stays upright, part after comma renders italic in clay.
  const headline = hero?.headline ?? "";
  const [h1, h2] = headline.includes(",")
    ? [headline.split(",")[0] + ",", headline.split(",").slice(1).join(",").trim()]
    : [headline, ""];

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
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{
                opacity,
                transform: `translate3d(0, ${parallaxY}px, 0) scale(${1.08 - opacity * 0.04})`,
                transition: "opacity 200ms linear",
              }}
            />
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/55" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-20 sm:px-6 sm:pb-24 lg:px-10 lg:pb-32">
          {isLoading ? (
            <>
              <Skeleton className="h-3 w-40 bg-white/20" />
              <Skeleton className="mt-6 h-24 w-[80%] max-w-[800px] bg-white/20" />
              <Skeleton className="mt-6 h-4 w-[60%] max-w-md bg-white/20" />
            </>
          ) : (
            <>
              <p className="hero-step text-[11px] uppercase tracking-[0.34em] text-white/85" style={{ animationDelay: "0ms" }}>
                {hero?.eyebrow}
              </p>
              <h1
                className="hero-step mt-5 -ml-1 max-w-[1100px] text-balance font-display font-light leading-[0.88] text-white sm:-ml-2 lg:-ml-4"
                style={{
                  animationDelay: "180ms",
                  fontSize: "clamp(3.25rem, 11vw, 11rem)",
                  letterSpacing: "-0.035em",
                }}
              >
                <span className="hero-glint" style={{ color: "#fff" }}>{h1}</span>
                {h2 && (
                  <>
                    <br />
                    <em className="font-normal italic text-[color:var(--clay-soft)]">{h2}</em>
                  </>
                )}
              </h1>
              <p className="hero-step mt-7 max-w-xl text-pretty text-base text-white/85 sm:text-lg" style={{ animationDelay: "520ms" }}>
                {hero?.subhead}
              </p>
              <div className="hero-step mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "1700ms" }}>
                <MagneticCTA label={hero?.cta_label ?? "Browse the edit"} href={hero?.cta_href ?? "/shop"} />
                <Link to="/shop/$category" params={{ category: "home" }} className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20">
                  Inside the home edit
                </Link>
              </div>
            </>
          )}
        </div>

        {featured?.[0] && <AsymmetricHeroCard product={featured[0]} />}

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-px w-10 bg-white/40" style={{ background: i / 2 <= progress + 0.05 ? "white" : undefined }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MagneticCTA({ label, href }: { label: string; href: string }) {
  const ref = useMagnetic<HTMLAnchorElement>(60, 0.22);
  return (
    <Link
      ref={ref}
      to={href}
      className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--clay)] px-6 py-3.5 text-sm font-medium text-[color:var(--accent-foreground)] transition-transform hover:scale-[1.02] will-change-transform"
    >
      {label}
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
    </Link>
  );
}


function AsymmetricHeroCard({ product }: { product: Product }) {
  return (
    <div
      className="hero-step pointer-events-none absolute right-2 top-[58%] z-20 hidden -translate-y-1/2 sm:right-4 md:block lg:right-8"
      style={{ animationDelay: "1000ms" }}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="pointer-events-auto group block w-[230px] origin-bottom-right rotate-[3.5deg] overflow-hidden rounded-2xl bg-background shadow-lift ring-1 ring-black/5 backdrop-blur transition-transform duration-500 hover:rotate-0 hover:-translate-y-1 lg:w-[260px]"
      >
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--clay)]">This week's hero</p>
            <p className="mt-0.5 truncate font-display text-sm text-foreground">{product.name}</p>
          </div>
          <span className="shrink-0 font-display text-sm text-foreground">{formatPrice(product.price)}</span>
        </div>
      </Link>
    </div>
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
  const { data: categories, isLoading } = useCategories();
  const { data: featured } = useFeaturedProducts(1);
  const hero = featured?.[0];

  const byId = (id: string): StorefrontCategory | undefined =>
    categories?.find((c) => c.id === id);

  const fashion = byId("fashion");
  const beauty = byId("beauty");
  const electronics = byId("electronics");
  const home = byId("home");

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

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[180px]">
          <Skeleton className="rounded-3xl min-h-[360px] sm:col-span-2 lg:row-span-3 lg:min-h-[560px]" />
          <Skeleton className="rounded-3xl min-h-[240px] lg:row-span-2" />
          <Skeleton className="rounded-3xl min-h-[180px]" />
          <Skeleton className="rounded-3xl min-h-[180px]" />
          <Skeleton className="rounded-3xl min-h-[180px] sm:col-span-2 lg:col-span-2" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[180px]">
          {fashion && (
            <Link to="/shop/$category" params={{ category: fashion.slug }} className="group relative overflow-hidden rounded-3xl bg-secondary sm:col-span-2 lg:row-span-3">
              <img src={fashion.image} alt="" className="h-full min-h-[360px] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105 lg:min-h-[560px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">{fashion.label}</p>
                <h3 className="mt-2 font-display text-3xl font-light text-white sm:text-4xl lg:text-5xl">Quiet luxury, in pieces you'll keep.</h3>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-white">Shop {fashion.label.toLowerCase()} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
              </div>
            </Link>
          )}

          {beauty && (
            <Link to="/shop/$category" params={{ category: beauty.slug }} className="group relative overflow-hidden rounded-3xl bg-secondary lg:row-span-2">
              <img src={beauty.image} alt="" className="h-full min-h-[240px] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">{beauty.label}</p>
                <h3 className="mt-1 font-display text-2xl text-white">Clean rituals</h3>
              </div>
            </Link>
          )}

          {hero && (
            <div className="relative overflow-hidden rounded-3xl bg-[color:var(--clay-soft)] p-6 min-h-[180px]">
              <Sparkles className="text-[color:var(--clay)]" size={18} />
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-foreground/70">This week's hero</p>
              <h3 className="mt-2 font-display text-xl text-foreground">{hero.name}</h3>
              <p className="mt-1 text-sm text-foreground/70">{formatPrice(hero.price)}</p>
              <Link to="/product/$slug" params={{ slug: hero.slug }} className="absolute bottom-4 right-4 inline-flex items-center gap-1 text-xs font-medium hover:text-[color:var(--clay)]">
                See it <ArrowRight size={12} />
              </Link>
            </div>
          )}

          {electronics && (
            <Link to="/shop/$category" params={{ category: electronics.slug }} className="group relative overflow-hidden rounded-3xl bg-secondary min-h-[180px]">
              <img src={electronics.image} alt="" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">{electronics.label}</p>
                <h3 className="mt-1 font-display text-xl text-white">Tools that last</h3>
              </div>
            </Link>
          )}

          {home && (
            <Link to="/shop/$category" params={{ category: home.slug }} className="group relative overflow-hidden rounded-3xl bg-secondary min-h-[180px] sm:col-span-2 lg:col-span-2">
              <img src={home.image} alt="" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">{home.label}</p>
                <h3 className="mt-1 font-display text-2xl text-white sm:text-3xl">Objects for slow living</h3>
              </div>
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

function Bestsellers() {
  const ref = useRef<HTMLDivElement | null>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  const { data: items = [], isLoading } = useFeaturedProducts(8);

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

        {isLoading ? (
          <div className="-mx-4 flex gap-4 overflow-hidden px-4 pb-2 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[72%] shrink-0 sm:w-[44%] md:w-[30%] lg:w-[23%]">
                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                <Skeleton className="mt-3 h-3 w-1/2" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:gap-6">
            {items.map((p, i) => (
              <div key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[44%] md:w-[30%] lg:w-[23%]">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        )}
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
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">@flashtrends</p>
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

function RewardsBanner() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-4 sm:px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-[color:var(--clay-soft)] px-6 py-12 sm:px-12 sm:py-16">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[color:var(--clay)]/25 blur-3xl" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--clay)]">
              <Award size={12} /> FlashTrends Rewards
            </span>
            <h2 className="mt-5 max-w-2xl text-balance font-display text-4xl font-light leading-[1.05] text-foreground sm:text-5xl">
              Earn on every order. <em className="font-normal italic text-[color:var(--clay)]">Redeem on the next.</em>
            </h2>
            <p className="mt-4 max-w-xl text-sm text-foreground/70 sm:text-base">
              One point per dollar. Free shipping at Silver. 1.5× points and 2-day delivery at Gold. No fees, no expiry, no fuss.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/rewards" className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]">
                Join Rewards <ArrowRight size={14} />
              </Link>
              <Link to="/rewards" className="text-sm font-medium text-foreground/70 hover:text-[color:var(--clay)]">
                See how it works
              </Link>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: Sparkles, title: "Member", body: "1× points, birthday surprise" },
              { icon: Award, title: "Silver · 500 pts", body: "Free shipping always, 1.25× points" },
              { icon: Gift, title: "Gold · 1,500 pts", body: "Free 2-day, 1.5× points, private restocks" },
            ].map((t) => (
              <li key={t.title} className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-4 backdrop-blur">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--clay)] text-[color:var(--accent-foreground)]">
                  <t.icon size={14} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function JournalTeaser() {
  const { data: articles, isLoading } = useArticles();
  const featured: Article[] = (articles ?? []).slice(0, 3);
  return (
    <section className="border-t border-border bg-secondary/30 py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">From the Journal</p>
            <h2 className="mt-3 font-display text-3xl font-light sm:text-4xl">Quiet writing on objects worth owning.</h2>
          </div>
          <Link to="/journal" className="hidden shrink-0 items-center gap-2 text-sm font-medium hover:text-[color:var(--clay)] sm:inline-flex">
            All articles <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                <Skeleton className="mt-4 h-3 w-24" />
                <Skeleton className="mt-3 h-6 w-3/4" />
                <Skeleton className="mt-3 h-3 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((a) => (
              <Link key={a.slug} to="/journal/$slug" params={{ slug: a.slug }} className="group block">
                <div className="overflow-hidden rounded-2xl bg-secondary">
                  <img src={a.image} alt={a.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[color:var(--clay)]">{a.cat}</p>
                <h3 className="mt-2 font-display text-xl leading-snug transition-colors group-hover:text-[color:var(--clay)] sm:text-2xl">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
                <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{a.date}</p>
              </Link>
            ))}
          </div>
        )}

        <Link to="/journal" className="mt-8 inline-flex items-center gap-1 text-sm font-medium hover:text-[color:var(--clay)] sm:hidden">
          All articles <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
