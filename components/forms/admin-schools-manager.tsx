"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBanner } from "@/components/ui/status-banner";

type SchoolItem = {
  id: string;
  name: string;
  board: string;
  city: string;
  district: string;
  category: string;
  medium: string;
};

export function AdminSchoolsManager({ schools }: { schools: SchoolItem[] }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ tone: "success" | "error" | "pending"; title: string; body?: string } | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setFormLoading(true);
    setFeedback({ tone: "pending", title: "Saving school", body: "Adding this school to the live directory." });

    const payload = {
      id: String(formData.get("id") ?? "").trim().toLowerCase(),
      name: String(formData.get("name") ?? ""),
      board: String(formData.get("board") ?? ""),
      city: String(formData.get("city") ?? ""),
      district: String(formData.get("district") ?? ""),
      category: String(formData.get("category") ?? "private"),
      medium: String(formData.get("medium") ?? ""),
      cover_image_url: String(formData.get("cover_image_url") ?? ""),
    };

    const response = await fetch("/api/admin/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setFormLoading(false);

    if (!response.ok) {
      setFeedback({ tone: "error", title: result.error ?? "Could not save school." });
      return;
    }

    setFeedback({ tone: "success", title: "School saved", body: "Parents can now discover this school in search." });
    router.refresh();
  }

  async function onDelete(id: string) {
    setDeletingId(id);
    setFeedback({ tone: "pending", title: "Deleting school", body: "Removing it from the live directory." });

    const response = await fetch(`/api/admin/schools?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const result = await response.json();
    setDeletingId(null);

    if (!response.ok) {
      setFeedback({ tone: "error", title: result.error ?? "Could not delete school." });
      return;
    }

    setFeedback({ tone: "success", title: "School deleted", body: "The school has been removed from the live directory." });
    router.refresh();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Live directory</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">Verified schools</h2>
          </div>
          <div className="rounded-full bg-[var(--panel)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]">{schools.length} live</div>
        </div>
        <div className="mt-6 grid gap-3">
          {schools.map((school) => (
            <div key={school.id} className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{school.board} · {school.category}</p>
                  <h3 className="mt-2 text-xl font-bold tracking-[-0.03em] text-[var(--foreground)]">{school.name}</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">{school.city}, {school.district} · {school.medium}</p>
                </div>
                <Button type="button" variant="danger" size="sm" onClick={() => onDelete(school.id)} loading={deletingId === school.id}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Create school</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">Add school</h2>
        <form action={onSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">School slug / id</label>
            <Input name="id" placeholder="sgrr-dehradun" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">School name</label>
            <Input name="name" placeholder="SGRR Public School" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Board</label>
              <Input name="board" placeholder="CBSE" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Medium</label>
              <Input name="medium" placeholder="English" required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">City</label>
              <Input name="city" placeholder="Dehradun" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">District</label>
              <Input name="district" placeholder="Dehradun" required />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Category</label>
            <Select name="category" defaultValue="private">
              <option value="private">Private</option>
              <option value="government">Government</option>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Cover image URL</label>
            <Input name="cover_image_url" placeholder="/images/school-ridge.svg" />
          </div>
          {feedback ? <StatusBanner tone={feedback.tone} title={feedback.title} body={feedback.body} /> : null}
          <Button type="submit" loading={formLoading}>Add school</Button>
        </form>
      </section>
    </div>
  );
}
