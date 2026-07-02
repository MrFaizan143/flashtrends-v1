// Storefront data layer — pulls all catalog, category, journal and settings
// data from Supabase and maps DB rows into the shapes the UI components
// (ProductCard, PDP, ProductListing, journal pages) already expect.
//
// Every hook is a React Query hook so caching, refetching and skeleton
// gating happen naturally. Admin edits show up on the storefront on next
// query invalidation / page load.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product, Category } from "./products";
import type { Article } from "./journal-articles";
import type { Tables } from "@/integrations/supabase/types";

type DBProduct = Tables<"products">;
type DBCategory = Tables<"categories">;
type DBArticle = Tables<"journal_articles">;
type DBReview = Tables<"reviews">;
type DBVariant = Tables<"product_variants">;

// -------- shape mappers --------

// The UI's `Category` is a string id ("fashion" | "beauty" | ...). We map
// DB category slugs to that shape and default to "lifestyle" as a safe
// fallback when a product has no linked category.
function toCategoryId(slug: string | null | undefined): Category {
  const allowed: Category[] = ["fashion", "beauty", "electronics", "home", "lifestyle"];
  return (allowed as string[]).includes(slug ?? "") ? (slug as Category) : "lifestyle";
}

export function mapProduct(row: DBProduct, categorySlug?: string | null): Product {
  const specs = Array.isArray(row.specs)
    ? (row.specs as Array<{ label: string; value: string }>).filter(
        (s) => s && typeof s.label === "string" && typeof s.value === "string",
      )
    : [];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? "",
    brand: row.brand ?? "",
    category: toCategoryId(categorySlug),
    price: Number(row.price),
    compareAt: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
    rating: Number(row.rating_avg ?? 0),
    reviewCount: row.rating_count ?? 0,
    stock: row.stock_quantity ?? 0,
    badges: row.badges ?? [],
    images: (row.images ?? []).filter(Boolean),
    description: row.description ?? "",
    specs,
  };
}

export function mapArticle(row: DBArticle): Article {
  const paragraphs = (row.body ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    slug: row.slug,
    cat: row.category ?? "Field notes",
    title: row.title,
    excerpt: row.excerpt ?? "",
    date: row.published_at
      ? new Date(row.published_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "",
    image: row.cover_image ?? "",
    author: {
      name: row.author_name ?? "FlashTrends",
      role: row.author_role ?? "Editor",
    },
    pullQuote: row.pull_quote ?? "",
    paragraphs,
  };
}

// -------- product queries --------

async function fetchProductsWithCategory(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(slug)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((p) =>
    mapProduct(p as DBProduct, (p as unknown as { categories: { slug: string } | null }).categories?.slug),
  );
}

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: fetchProductsWithCategory, staleTime: 60_000 });
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(slug)")
        .eq("is_featured", true)
        .order("rating_avg", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map((p) =>
        mapProduct(p as DBProduct, (p as unknown as { categories: { slug: string } | null }).categories?.slug),
      );
    },
    staleTime: 60_000,
  });
}

export function useProductsByCategorySlug(slug?: string) {
  return useQuery({
    queryKey: ["products", "byCategory", slug ?? "all"],
    queryFn: async () => {
      let q = supabase.from("products").select("*, categories!inner(slug)");
      if (slug) q = q.eq("categories.slug", slug);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((p) =>
        mapProduct(p as DBProduct, (p as unknown as { categories: { slug: string } | null }).categories?.slug),
      );
    },
    staleTime: 60_000,
    enabled: slug !== undefined,
  });
}

