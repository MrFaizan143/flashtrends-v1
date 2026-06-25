import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/atlas/PolicyPage";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — FlashTrends" },
      { name: "description", content: "How and why FlashTrends uses cookies and similar technologies." },
    ],
  }),
  component: () => (
    <PolicyPage
      title="Cookie Policy"
      updated="June 1, 2026"
      intro="We use a small number of cookies to keep the site working and to understand what's useful. Here's the breakdown."
      sections={[
        { heading: "What cookies are", body: <p>Cookies are small text files stored on your device when you visit a website. They let sites remember things like your cart contents or that you've signed in.</p> },
        { heading: "Strictly necessary", body: <p>These keep core functionality working — your cart, your session, fraud prevention, load balancing. You can't opt out of these without breaking the site.</p> },
        { heading: "Preferences", body: <p>Remember your region, currency, and light/dark theme choice across visits.</p> },
        { heading: "Analytics", body: <p>Help us understand which pages are useful and where the site is slow. We use a privacy-respecting analytics provider; data is aggregated and not used to identify you individually.</p> },
        { heading: "Marketing", body: <p>Only set if you opt in. Used to measure the performance of ads we run on a small number of platforms. You can opt out from the cookie banner at any time.</p> },
        { heading: "Managing cookies", body: <p>You can manage your preferences from the cookie banner footer link, or block cookies entirely in your browser settings. Blocking strictly-necessary cookies will prevent the site from working correctly.</p> },
        { heading: "Contact", body: <p>Questions? Email privacy@flashtrends.com.</p> },
      ]}
    />
  ),
});
