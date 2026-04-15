"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, BookCopy, LogOut, PackageSearch, WalletCards } from "lucide-react";

import { SubmissionStatusCard } from "@/components/seller/submission-status-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/ui/status-banner";
import type { AccountDashboardView } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils";

export function AccountDashboard({ dashboard }: { dashboard: AccountDashboardView }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <section className="editorial-frame rounded-[38px] p-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="eyebrow">Your account</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">{dashboard.user.fullName}</h1>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{dashboard.user.email} · {dashboard.user.phone}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} loading={loggingOut} className="bg-[color-mix(in_srgb,var(--card)_80%,white)]">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] bg-[var(--panel)] p-6">
            <BookCopy className="h-5 w-5 text-[var(--accent)]" />
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">Orders</p>
            <p className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">{dashboard.orders.length}</p>
          </div>
          <div className="rounded-[28px] bg-[var(--panel)] p-6">
            <PackageSearch className="h-5 w-5 text-[var(--accent)]" />
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">Book submissions</p>
            <p className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">{dashboard.submissions.length}</p>
          </div>
          <div className="rounded-[28px] bg-[var(--panel)] p-6">
            <WalletCards className="h-5 w-5 text-[var(--accent)]" />
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">Payout received</p>
            <p className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">
              {formatCurrency(dashboard.submissions.reduce((sum, item) => sum + item.payout, 0))}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.05fr]">
        <section className="editorial-frame rounded-[36px] p-8 md:p-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="eyebrow">Buying</span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">Your kit orders</h2>
            </div>
            <Button variant="ghost" onClick={() => router.push("/buyer")} className="gap-2">Browse kits <ArrowUpRight className="h-4 w-4" /></Button>
          </div>
          <div className="mt-6 grid gap-4">
            {dashboard.orders.length ? (
              dashboard.orders.map((order) => (
                <div key={order.id} className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{order.schoolName}</p>
                      <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[var(--foreground)]">{order.classLabel}</h3>
                      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{order.id}</p>
                    </div>
                    <Badge tone="accent">{order.status.replaceAll("_", " ")}</Badge>
                  </div>
                  <div className="editorial-divider mt-4" />
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">{order.deliveryWindow}</span>
                    <span className="font-semibold text-[var(--foreground)]">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  {order.deliveryDriverName ? <p className="mt-2 text-xs text-[var(--muted-foreground)]">Assigned driver: {order.deliveryDriverName}</p> : null}
                </div>
              ))
            ) : (
              <StatusBanner tone="info" title="No kit orders yet" body="When you place a kit order, you will see delivery progress and price summary here." />
            )}
          </div>
        </section>

        <section className="editorial-frame rounded-[36px] p-8 md:p-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="eyebrow">Selling</span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">Your book submissions</h2>
            </div>
            <Button variant="ghost" onClick={() => router.push("/sell/submit")} className="gap-2">New submission <ArrowUpRight className="h-4 w-4" /></Button>
          </div>
          <div className="mt-6 grid gap-5">
            {dashboard.submissions.length ? (
              dashboard.submissions.map((submission) => <SubmissionStatusCard key={submission.id} submission={submission} />)
            ) : (
              <StatusBanner tone="info" title="No submissions yet" body="Upload book photos and request pickup when you are ready to sell last year's books." />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

