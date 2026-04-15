"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBanner } from "@/components/ui/status-banner";

type InventoryItem = {
  id: string;
  bookId?: string | null;
  title: string;
  subject: string;
  publisher: string;
  language: string;
  isbn13?: string | null;
  binding?: string | null;
  grade: "A+" | "A" | "B";
  qcStatus: string;
  refurbStatus: string;
  status: string;
};

type FormValues = {
  id?: string;
  title: string;
  subject: string;
  publisher: string;
  language: string;
  isbn13: string;
  binding: string;
  edition_label: string;
  publication_year: string;
  grade: "A+" | "A" | "B";
  qc_status: string;
  refurb_status: string;
  status: string;
  notes: string;
};

const emptyForm: FormValues = {
  title: "",
  subject: "",
  publisher: "",
  language: "English",
  isbn13: "",
  binding: "",
  edition_label: "",
  publication_year: "",
  grade: "A",
  qc_status: "pending",
  refurb_status: "pending",
  status: "submitted",
  notes: "",
};

export function AdminInventoryManager({ items }: { items: InventoryItem[] }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ tone: "success" | "error" | "pending"; title: string; body?: string } | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);

  const editingItem = useMemo(() => items.find((item) => item.id === editingId) ?? null, [editingId, items]);

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEdit(item: InventoryItem) {
    setEditingId(item.id);
    setForm({
      id: item.id,
      title: item.title,
      subject: item.subject,
      publisher: item.publisher,
      language: item.language,
      isbn13: item.isbn13 ?? "",
      binding: item.binding ?? "",
      edition_label: "",
      publication_year: "",
      grade: item.grade,
      qc_status: item.qcStatus,
      refurb_status: item.refurbStatus,
      status: item.status,
      notes: "",
    });
    setFeedback(null);
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFeedback(null);
  }

  async function onSubmit() {
    setFormLoading(true);
    setFeedback({
      tone: "pending",
      title: editingId ? "Updating book" : "Saving book",
      body: editingId ? "Applying your changes to the live inventory entry." : "Adding the book to live inventory.",
    });

    const payload = {
      ...(editingId ? { id: editingId } : {}),
      title: form.title,
      subject: form.subject,
      publisher: form.publisher,
      language: form.language,
      isbn13: form.isbn13 || undefined,
      binding: form.binding || undefined,
      edition_label: form.edition_label || undefined,
      publication_year: form.publication_year ? Number(form.publication_year) : undefined,
      grade: form.grade,
      qc_status: form.qc_status,
      refurb_status: form.refurb_status,
      status: form.status,
      notes: form.notes || undefined,
    };

    const response = await fetch("/api/admin/inventory", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setFormLoading(false);

    if (!response.ok) {
      setFeedback({ tone: "error", title: result.error ?? `Could not ${editingId ? "update" : "save"} book.` });
      return;
    }

    setFeedback({ tone: "success", title: editingId ? "Book updated" : "Book added", body: "The inventory list has been updated." });
    resetForm();
    router.refresh();
  }

  async function onDelete(id: string) {
    setDeletingId(id);
    setFeedback({ tone: "pending", title: "Deleting book", body: "Removing the book from inventory." });

    const response = await fetch(`/api/admin/inventory?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const result = await response.json();
    setDeletingId(null);

    if (!response.ok) {
      setFeedback({ tone: "error", title: result.error ?? "Could not delete book." });
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setFeedback({ tone: "success", title: "Book deleted", body: "The inventory entry has been removed." });
    router.refresh();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Live inventory</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">Manual book entries</h2>
          </div>
          <div className="rounded-full bg-[var(--panel)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]">{items.length} books</div>
        </div>
        <div className="mt-6 grid gap-4">
          {items.length ? (
            items.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">{item.publisher}</p>
                    <h3 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[var(--foreground)]">{item.title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.subject} · {item.language}</p>
                    {item.isbn13 ? <p className="mt-1 text-xs text-[var(--muted-foreground)]">ISBN {item.isbn13}</p> : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => startEdit(item)}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button type="button" variant="danger" size="sm" onClick={() => onDelete(item.id)} loading={deletingId === item.id}>
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--muted-foreground)]">
                  <span>Grade {item.grade}</span>
                  <span>QC {item.qcStatus}</span>
                  <span>{item.status}</span>
                </div>
              </div>
            ))
          ) : (
            <StatusBanner tone="info" title="No books added yet" body="Use the form to add the first single-book inventory item manually." />
          )}
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Single-book intake</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">{editingItem ? "Edit book" : "Add book manually"}</h2>
          </div>
          {editingItem ? (
            <Button type="button" variant="outline" size="sm" onClick={resetForm}>
              <RotateCcw className="h-4 w-4" />
              Cancel
            </Button>
          ) : null}
        </div>
        <div className="mt-6 grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Book title</label>
            <Input value={form.title} onChange={(event) => updateField("title", event.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Subject</label>
              <Input value={form.subject} onChange={(event) => updateField("subject", event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Publisher</label>
              <Input value={form.publisher} onChange={(event) => updateField("publisher", event.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Language</label>
              <Input value={form.language} onChange={(event) => updateField("language", event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">ISBN (optional)</label>
              <Input value={form.isbn13} onChange={(event) => updateField("isbn13", event.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Binding (optional)</label>
              <Input value={form.binding} onChange={(event) => updateField("binding", event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Edition label (optional)</label>
              <Input value={form.edition_label} onChange={(event) => updateField("edition_label", event.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Publication year (optional)</label>
              <Input type="number" value={form.publication_year} onChange={(event) => updateField("publication_year", event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Grade</label>
              <Select value={form.grade} onChange={(event) => updateField("grade", event.target.value as FormValues["grade"])}>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">QC status</label>
              <Select value={form.qc_status} onChange={(event) => updateField("qc_status", event.target.value)}>
                <option value="pending">pending</option>
                <option value="reviewed">reviewed</option>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Refurb status</label>
              <Select value={form.refurb_status} onChange={(event) => updateField("refurb_status", event.target.value)}>
                <option value="pending">pending</option>
                <option value="done">done</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Inventory status</label>
            <Select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
              <option value="submitted">submitted</option>
              <option value="graded">graded</option>
              <option value="ready">ready</option>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Notes (optional)</label>
            <Textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Condition details or manual intake note" />
          </div>
          {feedback ? <StatusBanner tone={feedback.tone} title={feedback.title} body={feedback.body} /> : null}
          <Button type="button" loading={formLoading} onClick={onSubmit}>
            {editingItem ? "Save changes" : "Add book"}
          </Button>
        </div>
      </section>
    </div>
  );
}

