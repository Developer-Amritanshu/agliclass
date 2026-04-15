import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { Hero } from "@/components/marketing/hero";
import { HighlightsSection } from "@/components/marketing/highlights-section";
import { StorySection } from "@/components/marketing/story-section";
import { WorkflowSection } from "@/components/marketing/workflow-section";
import { SiteHeader } from "@/components/site-header";
import { faqs } from "@/lib/data/mock-data";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "School Book Kits and Used School Book Resale",
  description:
    "AgliClass helps parents buy verified school book kits and sell used school books through a hyperlocal school book resale network in India.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AgliClass",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/opengraph-image"),
    description:
      "AgliClass is a school book kit and used school book resale platform for parents looking to buy verified school kits or sell last year's books.",
    sameAs: ["https://www.linkedin.com/in/amritanshu-rawat/"],
  };

  return (
    <div className="relative">
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqSchema} />
      <SiteHeader />
      <Hero />
      <WorkflowSection />
      <StorySection />
      <HighlightsSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
