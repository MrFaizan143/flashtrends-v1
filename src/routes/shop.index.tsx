import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { ProductListing } from "@/components/atlas/ProductListing";
import { TrendingTicker } from "@/components/atlas/TrendingTicker";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop everything — FlashTrends" },
      { name: "description", content: "Browse all curated goods across fashion, beauty, electronics, home and lifestyle." },
    ],
  }),
  component: () => (
    <Shell>
      <TrendingTicker />
      <ProductListing title="The full edit" subtitle="Everything in one address" products={PRODUCTS} />
    </Shell>
  ),
});
