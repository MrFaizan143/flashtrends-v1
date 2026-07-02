import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { ProductListing } from "@/components/atlas/ProductListing";
import { useCategories, useProductsByCategorySlug } from "@/lib/storefront";

export const Route = createFileRoute("/shop/$category")({
  head: ({ params }) => ({
    meta: [{ title: `${params.category} — FlashTrends` }],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const { data: cats } = useCategories();
  const cat = cats?.find((c) => c.slug === category);
  const { data: products, isLoading } = useProductsByCategorySlug(category);
  return (
    <Shell>
      <ProductListing
        title={cat?.label ?? category}
        subtitle={cat?.blurb ?? ""}
        products={products ?? []}
        showCategoryFilter={false}
        loading={isLoading}
      />
    </Shell>
  );
}
