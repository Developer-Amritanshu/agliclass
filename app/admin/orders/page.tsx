import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { AdminShell } from "@/components/dashboard/admin-shell";
import { AdminOrderManager } from "@/components/forms/admin-order-manager";
import { getAdminOrdersData, getConfigurationError } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const configurationError = getConfigurationError();
  if (configurationError) {
    return <AdminShell title="Orders" subtitle="Live orders will appear here once the system is ready."><DatabaseRequiredNotice message={configurationError} /></AdminShell>;
  }

  const orders = await getAdminOrdersData();

  return (
    <AdminShell title="Orders" subtitle="Track order confirmation, package status, driver assignment, and the buyer-facing delivery promise from one place.">
      <AdminOrderManager orders={orders.items} drivers={orders.drivers} />
    </AdminShell>
  );
}
