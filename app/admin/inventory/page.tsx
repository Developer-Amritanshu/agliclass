import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { AdminShell } from "@/components/dashboard/admin-shell";
import { AdminInventoryManager } from "@/components/forms/admin-inventory-manager";
import { getAdminInventoryData, getConfigurationError } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const configurationError = getConfigurationError();
  if (configurationError) {
    return <AdminShell title="Inventory and grading" subtitle="Database connection is required for live inventory CRUD."><DatabaseRequiredNotice message={configurationError} /></AdminShell>;
  }

  const items = await getAdminInventoryData();

  return (
    <AdminShell
      title="Inventory and grading"
      subtitle="Add individual books manually, review current stock, and prepare real inventory for future kit reservation."
    >
      <AdminInventoryManager items={items} />
    </AdminShell>
  );
}
