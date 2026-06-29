import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { LayoutDashboard, Package, ShoppingBag, BookOpen, Settings, LogOut } from "lucide-react";
import { useIsAdmin } from "@/lib/use-admin";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/journal", label: "Journal", icon: BookOpen },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const { user, isAdmin, loading } = useIsAdmin();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="md:sticky md:top-0 md:h-dvh border-r border-border bg-card/30 p-5 flex flex-col gap-1">
          <Link to="/" className="font-display text-xl mb-6 text-foreground tracking-tight">
            FlashTrends <span className="text-[var(--spark,#d97706)]">·</span> Admin
          </Link>
          <nav className="flex flex-col gap-0.5">
            {NAV.map((n) => {
              const active = n.exact ? path === n.to : path.startsWith(n.to);
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "bg-foreground text-background" : "text-foreground/80 hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-6 text-xs text-muted-foreground">
            <div className="truncate mb-2">{user.email}</div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/admin/login", replace: true });
              }}
              className="flex items-center gap-2 text-foreground/70 hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </aside>
        <main className="p-6 md:p-10">
          <h1 className="font-display text-3xl text-foreground mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
