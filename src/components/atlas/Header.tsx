import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useTheme } from "@/lib/theme";
import { CATEGORIES } from "@/lib/products";

export function Header() {
  const { count, setOpen, bump } = useCart();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bumping, setBumping] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [path]);
  useEffect(() => {
    if (bump === 0) return;
    setBumping(true);
    const t = setTimeout(() => setBumping(false), 500);
    return () => clearTimeout(t);
  }, [bump]);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${
        scrolled ? "border-border/60 bg-background/85 py-2 backdrop-blur-xl" : "border-transparent bg-background/60 py-4 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-10">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary md:hidden"
          aria-label="Menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link to="/" className="font-display text-2xl font-medium tracking-tight">FlashTrends</Link>

        <nav className="ml-8 hidden items-center gap-7 md:flex" aria-label="Primary">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/shop/$category"
              params={{ category: c.id }}
              className="group relative text-sm text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {c.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link to="/shop" aria-label="Search" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary">
            <Search size={18} />
          </Link>
          <button onClick={toggle} aria-label="Toggle theme" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/account" aria-label="Account" className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-secondary sm:inline-flex">
            <User size={18} />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-secondary sm:inline-flex">
            <Heart size={18} />
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label={`Cart (${count} items)`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
          >
            <span className={bumping ? "animate-cart-bump inline-flex" : "inline-flex"}>
              <ShoppingBag size={18} />
            </span>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[color:var(--clay)] px-1 text-[10px] font-semibold text-[color:var(--accent-foreground)]">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border/60 bg-background px-4 py-4 md:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to="/shop/$category" params={{ category: c.id }} className="block rounded-lg px-3 py-3 text-base hover:bg-secondary">
                  {c.label}
                </Link>
              </li>
            ))}
            <li><Link to="/account" className="block rounded-lg px-3 py-3 text-base hover:bg-secondary">Account</Link></li>
            <li><Link to="/wishlist" className="block rounded-lg px-3 py-3 text-base hover:bg-secondary">Wishlist</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
