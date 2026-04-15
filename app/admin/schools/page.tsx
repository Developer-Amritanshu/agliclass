import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { AdminSchoolsManager } from "@/components/forms/admin-schools-manager";
import { AdminShell } from "@/components/dashboard/admin-shell";
import { getAdminSchoolsData, getConfigurationError } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function AdminSchoolsPage() {
  const configurationError = getConfigurationError();
  if (configurationError) {
    return <AdminShell title="Schools and syllabus" subtitle="Database connection is required for live admin CRUD."><DatabaseRequiredNotice message={configurationError} /></AdminShell>;
  }

  const schools = await getAdminSchoolsData();
  return <AdminShell title="Schools and syllabus" subtitle="Manage school onboarding, class-year combinations, and the versioned syllabus graph that powers every buyer and seller workflow."><AdminSchoolsManager schools={schools} /></AdminShell>;
}
