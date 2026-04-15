import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { AdminShell } from "@/components/dashboard/admin-shell";
import { AdminSubmissionManager } from "@/components/forms/admin-submission-manager";
import { getAdminSubmissionQueue, getConfigurationError } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const configurationError = getConfigurationError();
  if (configurationError) {
    return <AdminShell title="Seller queue" subtitle="Live seller submissions will appear here once the system is ready."><DatabaseRequiredNotice message={configurationError} /></AdminShell>;
  }

  const submissions = await getAdminSubmissionQueue();

  return (
    <AdminShell title="Seller queue" subtitle="Review uploaded book photos, assign a pickup driver, and set the final human-approved offer from one place.">
      <AdminSubmissionManager submissions={submissions.items} drivers={submissions.drivers} />
    </AdminShell>
  );
}
