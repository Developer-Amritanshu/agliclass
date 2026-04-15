"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Camera, IndianRupee, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBanner } from "@/components/ui/status-banner";
import type { DriverProfileView, SellerSubmissionView } from "@/lib/data/types";

export function AdminSubmissionManager({ submissions, drivers }: { submissions: SellerSubmissionView[]; drivers: DriverProfileView[] }) {
  const router = useRouter();
  const [activeId, setActiveId] = useState(submissions[0]?.id ?? "");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error" | "pending"; title: string; body?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const activeSubmission = useMemo(() => submissions.find((item) => item.id === activeId) ?? submissions[0], [activeId, submissions]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setFeedback({ tone: "pending", title: "Saving seller review", body: "Updating pickup assignment and reviewed pricing." });

    const rawDriverId = String(formData.get("pickup_driver_id") ?? "");
    const payload = {
      id: String(formData.get("id") ?? ""),
      pickup_driver_id: rawDriverId || null,
      pickup_status: String(formData.get("pickup_status") ?? "pending_assignment"),
      analysis_status: String(formData.get("analysis_status") ?? "queued"),
      final_offer: Number(formData.get("final_offer") ?? 0),
      status_note: String(formData.get("status_note") ?? ""),
      accepted_items: Number(formData.get("accepted_items") ?? 0),
      rejected_items: Number(formData.get("rejected_items") ?? 0),
      status: String(formData.get("status") ?? "pickup_scheduled"),
    };

    const response = await fetch("/api/admin/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setFeedback({ tone: "error", title: result.error ?? "Could not save seller review." });
      return;
    }

    setFeedback({ tone: "success", title: "Submission updated", body: "Pickup assignment and pricing are now saved." });
    router.refresh();
  }

  if (!activeSubmission) {
    return <StatusBanner tone="info" title="No seller submissions yet" body="New photo-based submissions will appear here for review." />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="grid gap-4">
        {submissions.map((submission) => (
          <button
            key={submission.id}
            type="button"
            onClick={() => setActiveId(submission.id)}
            className={`rounded-[28px] border p-5 text-left transition ${submission.id === activeSubmission.id ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,var(--panel))] shadow-[var(--shadow-soft)]" : "border-[var(--border)] bg-[var(--card)] hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">{submission.sellerName}</p>
                <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[var(--foreground)]">{submission.schoolName}</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{submission.classLabel} · {submission.academicYear}</p>
              </div>
              <span className="rounded-full bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--foreground)]">{submission.status.replaceAll("_", " ")}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--muted-foreground)]">
              <span>{submission.photoCount} photos</span>
              <span>{submission.pickupStatus.replaceAll("_", " ")}</span>
              <span>{submission.analysisStatus.replaceAll("_", " ")}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid gap-5">
        <div className="rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Seller review</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">{activeSubmission.sellerName}</h2>
            </div>
            <div className="text-right text-sm text-[var(--muted-foreground)]">
              <p>{activeSubmission.id}</p>
              <p>{activeSubmission.schoolName}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {activeSubmission.photos?.length ? activeSubmission.photos.map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--panel)]">
                <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${photo.publicUrl})` }} />
              </div>
            )) : <StatusBanner tone="info" title="No photos uploaded" body="This submission does not have any photos attached yet." className="sm:col-span-2" />}
          </div>
        </div>

        <div className="rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
          <form action={handleSubmit} className="grid gap-4">
            <input type="hidden" name="id" value={activeSubmission.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Assign pickup driver</label>
                <Select name="pickup_driver_id" defaultValue={activeSubmission.pickupDriverId || ""}>
                  <option value="">Keep unassigned</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>{driver.fullName} · {driver.city}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Pickup status</label>
                <Select name="pickup_status" defaultValue={activeSubmission.pickupStatus}>
                  <option value="pending_assignment">Pending assignment</option>
                  <option value="assigned">Assigned</option>
                  <option value="picked_up">Picked up</option>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Review status</label>
                <Select name="analysis_status" defaultValue={activeSubmission.analysisStatus}>
                  <option value="queued">Queued</option>
                  <option value="uploading">Uploading</option>
                  <option value="creating_submission">Creating submission</option>
                  <option value="processing">Processing</option>
                  <option value="reviewed">Reviewed</option>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Submission stage</label>
                <Select name="status" defaultValue={activeSubmission.status}>
                  <option value="pickup_scheduled">Pickup scheduled</option>
                  <option value="received">Received</option>
                  <option value="graded">Offer ready</option>
                  <option value="settled">Settled</option>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Accepted books</label>
                <Input name="accepted_items" type="number" defaultValue={activeSubmission.acceptedItems} required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Rejected books</label>
                <Input name="rejected_items" type="number" defaultValue={activeSubmission.rejectedItems} required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Final offer</label>
                <Input name="final_offer" type="number" defaultValue={activeSubmission.finalOffer || activeSubmission.estimatedPayoutMax} required />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Update note</label>
              <Textarea name="status_note" defaultValue={activeSubmission.statusNote || "Pickup driver assigned. Final offer will be confirmed after physical review."} />
            </div>
            <div className="rounded-[24px] bg-[var(--panel)] p-4 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
                <Truck className="h-4 w-4 text-[var(--accent)]" />
                Pickup assignment and pricing control
              </div>
              <p className="mt-2 leading-7">Use this panel to assign a driver, review the photos, and mark the final human-approved offer.</p>
              <div className="mt-3 flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2"><Camera className="h-4 w-4" />{activeSubmission.photoCount} uploaded</span>
                <span className="inline-flex items-center gap-2"><IndianRupee className="h-4 w-4" />Estimate Rs. {activeSubmission.estimatedPayoutMin} - Rs. {activeSubmission.estimatedPayoutMax}</span>
              </div>
            </div>
            {feedback ? <StatusBanner tone={feedback.tone} title={feedback.title} body={feedback.body} /> : null}
            <Button type="submit" loading={loading}>Save review</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
