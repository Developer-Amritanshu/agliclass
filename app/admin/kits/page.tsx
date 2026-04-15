import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { AdminKitsManager } from "@/components/forms/admin-kits-manager";
import { AdminShell } from "@/components/dashboard/admin-shell";
import { getAdminKitsData, getConfigurationError } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function AdminKitsPage() {
  const configurationError = getConfigurationError();
  if (configurationError) {
    return <AdminShell title="Kit builder" subtitle="Database connection is required for live admin CRUD."><DatabaseRequiredNotice message={configurationError} /></AdminShell>;
  }

  const kits = await getAdminKitsData();
  return <AdminShell title="Kit builder" subtitle="Assemble full and partial kits by syllabus slot, reserve inventory safely, and expose substitutions before anything reaches checkout."><AdminKitsManager kits={kits} /></AdminShell>;
}
