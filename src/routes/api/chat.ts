import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { PRODUCTS } from "@/lib/products";

function buildCatalog() {
  return PRODUCTS.map(
    (p) =>
      `- slug:${p.slug} | ${p.name} by ${p.brand} | category:${p.category} | $${p.price}${p.compareAt ? ` (was $${p.compareAt})` : ""} | rating:${p.rating} | ${p.tagline}`,
  ).join("\n");
}

const SYSTEM = `You are FlashTrends Concierge — a calm, knowledgeable shopping advisor for the FlashTrends marketplace. You're warm but concise, like a thoughtful friend in retail. Speak in short, confident sentences. Never use emoji.

You ONLY recommend products that exist in the catalog below. Never invent products, prices, or brands. If nothing fits the request, say so plainly and suggest the closest alternative from the catalog.

When you recommend a product, embed a reference token in your reply using the EXACT format: [[p:slug]]
- Example: "The [[p:cashmere-overcoat]] is our heirloom pick."
- Use the slug exactly as it appears in the catalog.
- Mention 1–4 products per reply; do not dump the whole catalog.
- Place tokens inline within your sentences, not in a list at the end.

You can help with: gift recommendations by budget/recipient, pairing/styling, comparisons, what's trending, and general product questions. For order tracking, politely note that you'll connect them to support and suggest checking their Account page.

CATALOG:
${buildCatalog()}`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
