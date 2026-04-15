import Link from "next/link";
import { ArrowUpRight, BookCopy, PackageCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 pb-24 md:px-6 md:pb-28">
      <div className="relative overflow-hidden rounded-[40px] border border-[var(--border)] bg-[var(--foreground)] p-8 text-white shadow-[var(--shadow-panel)] md:p-12">
        <div className="absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_48%)]" />
        <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[var(--accent)]/15 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="text-xs uppercase tracking-[0.18em] text-white/60">Start with one elegant flow</span>
            <h2 className="mt-4 max-w-4xl text-4xl font-extrabold leading-[0.94] tracking-[-0.05em] text-white md:text-5xl">
              Buy the right kit, or send last year&apos;s books back into the same carefully designed network.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
              AgliClass is designed to make school prep feel more composed from both directions: getting the next list right, and giving the previous one a cleaner afterlife.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">
                <BookCopy className="h-4 w-4 text-[var(--accent)]" />
                Buyer flow
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">
                <PackageCheck className="h-4 w-4 text-[var(--accent)]" />
                Seller flow
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:min-w-[220px] lg:items-end">
            <Link href="/buyer">
              <Button size="lg" className="w-full gap-2 bg-white text-[var(--foreground)] hover:bg-white/92 lg:w-auto">
                Browse kits
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sell/submit">
              <Button size="lg" variant="outline" className="w-full border-white/18 bg-transparent text-white hover:bg-white/8 hover:text-white lg:w-auto">
                Start selling
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
