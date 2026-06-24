import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <p className="font-display text-3xl">Atlas</p>
            <p className="mt-3 text-sm text-muted-foreground">
              A curated marketplace for the things you actually want — across fashion, beauty, home and beyond.
            </p>
            <form className="mt-6 flex items-center gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email"
                className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-[color:var(--clay)]/40"
              />
              <button className="h-11 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-transform hover:scale-[1.02]">
                Join
              </button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">10% off your first order. Unsubscribe any time.</p>
          </div>
          {[
            { title: "Shop", links: [["New", "/shop"], ["Fashion", "/shop/fashion"], ["Beauty", "/shop/beauty"], ["Home", "/shop/home"]] },
            { title: "Help", links: [["Shipping", "/"], ["Returns", "/"], ["Contact", "/"], ["Order status", "/account"]] },
            { title: "Company", links: [["Our story", "/"], ["Journal", "/"], ["Sustainability", "/"], ["Careers", "/"]] },
            { title: "Legal", links: [["Terms", "/"], ["Privacy", "/"], ["Cookies", "/"], ["Accessibility", "/"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Atlas. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="text-[10px] uppercase tracking-widest">Secure checkout</span>
              <div className="flex items-center gap-1.5">
                {["VISA", "MC", "AMEX", "PAY"].map((b) => (
                  <span key={b} className="rounded-md border border-border bg-background px-2 py-1 text-[10px] font-semibold tracking-wider text-foreground/70">{b}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="#" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-background"><Instagram size={16} /></a>
              <a href="#" aria-label="Twitter" className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-background"><Twitter size={16} /></a>
              <a href="#" aria-label="YouTube" className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-background"><Youtube size={16} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
