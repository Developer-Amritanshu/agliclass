import Link from "next/link";
import { ArrowRight, BadgeCheck, CircleAlert, PackageOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { KitView } from "@/lib/data/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

export function KitCard({ kit }: { kit: KitView }) {
  const statusTone = kit.status === "verified" ? "success" : kit.status === "partial" ? "warn" : "neutral";

  return (
    <Card className="flex h-full flex-col rounded-[30px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_95%,white)] p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-panel)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{kit.schoolName}</p>
          <h3 className="mt-2 font-display text-2xl text-[var(--foreground)] sm:text-3xl">{kit.classLabel}</h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{kit.academicYear}</p>
        </div>
        <Badge tone={statusTone}>{kit.status}</Badge>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-[24px] bg-[var(--panel)] p-4">
          <BadgeCheck className="mb-3 h-5 w-5 text-[var(--accent-strong)]" />
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Completeness</p>
          <p className="mt-1 text-xl font-semibold text-[var(--foreground)]">{formatPercent(kit.completion)}</p>
        </div>
        <div className="rounded-[24px] bg-[var(--panel)] p-4">
          <PackageOpen className="mb-3 h-5 w-5 text-[var(--accent-strong)]" />
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Mix</p>
          <p className="mt-1 text-xl font-semibold text-[var(--foreground)]">
            {kit.usedCount} used / {kit.newFillCount} new
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-4">
        <p className="text-sm font-medium text-[var(--foreground)]">{kit.heroBadge}</p>
        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
          Save {kit.savingsPct}% versus buying the list new. Missing items are clearly shown before you place the order.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[var(--muted-foreground)]">Kit price</p>
          <div className="flex items-end gap-3">
            <p className="font-display text-2xl text-[var(--foreground)] sm:text-3xl">{formatCurrency(kit.price)}</p>
            <p className="pb-1 text-sm text-[var(--muted-foreground)] line-through">{formatCurrency(kit.retailPrice)}</p>
          </div>
        </div>
        {kit.status === "partial" ? <CircleAlert className="h-5 w-5 text-[var(--warn)]" /> : null}
      </div>

      <Link
        href={`/buyer/kits/${kit.id}`}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-strong)] transition hover:gap-3"
      >
        View kit details
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}


