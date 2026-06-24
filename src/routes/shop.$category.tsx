import { createFileRoute, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/atlas/Shell";
import { ProductListing } from "@/components/atlas/ProductListing";
import { byCategory, CATEGORIES, type Category } from "@/lib/products";

export const Route = createFileRoute("/shop/$category")({
  loader: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.id === params.category as Category);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.cat.label ?? "Shop"} — FlashTrends` },
      { name: "description", content: loaderData?.cat.blurb ?? "" },
      { property: "og:image", content: loaderData?.cat.image },
    ],
  }),
  notFoundComponent: () => <Shell><div className="mx-auto max-w-xl px-4 py-32 text-center"><h1 className="font-display text-4xl">Category not found</h1></div></Shell>,
  errorComponent: ({ reset }) => <Shell><div className="mx-auto max-w-xl px-4 py-32 text-center"><h1 className="font-display text-3xl">Something went wrong</h1><button onClick={reset} className="mt-4 rounded-full bg-foreground px-5 py-2.5 text-sm text-background">Retry</button></div></Shell>,
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const products = byCategory(cat.id);
  return (
    <Shell>
      <ProductListing title={cat.label} subtitle={cat.blurb} products={products} showCategoryFilter={false} />
    </Shell>
  );
}
