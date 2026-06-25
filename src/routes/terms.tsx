import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/atlas/PolicyPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — FlashTrends" },
      { name: "description", content: "The terms governing your use of FlashTrends." },
    ],
  }),
  component: () => (
    <PolicyPage
      title="Terms of Service"
      updated="June 1, 2026"
      intro="These terms govern your use of FlashTrends and your purchases from us. Please read them carefully."
      sections={[
        { heading: "1. Acceptance of terms", body: <p>By accessing or using FlashTrends (the "Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p> },
        { heading: "2. Eligibility", body: <p>You must be at least 16 years old to use the Service, and at least 18 to make a purchase. By using FlashTrends you represent that you meet these requirements.</p> },
        { heading: "3. Your account", body: <p>You are responsible for maintaining the confidentiality of your account credentials and for any activity that occurs under your account. Notify us immediately of any unauthorized use.</p> },
        { heading: "4. Orders and pricing", body: <p>All orders are subject to acceptance and product availability. We reserve the right to refuse or cancel any order, including in cases of pricing errors. Prices are shown in the currency of your selected region and exclude any duties or import taxes unless stated otherwise.</p> },
        { heading: "5. Shipping and returns", body: <p>Shipping timelines and return eligibility are described on our Shipping and Returns pages and form part of these Terms.</p> },
        { heading: "6. Prohibited use", body: <p>You agree not to use the Service to violate any law, infringe intellectual property rights, transmit malicious code, or interfere with the operation of the Service.</p> },
        { heading: "7. Intellectual property", body: <p>All content on FlashTrends, including text, graphics, photography, and code, is owned by FlashTrends or its licensors and may not be reproduced without permission.</p> },
        { heading: "8. Limitation of liability", body: <p>To the maximum extent permitted by law, FlashTrends will not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p> },
        { heading: "9. Changes to these terms", body: <p>We may update these Terms from time to time. Material changes will be communicated by email or by notice on the site, and continued use after the effective date constitutes acceptance.</p> },
        { heading: "10. Contact", body: <p>Questions about these Terms? Reach us at legal@flashtrends.com.</p> },
      ]}
    />
  ),
});
