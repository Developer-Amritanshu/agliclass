import { notFound, redirect } from "next/navigation";

import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { SubmissionStatusCard } from "@/components/seller/submission-status-card";
import { SiteHeader } from "@/components/site-header";
import { getCurrentAppUser } from "@/lib/auth/user";
import { getConfigurationError, getSubmissionForUser } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function SellerStatusPage({ params }: { params: Promise<{ submissionId: string }> }) {
  const configurationError = getConfigurationError();
  if (configurationError) {
    return <div><SiteHeader /><DatabaseRequiredNotice message={configurationError} /></div>;
  }

  const user = await getCurrentAppUser();
  if (!user) {
    redirect("/account");
  }

  const { submissionId } = await params;
  const submission = await getSubmissionForUser(submissionId, user.id);
  if (!submission) notFound();

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
        <SubmissionStatusCard submission={submission} />
        <div className="mt-6 rounded-[34px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-panel)]">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">What happens next</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-[var(--panel)] p-5"><p className="text-sm text-[var(--muted-foreground)]">1. Photo review</p><p className="mt-2 text-sm leading-7 text-[var(--foreground)]">We review the photos and line them up with the school and class details you shared.</p></div>
            <div className="rounded-[24px] bg-[var(--panel)] p-5"><p className="text-sm text-[var(--muted-foreground)]">2. Pickup assignment</p><p className="mt-2 text-sm leading-7 text-[var(--foreground)]">A teammate can be assigned for pickup once the submission is ready.</p></div>
            <div className="rounded-[24px] bg-[var(--panel)] p-5"><p className="text-sm text-[var(--muted-foreground)]">3. Final offer</p><p className="mt-2 text-sm leading-7 text-[var(--foreground)]">The final amount is confirmed only after condition and completeness are checked physically.</p></div>
          </div>
        </div>
      </main>
    </div>
  );
}
