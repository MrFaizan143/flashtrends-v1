import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "../lib/cart-store";
import { WishlistProvider } from "../lib/wishlist-store";
import { ThemeProvider } from "../lib/theme";
import { Toaster } from "../components/ui/sonner";
import { Concierge } from "../components/atlas/Concierge";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">flashtrends</p>
        <h1 className="mt-4 font-display text-7xl font-light text-foreground">404</h1>
        <p className="mt-3 text-muted-foreground">This page wandered off the map.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]">
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-foreground">Something went sideways</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head back home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background">Try again</button>
          <a href="/" className="rounded-full border border-border px-5 py-2.5 text-sm">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#f7f4ee" },
      { title: "FlashTrends — Curated goods for considered living" },
      { name: "description", content: "FlashTrends is a curated marketplace for fashion, beauty, electronics, home, and lifestyle goods — chosen with care, shipped fast." },
      { property: "og:title", content: "FlashTrends — Curated goods for considered living" },
      { property: "og:description", content: "FlashTrends is a curated marketplace for fashion, beauty, electronics, home, and lifestyle goods — chosen with care, shipped fast." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FlashTrends — Curated goods for considered living" },
      { name: "twitter:description", content: "FlashTrends is a curated marketplace for fashion, beauty, electronics, home, and lifestyle goods — chosen with care, shipped fast." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/dt3atyy4qTWZ0PLyO7ayTGqxYhM2/social-images/social-1782356498116-IMG_20260502_173334_960.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/dt3atyy4qTWZ0PLyO7ayTGqxYhM2/social-images/social-1782356498116-IMG_20260502_173334_960.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>
            <Outlet />
            <Concierge />
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
