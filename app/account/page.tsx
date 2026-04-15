import { redirect } from "next/navigation";
import { ArrowUpRight, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";

import { AccountAuthPanel } from "@/components/account/account-auth-panel";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { getCurrentAppUser } from "@/lib/auth/user";
import { getAccountDashboardData, getConfigurationError } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const configurationError = getConfigurationError();

  if (configurationError) {
    return (
      <div>
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
          <Card>
            <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">We are preparing your account area</h1>
            <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">Please check back in a moment.</p>
          </Card>
        </main>
      </div>
    );
  }

  const user = await getCurrentAppUser();
  const params = await searchParams;

  if (user) {
    if (user.role === "driver") {
      redirect("/drivers");
    }

    if (params.next && params.next !== "/account") {
      redirect(params.next);
    }

    const dashboard = await getAccountDashboardData(user);

    return (
      <div className="relative overflow-hidden">
        <SiteHeader />
        <div className="editorial-orb editorial-orb--warm absolute left-0 top-32 -z-10 h-72 w-72" />
        <div className="editorial-orb editorial-orb--cool absolute right-0 top-72 -z-10 h-80 w-80" />
        <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
          <AccountDashboard dashboard={dashboard} />
        </main>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <SiteHeader />
      <div className="editorial-orb editorial-orb--warm absolute -left-16 top-24 -z-10 h-72 w-72" />
      <div className="editorial-orb editorial-orb--cool absolute right-0 top-40 -z-10 h-80 w-80" />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <section className="editorial-frame rounded-[38px] p-8 md:p-10">
            <span className="eyebrow">AgliClass account</span>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[0.94] tracking-[-0.06em] text-[var(--foreground)] sm:text-5xl">
              One private space for buying, selling, tracking, and staying in control.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)]">
              Your account keeps kit orders, seller submissions, pickup updates, and final pricing inside one calm workspace designed to feel clear at every step.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] bg-[var(--panel)] p-6">
                <ShieldCheck className="h-5 w-5 text-[var(--accent)]" />
                <h2 className="mt-4 text-xl font-bold tracking-[-0.03em] text-[var(--foreground)]">Buy with clarity</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">Track orders, delivery windows, and the exact verified school kit you selected.</p>
              </div>
              <div className="rounded-[28px] bg-[var(--panel)] p-6">
                <PackageCheck className="h-5 w-5 text-[var(--accent)]" />
                <h2 className="mt-4 text-xl font-bold tracking-[-0.03em] text-[var(--foreground)]">Sell with visibility</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">Follow review progress, pickup assignment, and the final human-approved offer without leaving your profile.</p>
              </div>
            </div>
            <div className="mt-8 rounded-[30px] bg-[var(--foreground)] p-6 text-white">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-white/80" />
                <p className="text-sm uppercase tracking-[0.16em] text-white/60">Private workspace</p>
              </div>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white">
                The goal is simple: fewer separate steps, fewer uncertain moments, and one account that quietly keeps the whole experience together.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                Account-based tracking
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </section>
          <AccountAuthPanel role="parent" nextOverride="/account" />
        </div>
      </main>
    </div>
  );
}

