import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Camera, Coins, Package, Truck } from "lucide-react";

import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getConfigurationError } from "@/lib/data/queries";
import { absoluteUrl } from "@/lib/seo";

const sellerBenefits = [
  { icon: Camera, title: "Upload clear photos", body: "Front cover, spine, or stack photos are enough to begin review." },
  { icon: Truck, title: "Get pickup assigned", body: "Once reviewed, your submission can be assigned to a pickup teammate." },
  { icon: Package, title: "Track every status", body: "See pending review, pickup stage, and final decision from one account." },
  { icon: Coins, title: "Human-reviewed pricing", body: "You see an early range first, and the final offer after inspection." },
];

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sell Used School Books and Class Kits",
  description:
    "Sell used school books, single books, or full class kits through AgliClass. Upload photos, request pickup, and track review and payout in one account.",
  alternates: {
    canonical: absoluteUrl("/sell"),
  },
};

export default async function SellerPage() {
  const configurationError = getConfigurationError();
  if (configurationError) {
    return (
      <div>
        <SiteHeader />
        <DatabaseRequiredNotice message={configurationError} />
      </div>
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AgliClass used school book resale",
    provider: {
      "@type": "Organization",
      name: "AgliClass",
      url: absoluteUrl("/"),
    },
    areaServed: "India",
    serviceType: "Used school book resale and school kit intake",
    url: absoluteUrl("/sell"),
  };

  return (
    <div>
      <JsonLd data={schema} />
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="surface-glass rounded-[34px] border border-[var(--border)] p-6 shadow-[var(--shadow-panel)] md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Sell old books</p>
            <h1 className="mt-3 font-display text-5xl leading-[0.95] text-[var(--foreground)]">Sell used school books with a cleaner resale flow for one book or a full school set.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)]">
              Submit photos, choose your school and class if you know them, and follow review, pickup, and pricing without chasing anyone on chat.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {sellerBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <article key={benefit.title} className="rounded-[26px] border border-[var(--border)] bg-[var(--panel)] p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--foreground)] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-5 text-lg font-semibold text-[var(--foreground)]">{benefit.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{benefit.body}</p>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sell/submit"><Button size="lg" className="w-full sm:w-auto">Start a submission</Button></Link>
              <Link href="/account"><Button size="lg" variant="outline" className="w-full sm:w-auto">Open my account</Button></Link>
            </div>
          </div>

          <div className="surface-glass overflow-hidden rounded-[34px] border border-[var(--border)] shadow-[var(--shadow-panel)]">
            <div className="relative aspect-[16/12] bg-[var(--panel)]">
              <Image src="/images/sell-minimal.svg" alt="Sell used school books through a clean AgliClass flow" fill className="object-cover" />
            </div>
            <div className="grid gap-3 p-6">
              <div className="rounded-[24px] bg-[var(--panel)] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">1. Submit</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">Choose single book or whole kit</p>
              </div>
              <div className="rounded-[24px] bg-[var(--panel)] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">2. Review</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">Team checks photos and plans pickup</p>
              </div>
              <div className="rounded-[24px] bg-[var(--panel)] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">3. Offer</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">Final price is confirmed after inspection</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
