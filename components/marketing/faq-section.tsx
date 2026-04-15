import { HelpCircle } from "lucide-react";

import { faqs } from "@/lib/data/mock-data";

export function FaqSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] md:text-5xl">
            Straight answers, framed with the same clarity as the product.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted-foreground)]">
            Families do not need jargon here. They need clean answers about kit quality, verification, resale value, and what happens when a school list changes.
          </p>
        </div>
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <article key={faq.question} className="editorial-frame rounded-[30px] p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--panel)] text-[var(--foreground)]">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-[-0.03em] text-[var(--foreground)]">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{faq.answer}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
