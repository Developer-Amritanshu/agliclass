"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LibraryBig } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBanner } from "@/components/ui/status-banner";

type KitItem = {
  id: string;
  schoolName: string;
  classLabel: string;
  academicYear: string;
  completion: number;
  qualityBand: string;
  savingsPct: number;
  usedCount: number;
  newFillCount: number;
  totalBooks: number;
  price: number;
  retailPrice: number;
  heroBadge: string;
  status: "verified" | "partial" | "waitlist";
};

export function AdminKitsManager({ kits }: { kits: KitItem[] }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ tone: "success" | "error" | "pending"; title: string; body?: string } | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setFormLoading(true);
    setFeedback({ tone: "pending", title: "Saving kit", body: "Updating the live bundle list." });

    const payload = {
      id: String(formData.get("id") ?? "").trim().toLowerCase(),
      school_name: String(formData.get("school_name") ?? ""),
      class_label: String(formData.get("class_label") ?? ""),
      academic_year: String(formData.get("academic_year") ?? ""),
      completion_pct: Number(formData.get("completion_pct") ?? 0),
      quality_band: String(formData.get("quality_band") ?? "A"),
      savings_pct: Number(formData.get("savings_pct") ?? 0),
      used_item_count: Number(formData.get("used_item_count") ?? 0),
      new_item_count: Number(formData.get("new_item_count") ?? 0),
      total_books: Number(formData.get("total_books") ?? 0),
      price: Number(formData.get("price") ?? 0),
      retail_price: Number(formData.get("retail_price") ?? 0),
      hero_badge: String(formData.get("hero_badge") ?? ""),
      status: String(formData.get("status") ?? "verified"),
    };

    const response = await fetch("/api/admin/kits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setFormLoading(false);

    if (!response.ok) {
      setFeedback({ tone: "error", title: result.error ?? "Could not save kit." });
      return;
    }

    setFeedback({ tone: "success", title: "Kit saved", body: "The buyer-facing kit list has been updated." });
    router.refresh();
  }

  async function onDelete(id: string) {
    setDeletingId(id);
    setFeedback({ tone: "pending", title: "Deleting kit", body: "Removing the kit from the live list." });

    const response = await fetch(`/api/admin/kits?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const result = await response.json();
    setDeletingId(null);

    if (!response.ok) {
      setFeedback({ tone: "error", title: result.error ?? "Could not delete kit." });
      return;
    }

    setFeedback({ tone: "success", title: "Kit deleted", body: "The kit has been removed from the live list." });
    router.refresh();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Bundle readiness</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">Live kits</h2>
          </div>
          <div className="rounded-full bg-[var(--panel)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]">{kits.length} kits</div>
        </div>
        <div className="mt-6 grid gap-4">
          {kits.map((kit) => (
            <div key={kit.id} className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">{kit.schoolName}</p>
                  <h3 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[var(--foreground)]">{kit.classLabel}</h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{kit.academicYear}</p>
                </div>
                <Button type="button" variant="danger" size="sm" onClick={() => onDelete(kit.id)} loading={deletingId === kit.id}>
                  Delete
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--muted-foreground)]">
                <span>{kit.completion}% complete</span>
                <span>{kit.usedCount} used matched</span>
                <span>{kit.newFillCount} new fill</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Create kit</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">Add kit</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">Use clear labels here. No preset placeholder values are shown anymore.</p>
          </div>
          <Link href="/admin/inventory">
            <Button type="button" variant="outline" className="gap-2">
              <LibraryBig className="h-4 w-4" />
              Add single book
            </Button>
          </Link>
        </div>
        <form action={onSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Kit ID</label>
            <Input name="id" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">School name</label>
            <Input name="school_name" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Class label</label>
              <Input name="class_label" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Academic year</label>
              <Input name="academic_year" required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Completion percent</label>
              <Input name="completion_pct" type="number" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Quality band</label>
              <Input name="quality_band" required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Savings percent</label>
              <Input name="savings_pct" type="number" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Used item count</label>
              <Input name="used_item_count" type="number" required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">New fill count</label>
              <Input name="new_item_count" type="number" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Total books</label>
              <Input name="total_books" type="number" required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Kit price</label>
              <Input name="price" type="number" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Retail price</label>
              <Input name="retail_price" type="number" required />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Buyer-facing badge</label>
            <Input name="hero_badge" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Kit status</label>
            <Select name="status" defaultValue="verified">
              <option value="verified">Verified</option>
              <option value="partial">Partial</option>
              <option value="waitlist">Waitlist</option>
            </Select>
          </div>
          {feedback ? <StatusBanner tone={feedback.tone} title={feedback.title} body={feedback.body} /> : null}
          <Button type="submit" loading={formLoading}>Add kit</Button>
        </form>
      </section>
    </div>
  );
}

