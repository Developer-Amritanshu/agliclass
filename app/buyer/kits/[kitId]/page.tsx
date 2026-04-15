import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, CircleCheck, PackagePlus, ShieldCheck, ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";

import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getConfigurationError, getKit } from "@/lib/data/queries";
import { absoluteUrl } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ kitId: string }> }): Promise<Metadata> {
  const configurationError = getConfigurationError();

  if (configurationError) {
    return {
      title: "School book kit",
      description: "Explore verified school book kits mapped to exact schools and classes.",
    };
  }

  const { kitId } = await params;
  const kit = await getKit(kitId);

  if (!kit) {
    return {
      title: "Kit not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${kit.schoolName} ${kit.classLabel} book kit`;
  const description = `${kit.classLabel} book kit for ${kit.schoolName}, ${kit.academicYear}. ${kit.totalBooks} books, ${kit.completion}% ready, priced at ${formatCurrency(kit.price)}.`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/buyer/kits/${kit.id}`),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/buyer/kits/${kit.id}`),
    },
  };
}

export default async function KitDetailPage({ params }: { params: Promise<{ kitId: string }> }) {
  const configurationError = getConfigurationError();

  if (configurationError) {
    return (
      <div>
        <SiteHeader />
        <DatabaseRequiredNotice message={configurationError} />
      </div>
    );
  }

  const { kitId } = await params;
  const kit = await getKit(kitId);

  if (!kit) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${kit.schoolName} ${kit.classLabel} book kit`,
    description: `Verified school-specific book kit for ${kit.schoolName}, ${kit.classLabel}, ${kit.academicYear}.`,
    category: "School book kit",
    brand: {
      "@type": "Brand",
      name: "AgliClass",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: kit.price,
      availability: kit.status === "waitlist" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      url: absoluteUrl(`/buyer/kits/${kit.id}`),
    },
  };

  return (
    <div className="relative overflow-hidden">
      <JsonLd data={productSchema} />
      <SiteHeader />
      <div className="editorial-orb editorial-orb--warm absolute left-0 top-28 -z-10 h-72 w-72" />
      <div className="editorial-orb editorial-orb--cool absolute right-0 top-56 -z-10 h-72 w-72" />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <Link
          href="/buyer"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to kits
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="editorial-frame rounded-[34px] p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">{kit.schoolName}</Badge>
              <Badge tone={kit.status === "verified" ? "success" : "warn"}>{kit.status}</Badge>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">{kit.classLabel}</h1>
            <p className="mt-3 text-base leading-7 text-[var(--muted-foreground)] md:text-lg">
              {kit.academicYear} · {kit.totalBooks} books · {kit.completion}% ready
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] bg-[var(--panel)] p-5">
                <ShieldCheck className="mb-3 h-5 w-5 text-[var(--accent)]" />
                <p className="text-sm text-[var(--muted-foreground)]">Quality band</p>
                <p className="mt-2 text-xl font-bold text-[var(--foreground)] md:text-2xl">{kit.qualityBand}</p>
              </div>
              <div className="rounded-[24px] bg-[var(--panel)] p-5">
                <BadgeCheck className="mb-3 h-5 w-5 text-[var(--accent)]" />
                <p className="text-sm text-[var(--muted-foreground)]">Used books</p>
                <p className="mt-2 text-xl font-bold text-[var(--foreground)] md:text-2xl">{kit.usedCount}</p>
              </div>
              <div className="rounded-[24px] bg-[var(--panel)] p-5">
                <PackagePlus className="mb-3 h-5 w-5 text-[var(--accent)]" />
                <p className="text-sm text-[var(--muted-foreground)]">New-fill books</p>
                <p className="mt-2 text-xl font-bold text-[var(--foreground)] md:text-2xl">{kit.newFillCount}</p>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] bg-[var(--panel)] p-5">
              <div className="flex items-start gap-3">
                <CircleCheck className="mt-1 h-5 w-5 text-[var(--accent)]" />
                <div>
                  <h2 className="text-lg font-bold text-[var(--foreground)]">What you will see before payment</h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                    Any missing item or new-fill item is shown clearly. Nothing is swapped without telling you first.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="editorial-frame rounded-[34px] p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Checkout summary</p>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">AgliClass price</p>
                  <p className="text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">{formatCurrency(kit.price)}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm text-[var(--muted-foreground)]">Market new price</p>
                  <p className="text-base text-[var(--muted-foreground)] line-through sm:text-lg">{formatCurrency(kit.retailPrice)}</p>
                </div>
              </div>
              <div className="mt-6 rounded-[24px] bg-[var(--panel)] p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">{kit.heroBadge}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  This kit is prepared for families who want a faster, cleaner buying experience than hunting title by title.
                </p>
              </div>
              <div className="mt-6 grid gap-3">
                <Link href={`/buyer/checkout?kit=${kit.id}`}>
                  <Button size="lg" className="w-full">
                    <ShoppingBag className="h-4 w-4" />
                    Continue to checkout
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full">
                  Ask for missing books
                </Button>
              </div>
            </div>

            <div className="editorial-frame rounded-[34px] p-6 md:p-8">
              <h2 className="text-xl font-bold tracking-[-0.03em] text-[var(--foreground)] md:text-2xl">Why parents choose this</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
                <p>You save against the full new-book cost.</p>
                <p>The kit is already organized by school and class.</p>
                <p>Delivery and support stay in one AgliClass account.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
