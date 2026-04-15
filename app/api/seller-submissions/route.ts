import { randomUUID } from "crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getFriendlyErrorMessage } from "@/lib/api/error-message";
import { getAppSessionCookieName, getAppUserFromToken } from "@/lib/auth/user";
import { attachSubmissionPhotos, createSellerSubmission } from "@/lib/data/queries";
import { getSupabaseAdminClient } from "@/lib/supabase/client";
import { SELLER_SUBMISSIONS_BUCKET } from "@/lib/supabase/storage";

async function ensureBucket() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Service is temporarily unavailable.");
  }

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(listError.message);
  }

  const existing = buckets.find((bucket) => bucket.name === SELLER_SUBMISSIONS_BUCKET);

  if (!existing) {
    const { error: createError } = await supabase.storage.createBucket(SELLER_SUBMISSIONS_BUCKET, {
      public: false,
      fileSizeLimit: 5 * 1024 * 1024,
    });

    if (createError && !createError.message.toLowerCase().includes("already exists")) {
      throw new Error(createError.message);
    }
  } else if (existing.public) {
    const { error: updateError } = await supabase.storage.updateBucket(SELLER_SUBMISSIONS_BUCKET, {
      public: false,
      fileSizeLimit: 5 * 1024 * 1024,
    });

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  return supabase;
}

function getEstimatedRange(photoCount: number, sellMode: "single_book" | "kit") {
  if (!photoCount) {
    return { min: 0, max: 0 };
  }

  if (sellMode === "single_book") {
    return {
      min: Math.max(60, photoCount * 55),
      max: Math.max(120, photoCount * 90),
    };
  }

  return {
    min: Math.max(180, photoCount * 90),
    max: Math.max(320, photoCount * 160),
  };
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getAppSessionCookieName())?.value;
    const user = await getAppUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: "Please sign in to submit books." }, { status: 401 });
    }

    if (user.role !== "parent") {
      return NextResponse.json({ error: "Driver accounts cannot create seller submissions." }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
    const sellMode = String(formData.get("sell_mode") ?? "kit") as "single_book" | "kit";

    if (!files.length) {
      return NextResponse.json({ error: "Add at least one photo before submitting." }, { status: 400 });
    }

    const activeSchoolName = String(formData.get("school_name") ?? "").trim();
    const requestedSchoolName = String(formData.get("requested_school_name") ?? "").trim();
    const schoolName = activeSchoolName || requestedSchoolName || "School request pending";
    const classLabel = String(formData.get("class_label") ?? "").trim() || "Class not shared yet";
    const academicYear = String(formData.get("academic_year") ?? "").trim() || "Year not shared yet";
    const estimate = getEstimatedRange(files.length, sellMode);

    const submission = await createSellerSubmission({
      user_id: user.id,
      seller_name: user.full_name,
      phone: user.phone,
      sell_mode: sellMode,
      school_name: schoolName,
      requested_school_name: requestedSchoolName || undefined,
      class_label: classLabel,
      academic_year: academicYear,
      book_title: String(formData.get("book_title") ?? "").trim() || undefined,
      subject_label: String(formData.get("subject_label") ?? "").trim() || undefined,
      pickup_mode: String(formData.get("pickup_mode") ?? "home_pickup") as "home_pickup" | "school_drive",
      notes: String(formData.get("notes") ?? "").trim() || undefined,
      photo_count: files.length,
      estimated_payout_min: estimate.min,
      estimated_payout_max: estimate.max,
    });

    const supabase = await ensureBucket();
    const uploadedPhotos: Array<{ storage_path: string; public_url: string }> = [];

    for (const file of files) {
      const extension = file.name.split(".").pop() || "jpg";
      const path = `${submission.id}/${randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from(SELLER_SUBMISSIONS_BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      uploadedPhotos.push({ storage_path: path, public_url: path });
    }

    await attachSubmissionPhotos(submission.id, uploadedPhotos);

    return NextResponse.json({ submission });
  } catch (error) {
    return NextResponse.json({ error: getFriendlyErrorMessage(error, "Unable to create submission.") }, { status: 400 });
  }
}
