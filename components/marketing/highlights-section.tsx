import Image from "next/image";
import { BookCheck, ClipboardList, MapPinned, Wallet } from "lucide-react";

const highlights = [
  {
    title: "School-first discovery",
    body: "Parents search by school and class first, so results feel relevant from the beginning.",
    icon: BookCheck,
  },
  {
    title: "Hyperlocal network",
    body: "Supply and demand stay close together, which keeps both pickup and delivery lighter.",
    icon: MapPinned,
  },
  {
    title: "Clear substitutions",
    body: "If a book is missing or newly filled, the interface makes that visible before payment.",
    icon: ClipboardList,
  },
  {
    title: "Meaningful savings",
    body: "Families save real money without sacrificing trust or feeling pushed into cluttered resale flows.",
    icon: Wallet,
  },
];

export function HighlightsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="editorial-frame rounded-[36px] p-8 md:p-10">
          <span className="eyebrow">What makes it durable</span>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[0.95] tracking-[-0.05em] text-[var(--foreground)] md:text-5xl">
            A school-class-year graph underneath, and a calmer retail experience above it.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)]">
            AgliClass is not just a storefront. It is a verified system for matching real syllabi, refurbished inventory, and hyperlocal delivery into something parents can trust instantly.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] bg-[var(--panel)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Launch cluster</p>
              <p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">20 schools</p>
            </div>
            <div className="rounded-[24px] bg-[var(--panel)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Expected savings</p>
              <p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">25-40%</p>
            </div>
            <div className="rounded-[24px] bg-[var(--panel)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Customer promise</p>
              <p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">Visible clarity</p>
            </div>
          </div>
          <div className="mt-8 relative overflow-hidden rounded-[30px] bg-[var(--panel)] p-4">
            <Image src="/images/hero-books.svg" alt="Books arranged in a premium editorial composition" width={1400} height={800} className="h-auto w-full rounded-[24px] object-cover" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="editorial-frame rounded-[28px] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--panel)] text-[var(--foreground)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-2xl font-bold tracking-[-0.03em] text-[var(--foreground)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

