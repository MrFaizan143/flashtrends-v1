import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { ProductListing } from "@/components/atlas/ProductListing";
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
      <ProductListing title="Shop everything" subtitle="The full FlashTrends edit" products={PRODUCTS} />
    </Shell>
  ),
});
