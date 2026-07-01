// Journal article type. All data flows from Supabase via `@/lib/storefront`.

export type Article = {
  slug: string;
  cat: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  author: { name: string; role: string };
  pullQuote: string;
  paragraphs: string[];
};
