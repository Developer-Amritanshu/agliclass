import type { Metadata } from "next";
import { Linkedin, Mail, MessageSquareText } from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact AgliClass",
  description:
    "Contact AgliClass for school book kits, used school book resale, partnerships, product questions, or startup conversations.",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact AgliClass",
    url: absoluteUrl("/contact"),
    about: {
      "@type": "Organization",
      name: "AgliClass",
      url: absoluteUrl("/"),
    },
  };

  return (
    <div className="relative overflow-hidden">
      <JsonLd data={contactSchema} />
      <SiteHeader />
      <div className="editorial-orb editorial-orb--warm absolute -left-10 top-28 -z-10 h-72 w-72" />
      <div className="editorial-orb editorial-orb--cool absolute right-0 top-48 -z-10 h-80 w-80" />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="editorial-frame rounded-[34px] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Contact</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[0.95] tracking-[-0.06em] text-[var(--foreground)] sm:text-5xl">
              A minimal way to reach the person building AgliClass.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted-foreground)]">
              Use the form for product questions, partnerships, school conversations, investor outreach, or anything else you want to discuss.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[26px] bg-[var(--panel)] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--foreground)] text-white">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">Email</p>
                    <p className="text-sm text-[var(--muted-foreground)]">amritanshu360@gmail.com</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[26px] bg-[var(--panel)] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--foreground)] text-white">
                    <Linkedin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">LinkedIn</p>
                    <a
                      href="https://www.linkedin.com/in/amritanshu-rawat/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
                    >
                      Connect with Amritanshu
                    </a>
                  </div>
                </div>
              </div>
              <div className="rounded-[26px] bg-[var(--panel)] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--foreground)] text-white">
                    <MessageSquareText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">Best for</p>
                    <p className="text-sm text-[var(--muted-foreground)]">School onboarding, partnerships, design, product, and startup conversations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </section>
      </main>
    </div>
  );
}
