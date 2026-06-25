import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/atlas/PolicyPage";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility — FlashTrends" },
      { name: "description", content: "Our ongoing commitment to making FlashTrends usable by everyone." },
    ],
  }),
  component: () => (
    <PolicyPage
      title="Accessibility"
      updated="June 1, 2026"
      intro="We design and build FlashTrends to be usable by as many people as possible, including people who use assistive technology."
      sections={[
        { heading: "Our standard", body: <p>We target WCAG 2.2 AA across the site and audit against it on a recurring basis. We're not perfect; this is a continual practice rather than a finish line.</p> },
        { heading: "What we do", body: <p>Semantic HTML, keyboard-accessible interactions, visible focus states, sufficient color contrast in both light and dark themes, alt text on meaningful imagery, and respect for the prefers-reduced-motion setting.</p> },
        { heading: "Known limitations", body: <p>Some third-party embeds (e.g. select payment widgets) are not under our full control. Where we can, we provide alternatives. We are working with these partners to close remaining gaps.</p> },
        { heading: "Report a barrier", body: <p>If you encounter an accessibility issue, please tell us. We treat accessibility reports as priority bugs and respond within two business days. Email accessibility@flashtrends.com with a description of the issue and, if possible, the page URL and your assistive technology setup.</p> },
        { heading: "Feedback shapes the roadmap", body: <p>Many of our improvements come directly from customer reports. Thank you for taking the time to make the site better for everyone.</p> },
      ]}
    />
  ),
});
