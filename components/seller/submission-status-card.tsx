import { BookText, Camera, CircleDollarSign, PackageCheck, Sparkles, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { SellerSubmissionView } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils";

const statusCopy = {
  pickup_scheduled: { label: "Review started", tone: "accent" as const },
  received: { label: "Received", tone: "neutral" as const },
  graded: { label: "Offer ready", tone: "success" as const },
  settled: { label: "Payout settled", tone: "success" as const },
};

export function SubmissionStatusCard({ submission }: { submission: SellerSubmissionView }) {
  const meta = statusCopy[submission.status];
  const estimated = submission.finalOffer > 0 ? submission.finalOffer : submission.estimatedPayoutMax;
  const submissionTitle = submission.sellMode === "single_book" ? submission.bookTitle || "Single book submission" : `${submission.classLabel} set`;

  return (
    <div className="rounded-[34px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-panel)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-[var(--muted-foreground)]">{submission.schoolName}</p>
          <h3 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">{submissionTitle}</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Submission ID {submission.id}</p>
        </div>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
        <span className="rounded-full bg-[var(--panel)] px-3 py-1.5 font-medium text-[var(--foreground)]">{submission.sellMode === "single_book" ? "Single book" : "Whole kit / set"}</span>
        <span>{submission.classLabel} · {submission.academicYear}</span>
        {submission.subjectLabel ? <span>{submission.subjectLabel}</span> : null}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-[24px] bg-[var(--panel)] p-4">
          <Camera className="mb-3 h-5 w-5 text-[var(--accent)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Photos</p>
          <p className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">{submission.photoCount}</p>
        </div>
        <div className="rounded-[24px] bg-[var(--panel)] p-4">
          <Truck className="mb-3 h-5 w-5 text-[var(--accent)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Pickup</p>
          <p className="mt-2 font-medium text-[var(--foreground)]">{submission.pickupStatus.replaceAll("_", " ")}</p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">{submission.assignedTo || "Awaiting teammate assignment"}</p>
        </div>
        <div className="rounded-[24px] bg-[var(--panel)] p-4">
          <Sparkles className="mb-3 h-5 w-5 text-[var(--accent)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Review state</p>
          <p className="mt-2 font-medium text-[var(--foreground)]">{submission.analysisStatus.replaceAll("_", " ")}</p>
        </div>
        <div className="rounded-[24px] bg-[var(--panel)] p-4">
          <CircleDollarSign className="mb-3 h-5 w-5 text-[var(--accent)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Latest value</p>
          <p className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">{formatCurrency(estimated)}</p>
        </div>
      </div>
      <div className="mt-4 rounded-[24px] bg-[var(--panel)] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          {submission.sellMode === "single_book" ? <BookText className="h-4 w-4 text-[var(--accent)]" /> : <PackageCheck className="h-4 w-4 text-[var(--accent)]" />}
          Final price is confirmed by a human after pickup and condition review.
        </div>
        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{submission.statusNote || "We will keep updating this submission as our team reviews your books."}</p>
      </div>
    </div>
  );
}

