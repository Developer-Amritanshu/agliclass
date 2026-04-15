import type { Metadata } from "next";

import { BuyerDiscovery } from "@/components/buyer/buyer-discovery";
import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/site-header";
import { getBuyerPageData, getConfigurationError } from "@/lib/data/queries";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buy Verified School Book Kits",
  description:
    "Browse verified school book kits by school, class, city, and academic year. Compare used school books, new-fill items, and pricing before checkout.",
  alternates: {
    canonical: absoluteUrl("/buyer"),
  },
};

export default async function BuyerPage() {
  const configurationError = getConfigurationError();

  if (configurationError) {
    return (
      <div>
        <SiteHeader />
        <DatabaseRequiredNotice message={configurationError} />
      </div>
    );
  }

  const { schools, kits } = await getBuyerPageData();
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AgliClass school book kits",
    url: absoluteUrl("/buyer"),
    description:
      "Browse school-specific book kits with verified school mapping, visible completeness, and transparent used versus new-fill mix.",
  };

  return (
    <div className="relative overflow-hidden">
      <JsonLd data={schema} />
      <SiteHeader />
      <div className="editorial-orb editorial-orb--warm absolute left-0 top-32 -z-10 h-72 w-72" />
      <div className="editorial-orb editorial-orb--cool absolute right-0 top-80 -z-10 h-80 w-80" />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <BuyerDiscovery schools={schools} kits={kits} />
      </main>
    </div>
  );
}
