import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CircleCheckBig, Search, ShieldCheck, Sparkles, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const proof = [
  "Exact school mapping before checkout",
  "Used and new-fill clearly separated",
  "One account for buying and reselling",
];

const notes = [
  "Hyperlocal pickup and doorstep delivery",
  "Refurbished quality grading with visible condition bands",
  "School-first search instead of generic marketplace browsing",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="soft-grid absolute inset-x-0 top-0 -z-20 h-[48rem] opacity-35" />
      <div className="hero-noise absolute inset-x-0 top-0 -z-10 h-[48rem]" />
      <div className="editorial-orb editorial-orb--warm absolute -left-20 top-16 -z-10 h-72 w-72" />
      <div className="editorial-orb editorial-orb--cool absolute right-0 top-28 -z-10 h-80 w-80" />
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-8 md:px-6 md:pb-24 md:pt-12">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="pt-4">
            <Badge tone="accent">Verified school kits for modern parents</Badge>
            <div className="mt-7 max-w-5xl">
              <span className="eyebrow">Dehradun-first, designed for calmer school prep</span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[0.92] tracking-[-0.06em] text-[var(--foreground)] sm:text-5xl md:text-7xl">
                School books, curated with the same care as a premium retail experience.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg md:text-xl">
                AgliClass replaces annual school-list chaos with verified kits, transparent quality, and a resale flow that feels elegant instead of messy.
              </p>
            </div>

            <div className="mt-9 editorial-frame rounded-[36px] p-4 md:p-5">
              <div className="grid gap-3 md:grid-cols-[1.25fr_0.85fr_auto] md:items-center">
                <div className="flex items-center gap-3 rounded-[26px] bg-[var(--panel)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
                  <Search className="h-4 w-4 text-[var(--accent)]" />
                  Search your school, class, or city
                </div>
                <div className="rounded-[26px] bg-[var(--panel)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
                  Only verified kit results
                </div>
                <Link href="/buyer">
                  <Button size="lg" className="w-full md:w-auto">
                    Explore kits
                  </Button>
                </Link>
              </div>
              <div className="editorial-divider mt-4" />
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {proof.map((item) => (
                  <div key={item} className="rounded-[24px] bg-[var(--panel)] px-4 py-4 text-sm font-medium leading-6 text-[var(--foreground)]">
                    <CircleCheckBig className="mb-3 h-4 w-4 text-[var(--accent)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {notes.map((item) => (
                <div key={item} className="rounded-[24px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_88%,transparent)] px-4 py-4 text-sm leading-6 text-[var(--muted-foreground)] shadow-[var(--shadow-soft)]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:pt-4">
            <div className="editorial-frame rounded-[40px] p-4 md:p-5">
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative overflow-hidden rounded-[30px] bg-[var(--panel)]">
                  <Image src="/images/hero-modern.svg" alt="AgliClass landing illustration" width={1600} height={1100} className="h-full w-full object-cover" priority />
                </div>
                <div className="grid gap-4">
                  <div className="rounded-[28px] bg-[var(--panel)] p-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Sample verified kit</p>
                    <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[var(--foreground)]">SGRR Public School, Class 7</h2>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Books</p>
                        <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">11</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Savings</p>
                        <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">34%</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Delivery</p>
                        <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">48h</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[28px] bg-[var(--foreground)] p-6 text-[var(--accent-foreground)]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                      <Star className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-xs uppercase tracking-[0.16em] text-white/65">Why parents prefer this</p>
                    <p className="mt-3 text-lg font-medium leading-8 text-white">
                      The interface stays restrained, but the product underneath is deeply operational and precise.
                    </p>
                    <Link href="/buyer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:gap-3">
                      Browse verified kits
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[0.92fr_1.08fr]">
              <div className="editorial-frame rounded-[32px] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--panel)] text-[var(--foreground)]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Trust layer</p>
                    <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">Verified school mapping</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                  Built for real school lists, grade-specific mapping, and transparent substitutions instead of generic used-book listings.
                </p>
              </div>
              <div className="editorial-frame rounded-[32px] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--panel)] text-[var(--foreground)]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Operational detail</p>
                    <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">Refurbish, grade, bundle, deliver</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                  AgliClass works because the customer-facing calm is backed by disciplined supply collection, grading, and bundling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


