// Types + formatters. All data now flows from Supabase via `@/lib/storefront`.

export type Category = string;

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  brand: string;
  category: Category; // category slug
  price: number;
  compareAt?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  badges?: string[];
  variants?: { label: string; options: string[] };
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
};

export const RATING_DISTRIBUTION = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 16 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
