import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send, Plus, Sparkle } from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Help me find a gift under $50",
  "What's trending in home right now?",
  "What pairs well with a linen shirt?",
  "Compare your two best serums",
];

const transport = new DefaultChatTransport({ api: "/api/chat" });

const TOKEN_RE = /\[\[p:([a-z0-9-]+)\]\]/gi;

function getTextFromMessage(m: UIMessage): string {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
}

type Segment = { type: "text"; value: string } | { type: "product"; product: Product };

function parseMessage(text: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN_RE)) {
    const idx = match.index ?? 0;
    if (idx > last) out.push({ type: "text", value: text.slice(last, idx) });
    const product = PRODUCTS.find((p) => p.slug === match[1].toLowerCase());
    if (product) out.push({ type: "product", product });
    last = idx + match[0].length;
  }
  if (last < text.length) out.push({ type: "text", value: text.slice(last) });
  return out;
}

function MiniProductCard({ product }: { product: Product }) {
  const cart = useCart();
  return (
    <div className="my-2 flex gap-3 rounded-2xl border border-border bg-card p-2.5 transition-colors hover:border-foreground/20">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block size-16 shrink-0 overflow-hidden rounded-xl bg-muted"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="min-w-0">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="block truncate text-sm font-medium text-foreground hover:underline"
          >
            {product.name}
          </Link>
          <p className="truncate text-xs text-muted-foreground">{product.brand}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm tabular-nums text-foreground">${product.price}</span>
          <button
            type="button"
            onClick={() => cart.add(product)}
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-background transition-transform hover:scale-[1.03]"
          >
            <Plus className="size-3" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const text = getTextFromMessage(message);
  const segments = useMemo(() => parseMessage(text), [text]);
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-sm text-background">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-clay-soft text-clay">
        <Sparkle className="size-3.5" />
      </div>
      <div className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">
        {segments.map((seg, i) =>
          seg.type === "text" ? (
            <span key={i} className="whitespace-pre-wrap">{seg.value}</span>
          ) : (
            <MiniProductCard key={i} product={seg.product} />
          ),
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2" aria-live="polite" aria-label="Concierge is thinking">
      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-clay-soft text-clay">
        <Sparkle className="size-3.5" />
      </div>
      <div className="flex items-center gap-1 py-2">
        <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:-200ms]" />
        <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:-100ms]" />
        <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}

export function Concierge() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError: (e) => console.error("Concierge error:", e),
  });

  const busy = status === "submitted" || status === "streaming";

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    void sendMessage({ text: value });
    setInput("");
  };

  return (
    <>
      {/* Launcher — positioned above mobile PDP sticky bar */}
      <button
        type="button"
        aria-label={open ? "Close shopping concierge" : "Open shopping concierge"}
        aria-expanded={open}
        aria-controls="atlas-concierge-panel"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed z-40 flex size-14 items-center justify-center rounded-full bg-clay text-[oklch(0.99_0.005_80)] shadow-[0_10px_30px_-10px_oklch(0.58_0.135_38_/_0.55)] transition-all duration-200 motion-reduce:transition-none",
          "right-4 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] sm:right-5 lg:bottom-6",
          "hover:scale-105 active:scale-95 motion-reduce:hover:scale-100",
          open && "scale-90 opacity-0 pointer-events-none",
        )}
      >
        <MessageCircle className="size-6" />
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed inset-0 z-50 lg:inset-auto lg:bottom-6 lg:right-6"
          role="dialog"
          aria-modal="false"
          aria-labelledby="atlas-concierge-title"
          id="atlas-concierge-panel"
        >
          {/* Mobile scrim */}
          <button
            type="button"
            aria-label="Close concierge"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm lg:hidden motion-reduce:backdrop-blur-none"
          />

          <section
            aria-label="FlashTrends Concierge"
            className={cn(
              "absolute flex flex-col overflow-hidden border border-border bg-card shadow-2xl",
              "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-3xl pb-[env(safe-area-inset-bottom)]",
              "lg:inset-auto lg:bottom-0 lg:right-0 lg:h-[640px] lg:max-h-[80dvh] lg:w-[400px] lg:rounded-3xl lg:pb-0",
              "animate-in slide-in-from-bottom-4 duration-200 motion-reduce:animate-none",
            )}
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-clay-soft text-clay">
                  <Sparkle className="size-4" />
                </span>
                <div>
                  <h2
                    id="atlas-concierge-title"
                    className="font-display text-base leading-tight text-foreground"
                  >
                    FlashTrends Concierge
                  </h2>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Personal shopping, in real time
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close concierge"
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </header>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.length === 0 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="font-display text-xl leading-snug text-foreground">
                      Hi — what are you looking for today?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      I can suggest gifts, compare pieces, or help you style something you already love.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:border-foreground/30 hover:bg-muted"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}

              {busy && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}

              {error && (
                <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  Something went wrong reaching the concierge. Please try again.
                </p>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-border bg-card px-3 py-3"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 focus-within:border-foreground/30">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask anything…"
                  aria-label="Message FlashTrends Concierge"
                  className="max-h-32 flex-1 resize-none bg-transparent py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send message"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-clay text-[oklch(0.99_0.005_80)] transition-opacity disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
