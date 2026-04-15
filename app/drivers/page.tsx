import { redirect } from "next/navigation";

import { AccountAuthPanel } from "@/components/account/account-auth-panel";
import { DriverDashboard } from "@/components/drivers/driver-dashboard";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { getCurrentAppUser } from "@/lib/auth/user";
import { getConfigurationError, getDriverDashboardData } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function DriversPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const configurationError = getConfigurationError();

  if (configurationError) {
    return (
      <div>
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
          <Card>
            <h1 className="font-display text-4xl text-[var(--foreground)]">We are preparing the driver hub</h1>
            <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">Please check back in a moment.</p>
          </Card>
        </main>
      </div>
    );
  }

  const user = await getCurrentAppUser();
  const params = await searchParams;

  if (user) {
    if (user.role !== "driver") {
      redirect("/account");
    }

    if (params.next && params.next !== "/drivers") {
      redirect(params.next);
    }

    const dashboard = await getDriverDashboardData(user);

    return (
      <div>
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
          <DriverDashboard dashboard={dashboard} />
        </main>
      </div>
    );
  }

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Card>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Driver hub</p>
            <h1 className="mt-3 font-display text-5xl leading-tight text-[var(--foreground)]">Pickups and deliveries, handled from one dashboard.</h1>
            <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
              Create your driver account, share your service areas, and receive pickup or delivery assignments from the AgliClass ops team.
            </p>
            <div className="mt-8 grid gap-4">
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-4">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Set your availability</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">Mark yourself available, busy, or offline so the ops team sees the right list.</p>
              </div>
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-4">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Receive assigned work</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">Pickup submissions and delivery orders appear in one clean task view.</p>
              </div>
            </div>
          </Card>
          <AccountAuthPanel role="driver" nextOverride="/drivers" />
        </div>
      </main>
    </div>
  );
}
