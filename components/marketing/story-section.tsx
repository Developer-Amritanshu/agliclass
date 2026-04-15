import Image from "next/image";
import { Quote, Shield, Truck, WandSparkles } from "lucide-react";

const pillars = [
  {
    title: "Verified before it feels visible",
    body: "Parents should not have to decode editions, publishers, or hidden substitutions. The system handles that before the interface ever asks for a decision.",
    icon: Shield,
  },
  {
    title: "Operationally calm, not marketplace-chaotic",
    body: "Collection, quality grading, refurbishment, and hyperlocal delivery are structured so the experience can stay restrained and clean.",
    icon: Truck,
  },
  {
    title: "Designed to feel premium, priced to stay practical",
    body: "AgliClass uses better systems and clearer presentation without drifting into something expensive or overbuilt.",
    icon: WandSparkles,
  },
];

export function StorySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-4 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="editorial-frame rounded-[38px] p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
            <div className="relative overflow-hidden rounded-[30px] bg-[var(--panel)] p-4">
              <Image src="/images/school-valley.svg" alt="A calm school landscape illustration" width={1200} height={1200} className="h-full w-full rounded-[24px] object-cover" />
            </div>
            <div className="grid gap-4">
              <div className="rounded-[30px] bg-[var(--foreground)] p-6 text-white">
                <Quote className="h-5 w-5 text-white/70" />
                <p className="mt-5 text-sm uppercase tracking-[0.16em] text-white/60">Design principle</p>
                <p className="mt-3 text-xl font-semibold leading-9 text-white">
                  Parents should feel like the right decision has already been made for them, clearly and respectfully.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-[30px] bg-[var(--panel)] p-4">
                <Image src="/images/school-forest.svg" alt="A premium visual card representing calm school logistics" width={1200} height={900} className="h-full w-full rounded-[24px] object-cover" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div className="editorial-frame rounded-[38px] p-8 md:p-10">
            <span className="eyebrow">A more thoughtful school-commerce product</span>
            <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[0.95] tracking-[-0.05em] text-[var(--foreground)] md:text-5xl">
              Not a used-book listing site. A designed system for school prep, resale, and reuse.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)]">
              The strongest part of AgliClass is not any single page. It is the way search, verification, grading, bundling, and delivery work together so families can move with confidence.
            </p>
          </div>
          <div className="grid gap-4">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="editorial-frame rounded-[30px] p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--panel)] text-[var(--foreground)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-[-0.03em] text-[var(--foreground)]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{item.body}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
