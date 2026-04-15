"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { BookOpenText, Camera, ImagePlus, School2, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBanner } from "@/components/ui/status-banner";
import type { AppUserView, KitView, SchoolView } from "@/lib/data/types";

type SubmissionMode = "single_book" | "kit";

type SubmitState = {
  status: "idle" | "submitting" | "success" | "error";
  title?: string;
  body?: string;
  submissionId?: string;
};

type UploadStage = {
  label: string;
  body: string;
  progress: number;
};

const stageCopy: Record<"preparing" | "uploading" | "creating" | "saved", UploadStage> = {
  preparing: { label: "Preparing photos", body: "Checking your selected images and getting everything ready.", progress: 18 },
  uploading: { label: "Uploading photos", body: "Sending your book images securely so the team can review them.", progress: 58 },
  creating: { label: "Creating submission", body: "Saving your request and linking the photos to your account.", progress: 86 },
  saved: { label: "Saved", body: "Your submission is now in review and visible in your account.", progress: 100 },
};

export function SellerSubmissionForm({
  user,
  schools,
  kits,
}: {
  user: AppUserView;
  schools: SchoolView[];
  kits: KitView[];
}) {
  const [mode, setMode] = useState<SubmissionMode>("kit");
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [schoolName, setSchoolName] = useState(schools[0]?.name ?? "");
  const [customSchool, setCustomSchool] = useState("");
  const [classLabel, setClassLabel] = useState("Class 1");
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear() > 2025 ? "2026-27" : "2025-26");
  const [pickupMode, setPickupMode] = useState<"home_pickup" | "school_drive">("home_pickup");
  const [bookTitle, setBookTitle] = useState("");
  const [subjectLabel, setSubjectLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStage, setUploadStage] = useState<UploadStage | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const classOptions = useMemo(() => {
    const base = Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`);
    const fromKits = Array.from(new Set(kits.map((kit) => kit.classLabel)));
    return Array.from(new Set([...base, ...fromKits]));
  }, [kits]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const generated = Array.from({ length: 5 }, (_, index) => {
      const start = currentYear - index;
      return `${start}-${String(start + 1).slice(-2)}`;
    });
    return Array.from(new Set([...generated, ...kits.map((kit) => kit.academicYear)])).sort().reverse();
  }, [kits]);

  const previews = useMemo(
    () => files.map((file) => ({ id: `${file.name}-${file.lastModified}`, file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(() => {
    return () => {
      for (const preview of previews) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [previews]);

  const estimate = useMemo(() => {
    if (!files.length) {
      return { min: 0, max: 0 };
    }

    if (mode === "single_book") {
      return {
        min: Math.max(60, files.length * 55),
        max: Math.max(120, files.length * 90),
      };
    }

    return {
      min: Math.max(180, files.length * 90),
      max: Math.max(320, files.length * 160),
    };
  }, [files.length, mode]);

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files ?? []);
    if (!nextFiles.length) {
      return;
    }

    setFiles((current) => [...current, ...nextFiles]);
    event.target.value = "";
  }

  function removeFile(targetId: string) {
    setFiles((current) => current.filter((file) => `${file.name}-${file.lastModified}` !== targetId));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!files.length) {
      setSubmitState({ status: "error", title: "Add at least one photo", body: "Book photos help us review and plan pickup." });
      return;
    }

    if (mode === "kit" && !schoolName) {
      setSubmitState({ status: "error", title: "Choose the school", body: "Whole kit submissions need the school and class so we can map the list correctly." });
      return;
    }

    setSubmitState({ status: "submitting" });
    setUploadStage(stageCopy.preparing);

    try {
      const formData = new FormData();
      const activeSchoolName = schoolName === "__request__" ? customSchool : schoolName;

      formData.set("sell_mode", mode);
      formData.set("school_name", activeSchoolName);
      formData.set("requested_school_name", schoolName === "__request__" ? customSchool : "");
      formData.set("class_label", classLabel);
      formData.set("academic_year", academicYear);
      formData.set("pickup_mode", pickupMode);
      formData.set("book_title", bookTitle);
      formData.set("subject_label", subjectLabel);
      formData.set("notes", notes);

      for (const file of files) {
        formData.append("photos", file);
      }

      setUploadStage(stageCopy.uploading);

      const responsePromise = fetch("/api/seller-submissions", {
        method: "POST",
        body: formData,
      });

      setUploadStage(stageCopy.creating);
      const response = await responsePromise;
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not create your submission.");
      }

      setUploadStage(stageCopy.saved);
      setSubmitState({
        status: "success",
        title: "Submission received",
        body: "Your books are now in review. You can track pickup assignment and the final human-reviewed offer in your account.",
        submissionId: result.submission?.id,
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        title: error instanceof Error ? error.message : "Could not create your submission.",
        body: "Please try again. Your selected photos will stay here so you do not have to re-add them.",
      });
    }
  }

  if (submitState.status === "success") {
    return (
      <div className="mt-8 grid gap-5">
        <StatusBanner tone="success" title={submitState.title || "Submission received"} body={submitState.body} />
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5">
          <p className="text-sm font-semibold text-[var(--foreground)]">What happens next</p>
          <div className="mt-4 grid gap-3 text-sm text-[var(--muted-foreground)]">
            <p>1. Your photos are already attached to your account and visible to the review team.</p>
            <p>2. A human will check the submission and assign a pickup driver if needed.</p>
            <p>3. Final pricing is confirmed after physical review, not by the early estimate.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/account" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">Open my account</Button>
          </Link>
          <Link href="/sell/submit" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">Submit more books</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-4">
        <p className="text-sm font-semibold text-[var(--foreground)]">Selling as {user.fullName}</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{user.email} · {user.phone}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode("single_book")}
          className={`cursor-pointer rounded-[24px] border p-5 text-left transition ${mode === "single_book" ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--panel))] shadow-[var(--shadow-soft)]" : "border-[var(--border)] bg-[var(--card)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"}`}
        >
          <BookOpenText className="h-5 w-5 text-[var(--accent-strong)]" />
          <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Single book</h3>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">Use this when you want to sell one book or a small mixed set.</p>
        </button>
        <button
          type="button"
          onClick={() => setMode("kit")}
          className={`cursor-pointer rounded-[24px] border p-5 text-left transition ${mode === "kit" ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--panel))] shadow-[var(--shadow-soft)]" : "border-[var(--border)] bg-[var(--card)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"}`}
        >
          <School2 className="h-5 w-5 text-[var(--accent-strong)]" />
          <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Whole kit / set</h3>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">Best for a full class set where school, class, and year matter for matching.</p>
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">School {mode === "kit" ? "*" : "(optional)"}</label>
          <Select value={schoolName} onChange={(event) => setSchoolName(event.target.value)} required={mode === "kit"}>
            {mode === "single_book" ? <option value="">I will add this later</option> : null}
            {schools.map((school) => (
              <option key={school.id} value={school.name}>{school.name}</option>
            ))}
            <option value="__request__">My school is not listed</option>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Class {mode === "kit" ? "*" : "(optional)"}</label>
          <Select value={classLabel} onChange={(event) => setClassLabel(event.target.value)}>
            {classOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Academic year {mode === "kit" ? "*" : "(optional)"}</label>
          <Select value={academicYear} onChange={(event) => setAcademicYear(event.target.value)}>
            {yearOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
        </div>
      </div>

      {schoolName === "__request__" ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Request your school</label>
          <Input value={customSchool} onChange={(event) => setCustomSchool(event.target.value)} placeholder="Enter your school name" required />
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">If enough families request the same school, we will reach out and try to onboard it.</p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Book title {mode === "single_book" ? "(helpful)" : "(optional)"}</label>
          <Input value={bookTitle} onChange={(event) => setBookTitle(event.target.value)} placeholder="Mathematics Part 1" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Subject</label>
          <Input value={subjectLabel} onChange={(event) => setSubjectLabel(event.target.value)} placeholder="Mathematics" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Pickup mode</label>
        <Select value={pickupMode} onChange={(event) => setPickupMode(event.target.value as "home_pickup" | "school_drive")}>
          <option value="home_pickup">Home pickup</option>
          <option value="school_drive">School drive dropoff</option>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Notes</label>
        <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Mention missing books, markings, mixed publishers, or anything our team should know." />
      </div>

      <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--panel)] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--panel-strong)] text-[var(--accent-strong)]">
            <ImagePlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Upload book photos</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">Add front covers, spine shots, or stack photos. You can remove any image before sending.</p>
          </div>
        </div>

        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            <Camera className="h-4 w-4" />
            {files.length ? "Add more photos" : "Choose photos"}
          </Button>
          <p className="text-sm text-[var(--muted-foreground)]">{files.length ? `${files.length} photo${files.length > 1 ? "s" : ""} selected` : "No photos selected yet"}</p>
        </div>

        {files.length ? (
          <div className="mt-5 grid gap-4">
            {uploadStage ? (
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--foreground)]">{uploadStage.label}</span>
                  <span className="text-[var(--muted-foreground)]">{uploadStage.progress}%</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-[var(--card)]">
                  <div className="h-3 rounded-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${uploadStage.progress}%` }} />
                </div>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{uploadStage.body}</p>
              </div>
            ) : null}

            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                <Sparkles className="h-4 w-4 text-[var(--accent-strong)]" />
                Early estimate: Rs. {estimate.min} to Rs. {estimate.max}
              </div>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">This is only an early estimate from the photo set. Final pricing is always decided by a human after review.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {previews.map((preview) => (
                <div key={preview.id} className="overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--card)]">
                  <div className="relative aspect-[4/3]">
                    <Image src={preview.url} alt={preview.file.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <p className="truncate text-xs text-[var(--muted-foreground)]">{preview.file.name}</p>
                    <button
                      type="button"
                      onClick={() => removeFile(preview.id)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-[var(--muted-foreground)] transition hover:bg-[var(--panel)] hover:text-[var(--foreground)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {submitState.status !== "idle" && submitState.title ? (
        <StatusBanner
          tone={submitState.status === "error" ? "error" : "pending"}
          title={submitState.title}
          body={submitState.body}
        />
      ) : null}

      <Button size="lg" loading={submitState.status === "submitting"}>
        <Camera className="h-4 w-4" />
        Submit for review
      </Button>
    </form>
  );
}

