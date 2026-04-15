import { redirect } from "next/navigation";
import Image from "next/image";
import { Camera, CircleAlert, School2 } from "lucide-react";

import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { SellerSubmissionForm } from "@/components/forms/seller-submission-form";
import { SiteHeader } from "@/components/site-header";
import { getCurrentAppUser } from "@/lib/auth/user";
import { getBuyerPageData, getConfigurationError } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function SellerSubmitPage() {
  const configurationError = getConfigurationError();
  if (configurationError) {
    return <div><SiteHeader /><DatabaseRequiredNotice message={configurationError} /></div>;
  }

  const user = await getCurrentAppUser();

  if (!user) {
    redirect("/account?next=/sell/submit");
  }

  if (user.role !== "parent") {
    redirect("/drivers");
  }

  const { schools, kits } = await getBuyerPageData();

  return (
    <div className="relative overflow-hidden">
      <SiteHeader />
      <div className="editorial-orb editorial-orb--warm absolute left-0 top-36 -z-10 h-72 w-72" />
      <div className="editorial-orb editorial-orb--cool absolute right-0 top-80 -z-10 h-80 w-80" />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <section className="editorial-frame rounded-[38px] p-8 md:p-10">
            <span className="eyebrow">New submission</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">Tell us which books you want to hand over.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)]">
              Add one book or a full class set. The form is designed to feel easy on the surface, while still capturing enough detail for a careful review and fair pricing.
            </p>
            <SellerSubmissionForm user={{ id: user.id, fullName: user.full_name, email: user.email, phone: user.phone, role: user.role }} schools={schools} kits={kits} />
          </section>
          <div className="grid gap-6">
            <section className="editorial-frame overflow-hidden rounded-[36px] p-4">
              <div className="relative overflow-hidden rounded-[28px] bg-[var(--panel)]">
                <Image src="/images/sell-minimal.svg" alt="Books prepared for resale review" width={1400} height={1100} className="h-auto w-full object-cover" />
              </div>
            </section>
            <section className="editorial-frame rounded-[36px] p-8">
              <div className="flex items-start gap-3">
                <Camera className="mt-1 h-5 w-5 text-[var(--accent)]" />
                <div>
                  <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">Photo tips</h2>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--muted-foreground)]">
                    <p>Show the front cover clearly and include at least one spine or stack photo.</p>
                    <p>Add one book or a full set. The flow supports both ways of selling cleanly.</p>
                    <p>Final pricing is always reviewed by a person after the books are checked physically.</p>
                  </div>
                </div>
              </div>
            </section>
            <section className="editorial-frame rounded-[36px] p-8">
              <div className="flex items-start gap-3">
                <School2 className="mt-1 h-5 w-5 text-[var(--accent)]" />
                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-[var(--foreground)]">School not listed?</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">You can request it inside the form. If enough families ask for the same school, we will try to onboard it.</p>
                </div>
              </div>
            </section>
            <section className="editorial-frame rounded-[36px] p-8">
              <div className="flex items-start gap-3">
                <CircleAlert className="mt-1 h-5 w-5 text-[var(--warn)]" />
                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-[var(--foreground)]">After you submit</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">Your submission moves into your account with review progress, pickup assignment, and final offer updates.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