export type PDPData = {
  product: Product;
  variants: DBVariant[];
  reviews: DBReview[];
  related: Product[];
};

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async (): Promise<PDPData | null> => {
      const { data: prow, error } = await supabase
        .from("products")
        .select("*, categories(slug)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!prow) return null;
      const categorySlug = (prow as unknown as { categories: { slug: string } | null }).categories?.slug ?? null;
      const product = mapProduct(prow as DBProduct, categorySlug);

      const [{ data: vrows }, { data: rrows }, { data: rel }] = await Promise.all([
        supabase.from("product_variants").select("*").eq("product_id", prow.id),
        supabase.from("reviews").select("*").eq("product_id", prow.id).order("created_at", { ascending: false }),
        prow.category_id
          ? supabase
              .from("products")
              .select("*, categories(slug)")
              .eq("category_id", prow.category_id)
              .neq("id", prow.id)
              .limit(4)
          : Promise.resolve({ data: [] as DBProduct[] }),
      ]);

      return {
        product,
        variants: (vrows ?? []) as DBVariant[],
        reviews: (rrows ?? []) as DBReview[],
        related: ((rel ?? []) as DBProduct[]).map((p) =>
          mapProduct(p, (p as unknown as { categories: { slug: string } | null }).categories?.slug),
        ),
      };
    },
    staleTime: 60_000,
  });
}

// -------- categories --------

export type StorefrontCategory = {
  id: Category;
  label: string;
  blurb: string;
  image: string;
  slug: string;
  productCount: number;
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<StorefrontCategory[]> => {
      const [{ data: cats, error: e1 }, { data: prods, error: e2 }] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("products").select("category_id"),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      const counts = new Map<string, number>();
      for (const p of prods ?? []) {
        if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
      }
      return (cats ?? []).map((c: DBCategory) => ({
        id: toCategoryId(c.slug),
        slug: c.slug,
        label: c.name,
        blurb: c.description ?? "",
        image: c.image ?? "",
        productCount: counts.get(c.id) ?? 0,
      }));
    },
    staleTime: 60_000,
  });
}

// -------- journal --------

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: async (): Promise<Article[]> => {
      const { data, error } = await supabase
        .from("journal_articles")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapArticle);
    },
    staleTime: 60_000,
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async (): Promise<{ article: Article; related: Article[] } | null> => {
      const { data, error } = await supabase
        .from("journal_articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const article = mapArticle(data as DBArticle);

      const { data: rel } = await supabase
        .from("journal_articles")
        .select("*")
        .eq("published", true)
        .neq("slug", slug)
        .eq("category", (data as DBArticle).category ?? "")
        .order("published_at", { ascending: false })
        .limit(3);

      let related = (rel ?? []).map((r) => mapArticle(r as DBArticle));
      if (related.length < 3) {
        // Fill from other categories if not enough in-category matches
        const { data: filler } = await supabase
          .from("journal_articles")
          .select("*")
          .eq("published", true)
          .neq("slug", slug)
          .order("published_at", { ascending: false })
          .limit(3);
        const seen = new Set(related.map((r) => r.slug));
        for (const f of filler ?? []) {
          if (related.length >= 3) break;
          const a = mapArticle(f as DBArticle);
          if (!seen.has(a.slug)) related.push(a);
        }
      }

      return { article, related };
    },
    staleTime: 60_000,
  });
}

// -------- site settings --------

export type HeroSettings = {
  eyebrow: string;
  headline: string;
  subhead: string;
  cta_label: string;
  cta_href: string;
};
export type TickerSettings = { phrases: string[] };

const HERO_DEFAULT: HeroSettings = {
  eyebrow: "Spring edit · 2026",
  headline: "Considered things, made to outlast.",
  subhead:
    "A tightly curated edit of objects, garments and rituals — chosen for how they wear in, not how they wear out.",
  cta_label: "Browse the edit",
  cta_href: "/shop",
};
const TICKER_DEFAULT: TickerSettings = {
  phrases: [
    "New arrivals dropping weekly",
    "Free returns within 30 days",
    "Editor's pick: quiet essentials",
  ],
};

export function useSiteSetting<T = unknown>(key: string, fallback: T) {
  return useQuery({
    queryKey: ["site_setting", key],
    queryFn: async (): Promise<T> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      const v = (data?.value ?? null) as T | null;
      return v ?? fallback;
    },
    staleTime: 60_000,
  });
}

export function useHeroSettings() {
  return useSiteSetting<HeroSettings>("hero", HERO_DEFAULT);
}

export function useTickerSettings() {
  return useSiteSetting<TickerSettings>("trending_ticker", TICKER_DEFAULT);
}
