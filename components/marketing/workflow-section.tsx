import Image from "next/image";
import { Boxes, ScanSearch, Sparkles, Truck } from "lucide-react";

const steps = [
  {
    title: "Collect",
    body: "Books come in through families, school drives, and local pickup clusters.",
    icon: Boxes,
    image: "/images/school-ridge.svg",
  },
  {
    title: "Verify",
    body: "Each submission is checked against the right school, class, and academic year.",
    icon: ScanSearch,
    image: "/images/buy-minimal.svg",
  },
  {
    title: "Bundle",
    body: "Used books are graded, matched, and combined with new fill only when needed.",
    icon: Sparkles,
    image: "/images/sell-minimal.svg",
  },
  {
    title: "Deliver",
    body: "Parents receive kits through a simpler, more predictable hyperlocal flow.",
    icon: Truck,
    image: "/images/school-forest.svg",
  },
];

export function WorkflowSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="sticky top-24">
          <span className="eyebrow">The operating rhythm</span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-[var(--foreground)] md:text-5xl">
            Four quiet steps that make the experience feel premium.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted-foreground)]">
            The product should feel calm on the surface. That only works when collection, verification, bundling, and delivery follow a disciplined sequence behind the scenes.
          </p>
          <div className="mt-8 editorial-frame rounded-[30px] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">What stays visible to families</p>
            <p className="mt-3 text-lg font-semibold leading-8 text-[var(--foreground)]">
              Correct school mapping, transparent kit quality, and fewer decisions at checkout.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="editorial-frame rounded-[32px] p-4 md:p-5">
                <div className="relative h-52 overflow-hidden rounded-[26px] bg-[var(--panel)]">
                  <Image src={step.image} alt={step.title} fill className="object-cover" />
                </div>
                <div className="p-2 pb-1 pt-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--foreground)] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">0{index + 1}</p>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-[var(--foreground)]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{step.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

