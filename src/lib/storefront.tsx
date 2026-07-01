import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Product, Category } from "@/lib/products";
import type { Article } from "@/lib/journal-articles";

type DbProduct = Tables<"products">;
type DbCategory = Tables<"categories">;
type DbArticle = Tables<"journal_articles">;
type DbReview = Tables<"reviews">;

export type StoreCategory = {
  id: string;
  slug: Category;
  label: string;
  blurb: string;
  image: string;
};

/* ---------------- Mappers ---------------- */

export function mapProduct(row: DbProduct, categorySlug: string): Product {
  const specs = Array.isArray(row.specs)
    ? (row.specs as unknown as { label: string; value: string }[])
    : [];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? "",
    brand: row.brand ?? "",
    category: (categorySlug || "shop") as Category,
    price: Number(row.price),
    compareAt: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    rating: Number(row.rating_avg ?? 0),
    reviewCount: row.rating_count ?? 0,
    stock: row.stock_quantity ?? 0,
    badges: row.badges?.length ? row.badges : undefined,
    images: row.images?.length ? row.images : ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"],
    description: row.description ?? "",
    specs,
  };
}

export function mapCategory(row: DbCategory): StoreCategory {
  return {
    id: row.id,
    slug: row.slug,
    label: row.name,
    blurb: row.description ?? "",
    image: row.image ?? "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
  };
}

export function mapArticle(row: DbArticle): Article {
  const paragraphs = (row.body ?? "")
    .split(/\n\s*\n/g)
    .map((s) => s.trim())
    .filter(Boolean);
  const date = row.published_at
    ? new Date(row.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";
  return {
    slug: row.slug,
    cat: row.category ?? "Journal",
    title: row.title,
    excerpt: row.excerpt ?? "",
    date,
    image: row.cover_image ?? "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80",
    author: { name: row.author_name ?? "FlashTrends", role: row.author_role ?? "" },
    pullQuote: row.pull_quote ?? "",
    paragraphs,
  };
}

/* ---------------- Fetchers ---------------- */

async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return (data ?? []).map(mapCategory);
}

async function fetchProducts() {
  const [{ data: products, error }, cats] = await Promise.all([
    supabase.from("products").select("*").order("rating_avg", { ascending: false }),
    fetchCategories(),
  ]);
  if (error) throw error;
  const bySlug = new Map(cats.map((c) => [c.id, c.slug]));
  return (products ?? []).map((p) => mapProduct(p, bySlug.get(p.category_id ?? "") ?? ""));
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  let categorySlug = "";
  if (data.category_id) {
    const { data: cat } = await supabase.from("categories").select("slug").eq("id", data.category_id).maybeSingle();
    categorySlug = cat?.slug ?? "";
  }
  return mapProduct(data, categorySlug);
}

async function fetchProductsByCategorySlug(slug: string) {
  const { data: cat, error: cErr } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  if (cErr) throw cErr;
  if (!cat) return { category: null as StoreCategory | null, products: [] as Product[] };
  const { data, error } = await supabase.from("products").select("*").eq("category_id", cat.id).order("rating_avg", { ascending: false });
  if (error) throw error;
  const category = mapCategory(cat);
  return {
    category,
    products: (data ?? []).map((p) => mapProduct(p, category.slug)),
  };
}

async function fetchArticles(publishedOnly = true) {
  let q = supabase.from("journal_articles").select("*").order("published_at", { ascending: false, nullsFirst: false });
  if (publishedOnly) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(mapArticle);
}

async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase.from("journal_articles").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) throw error;
  return data ? mapArticle(data) : null;
}

async function fetchReviews(productId: string) {
  const { data, error } = await supabase.from("reviews").select("*").eq("product_id", productId).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbReview[];
}

async function fetchSiteSettings() {
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw error;
  const map: Record<string, any> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
}

/* ---------------- Hooks (React Query) ---------------- */

const STALE = 60_000;

export const useCategories = () =>
  useQuery({ queryKey: ["categories"], queryFn: fetchCategories, staleTime: STALE });

export const useProducts = () =>
  useQuery({ queryKey: ["products"], queryFn: fetchProducts, staleTime: STALE });

export const useProduct = (slug: string) =>
  useQuery({ queryKey: ["product", slug], queryFn: () => fetchProductBySlug(slug), staleTime: STALE, enabled: !!slug });

export const useCategoryProducts = (slug: string) =>
  useQuery({ queryKey: ["category-products", slug], queryFn: () => fetchProductsByCategorySlug(slug), staleTime: STALE, enabled: !!slug });

export const useArticles = () =>
  useQuery({ queryKey: ["articles"], queryFn: () => fetchArticles(true), staleTime: STALE });

export const useArticle = (slug: string) =>
  useQuery({ queryKey: ["article", slug], queryFn: () => fetchArticleBySlug(slug), staleTime: STALE, enabled: !!slug });

export const useReviews = (productId: string | undefined) =>
  useQuery({ queryKey: ["reviews", productId], queryFn: () => fetchReviews(productId!), staleTime: STALE, enabled: !!productId });

export const useSiteSettings = () =>
  useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings, staleTime: STALE });

/* ---------------- Skeleton primitive ---------------- */

export function Skel({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-secondary/70 ${className}`} aria-hidden />;
}
