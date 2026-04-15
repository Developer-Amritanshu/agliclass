import { CalendarRange, Database, ShieldCheck } from "lucide-react";

import { AdminShell } from "@/components/dashboard/admin-shell";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminTasksPage() {
  return (
    <AdminShell
      title="Tasks"
      subtitle="This screen should become the live work queue for pickup, grading, approvals, and settlement once task tables and assignment flows are connected."
    >
      <div className="grid gap-5 xl:grid-cols-3">
        <EmptyState
          eyebrow="Task queue"
          title="No fake queue, only real assignments."
          body="This page intentionally avoids placeholder operational tasks. It should only display live assignments from the database."
          imageSrc="/images/tasks-empty.svg"
          imageAlt="Task queue empty state illustration"
          compact
        />
        <div className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
          <Database className="h-5 w-5 text-[var(--accent)]" />
          <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">Next task model</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">Add task creation for pickups, grading batches, delivery attempts, and seller settlement so the ops team works from one queue.</p>
        </div>
        <div className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
          <ShieldCheck className="h-5 w-5 text-[var(--accent)]" />
          <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">Production readiness</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">After tasks and inventory are live, the app becomes much closer to a real operating system rather than a storefront plus admin CRUD.</p>
          <div className="mt-6 rounded-[24px] bg-[var(--panel)] p-5 text-sm text-[var(--muted-foreground)]">
            <div className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
              <CalendarRange className="h-4 w-4 text-[var(--accent)]" />
              Ideal first queue items
            </div>
            <p className="mt-2">Pickup schedule confirmations, grading batches, delivery retries, and payout settlements.</p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
