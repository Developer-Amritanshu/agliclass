import { ArrowUpRight, Clock3, MapPinned, ShieldCheck } from "lucide-react";

import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { AdminShell } from "@/components/dashboard/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAdminOverviewData, getConfigurationError } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configurationError = getConfigurationError();
  if (configurationError) {
    return <div><AdminShell title="Overview" subtitle="Database connection is required for live operations."><DatabaseRequiredNotice message={configurationError} /></AdminShell></div>;
  }

  const { kits, opsMetrics, sellerSubmissions } = await getAdminOverviewData();

  return (
    <AdminShell title="Overview" subtitle="A compact command center for a small ops team running school onboarding, intake, grading, kit assembly, and delivery without heavy enterprise tooling.">
      <section className="grid gap-5 xl:grid-cols-4">
        {opsMetrics.map((metric) => (
          <Card key={metric.label} className="p-5 md:p-6">
            <p className="text-sm text-[var(--muted-foreground)]">{metric.label}</p>
            <p className="mt-3 font-display text-3xl text-[var(--foreground)] sm:text-4xl">{metric.value}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{metric.delta}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6 md:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Priority queue</p>
              <h2 className="mt-2 font-display text-2xl text-[var(--foreground)] sm:text-3xl">Kits needing action</h2>
            </div>
            <Badge tone="warn">Ops attention</Badge>
          </div>
          <div className="mt-6 grid gap-3">
            {kits.map((kit) => (
              <div key={kit.id} className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{kit.schoolName}</p>
                    <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">{kit.classLabel}</h3>
                  </div>
                  <Badge tone={kit.status === "verified" ? "success" : "warn"}>{kit.status}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--muted-foreground)]">
                  <span>{kit.completion}% complete</span>
                  <span>{kit.usedCount} used matched</span>
                  <span>{kit.newFillCount} new fill</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="p-6 md:p-7">
            <div className="flex items-start gap-3">
              <MapPinned className="mt-1 h-5 w-5 text-[var(--accent-strong)]" />
              <div>
                <h2 className="font-display text-2xl text-[var(--foreground)] sm:text-3xl">Cluster routing</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">Batch pickups by school catchment and combine buyer deliveries with seller collection where route density allows.</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 md:p-7">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-[var(--accent-strong)]" />
              <div>
                <h2 className="font-display text-2xl text-[var(--foreground)] sm:text-3xl">QC guardrails</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">Mandatory books cannot be silently substituted. Wrong-edition and damaged-book issues are flagged before dispatch.</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 md:p-7">
            <p className="text-sm uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Recent submissions</p>
            <div className="mt-4 space-y-3">
              {sellerSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between rounded-[20px] bg-[var(--panel)] p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--foreground)]">{submission.sellerName}</p>
                    <p className="truncate text-sm text-[var(--muted-foreground)]">{submission.schoolName}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <Card className="p-6 md:p-7">
          <Clock3 className="h-5 w-5 text-[var(--accent-strong)]" />
          <h2 className="mt-5 font-display text-2xl text-[var(--foreground)] sm:text-3xl">Seasonality handling</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">The dashboard is built to survive school-season spikes with queue views and manual overrides instead of fragile real-time complexity.</p>
        </Card>
        <Card className="p-6 md:p-7">
          <h2 className="font-display text-2xl text-[var(--foreground)] sm:text-3xl">Top risks</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
            <li>Syllabus changes after preorder</li>
            <li>Partial kit overselling during peak week</li>
            <li>Incorrect school mapping for similar names across cities</li>
          </ul>
        </Card>
        <Card className="p-6 md:p-7">
          <h2 className="font-display text-2xl text-[var(--foreground)] sm:text-3xl">Next automation layer</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">Once volume grows, connect OCR-assisted intake and nightly waitlist matching without changing the app structure or schema design.</p>
        </Card>
      </section>
    </AdminShell>
  );
}
