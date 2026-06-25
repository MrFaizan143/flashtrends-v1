import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/atlas/PolicyPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — FlashTrends" },
      { name: "description", content: "How FlashTrends collects, uses, and protects your personal information." },
    ],
  }),
  component: () => (
    <PolicyPage
      title="Privacy Policy"
      updated="June 1, 2026"
      intro="We collect only what we need to run the shop, deliver your orders, and improve your experience. Here's exactly what that means."
      sections={[
        { heading: "Information we collect", body: <p>Account info (name, email, password hash), order info (shipping address, items, payment confirmation), and usage data (pages visited, device type, approximate location from IP). We do not store full payment card numbers — payments are processed by our PCI-compliant payment partners.</p> },
        { heading: "How we use it", body: <p>To process orders, deliver and track shipments, respond to support requests, prevent fraud, send transactional emails, and — only with your opt-in — send marketing. We use aggregated, anonymized analytics to improve the site.</p> },
        { heading: "Sharing with third parties", body: <p>We share data only with service providers that help us run the business: payment processors, shipping carriers, email and analytics providers, and customer-service tools. Each is bound by contract to use your data only for the services they provide to us.</p> },
        { heading: "Your rights", body: <p>You can access, correct, export, or delete your personal data at any time from your account, or by emailing privacy@flashtrends.com. We respond to verified requests within 30 days. Residents of the EU, UK, and California have additional rights under GDPR and CCPA which we honor in full.</p> },
        { heading: "Data retention", body: <p>We retain account and order data for as long as your account is active, plus the period required for tax and legal compliance (typically 7 years for order records). You can delete your account at any time.</p> },
        { heading: "Security", body: <p>All data in transit is encrypted with TLS 1.3. Sensitive data at rest is encrypted with AES-256. Access to production systems is limited and audited.</p> },
        { heading: "International transfers", body: <p>Our servers are located in the EU. When data is transferred outside the EU, we rely on Standard Contractual Clauses and other approved safeguards.</p> },
        { heading: "Children", body: <p>FlashTrends is not intended for users under 16. We do not knowingly collect data from children.</p> },
        { heading: "Contact", body: <p>For privacy questions or to exercise your rights, email privacy@flashtrends.com.</p> },
      ]}
    />
  ),
});
