import { z } from "zod";

import type { AppUser } from "@/lib/auth/user";
import type {
  AccountDashboardView,
  AppUserView,
  DriverDashboardView,
  DriverProfileView,
  KitView,
  OpsMetricView,
  OrderView,
  SchoolView,
  SellerSubmissionView,
  SubmissionPhotoView,
} from "@/lib/data/types";
import { getSupabaseAdminClient } from "@/lib/supabase/client";
import { supabaseConfig } from "@/lib/supabase/config";
import { SELLER_SUBMISSIONS_BUCKET } from "@/lib/supabase/storage";
import type { OrderPayload, SubmissionPayload } from "@/lib/supabase/types";

const submissionSchema = z.object({
  user_id: z.string().uuid(),
  seller_name: z.string().min(2),
  phone: z.string().min(10),
  sell_mode: z.enum(["single_book", "kit"]),
  school_name: z.string().min(2),
  requested_school_name: z.string().optional(),
  class_label: z.string().min(2),
  academic_year: z.string().min(4),
  book_title: z.string().optional(),
  subject_label: z.string().optional(),
  pickup_mode: z.enum(["home_pickup", "school_drive"]),
  notes: z.string().optional(),
  photo_count: z.coerce.number().min(0),
  estimated_payout_min: z.coerce.number().min(0),
  estimated_payout_max: z.coerce.number().min(0),
});

const orderSchema = z.object({
  user_id: z.string().uuid(),
  kit_id: z.string().min(2),
  buyer_name: z.string().min(2),
  phone: z.string().min(10),
  school_name: z.string().min(2),
  class_label: z.string().min(2),
  delivery_address: z.string().min(6),
  delivery_mode: z.enum(["home", "school"]),
  payment_mode: z.enum(["booking", "full", "cod"]),
  total_amount: z.number().positive(),
});

const schoolSchema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  board: z.string().min(2),
  city: z.string().min(2),
  district: z.string().min(2),
  category: z.enum(["private", "government"]),
  medium: z.string().min(2),
  cover_image_url: z.string().optional(),
});

const kitSchema = z.object({
  id: z.string().min(2),
  school_name: z.string().min(2),
  class_label: z.string().min(2),
  academic_year: z.string().min(4),
  completion_pct: z.coerce.number().min(0).max(100),
  quality_band: z.string().min(1),
  savings_pct: z.coerce.number().min(0).max(100),
  used_item_count: z.coerce.number().min(0),
  new_item_count: z.coerce.number().min(0),
  total_books: z.coerce.number().min(1),
  price: z.coerce.number().positive(),
  retail_price: z.coerce.number().positive(),
  hero_badge: z.string().optional(),
  status: z.enum(["verified", "partial", "waitlist"]),
});

const adminSubmissionUpdateSchema = z.object({
  id: z.string().min(2),
  pickup_driver_id: z.string().uuid().nullable().optional(),
  pickup_status: z.enum(["pending_assignment", "assigned", "picked_up"]),
  analysis_status: z.enum(["queued", "uploading", "creating_submission", "processing", "reviewed"]),
  final_offer: z.coerce.number().min(0),
  status_note: z.string().optional(),
  accepted_items: z.coerce.number().min(0),
  rejected_items: z.coerce.number().min(0),
  status: z.enum(["pickup_scheduled", "received", "graded", "settled"]),
});

const driverProfileSchema = z.object({
  user_id: z.string().uuid(),
  full_name: z.string().min(2),
  phone: z.string().min(10),
  city: z.string().min(2),
  service_areas: z.array(z.string().min(2)).min(1),
  vehicle_type: z.string().min(2),
  availability_status: z.enum(["available", "busy", "offline"]),
  accepts_pickup: z.boolean(),
  accepts_delivery: z.boolean(),
});

const adminOrderDriverSchema = z.object({
  id: z.string().min(2),
  delivery_driver_id: z.string().uuid().nullable().optional(),
  fulfillment_status: z.enum(["confirmed", "packed", "out_for_delivery", "delivered"]),
  delivery_window: z.string().min(2),
});

type DriverRow = {
  id: string;
  user_id: string;
  city: string;
  service_areas: string[] | null;
  vehicle_type: string;
  availability_status: "available" | "busy" | "offline";
  accepts_pickup: boolean;
  accepts_delivery: boolean;
  app_users: {
    full_name: string;
    phone: string;
  } | null;
};

type SubmissionRow = {
  id: string;
  seller_name: string;
  school_name: string;
  requested_school_name?: string | null;
  sell_mode: "single_book" | "kit";
  class_label: string;
  academic_year: string;
  book_title?: string | null;
  subject_label?: string | null;
  status: "pickup_scheduled" | "received" | "graded" | "settled";
  pickup_mode: "home_pickup" | "school_drive";
  pickup_status: "pending_assignment" | "assigned" | "picked_up";
  pickup_driver_id?: string | null;
  analysis_status: "queued" | "uploading" | "creating_submission" | "processing" | "reviewed";
  photo_count: number;
  estimated_payout_min: number;
  estimated_payout_max: number;
  final_offer: number;
  status_note?: string | null;
  accepted_items: number;
  rejected_items: number;
  payout: number;
};

type OrderRow = {
  id: string;
  kit_id?: string | null;
  buyer_name: string;
  school_name: string;
  class_label: string;
  fulfillment_status: "confirmed" | "packed" | "out_for_delivery" | "delivered";
  delivery_window: string;
  total_amount: number;
  delivery_driver_id?: string | null;
};

function requireAdminSupabase() {
  const supabase = getSupabaseAdminClient();

  if (!supabase || !supabaseConfig.serviceRoleKey) {
    throw new Error("Service is temporarily unavailable.");
  }

  return supabase;
}

function mapSchoolRow(school: {
  id: string;
  name: string;
  board: string;
  city: string;
  district: string;
  category: "private" | "government";
  medium: string;
  cover_image_url?: string | null;
}): SchoolView {
  return {
    id: school.id,
    name: school.name,
    board: school.board,
    city: school.city,
    district: school.district,
    category: school.category,
    medium: school.medium,
    classes: [],
    coverImage: school.cover_image_url || "/images/school-ridge.svg",
  };
}

function mapKitRow(kit: {
  id: string;
  school_name: string;
  class_label: string;
  academic_year: string;
  completion_pct: number;
  quality_band: string;
  savings_pct: number;
  used_item_count: number;
  new_item_count: number;
  total_books: number;
  price: number;
  retail_price: number;
  hero_badge?: string | null;
  status: "verified" | "partial" | "waitlist";
}): KitView {
  return {
    id: kit.id,
    schoolId: "",
    schoolName: kit.school_name,
    classLabel: kit.class_label,
    academicYear: kit.academic_year,
    completion: kit.completion_pct,
    qualityBand: (kit.quality_band === "A+" || kit.quality_band === "A" ? kit.quality_band : "Mixed") as "A+" | "A" | "Mixed",
    savingsPct: kit.savings_pct,
    usedCount: kit.used_item_count,
    newFillCount: kit.new_item_count,
    totalBooks: kit.total_books,
    price: Number(kit.price),
    retailPrice: Number(kit.retail_price),
    heroBadge: kit.hero_badge || "Verified by the AgliClass team",
    status: kit.status,
    requirements: [],
  };
}

function mapSubmissionRow(item: SubmissionRow, photos: SubmissionPhotoView[] = [], driverName?: string | null): SellerSubmissionView {
  return {
    id: item.id,
    sellerName: item.seller_name,
    schoolName: item.school_name,
    requestedSchoolName: item.requested_school_name ?? null,
    sellMode: item.sell_mode,
    classLabel: item.class_label,
    academicYear: item.academic_year,
    bookTitle: item.book_title ?? null,
    subjectLabel: item.subject_label ?? null,
    status: item.status,
    pickupMode: item.pickup_mode,
    pickupStatus: item.pickup_status,
    assignedTo: driverName ?? null,
    pickupDriverId: item.pickup_driver_id ?? null,
    analysisStatus: item.analysis_status,
    photoCount: item.photo_count,
    estimatedPayoutMin: Number(item.estimated_payout_min),
    estimatedPayoutMax: Number(item.estimated_payout_max),
    finalOffer: Number(item.final_offer),
    statusNote: item.status_note ?? null,
    acceptedItems: item.accepted_items,
    rejectedItems: item.rejected_items,
    payout: Number(item.payout),
    photos,
  };
}

function mapOrderRow(item: OrderRow, driverName?: string | null): OrderView {
  return {
    id: item.id,
    buyerName: item.buyer_name,
    kitId: item.kit_id ?? "",
    schoolName: item.school_name,
    classLabel: item.class_label,
    status: item.fulfillment_status,
    deliveryWindow: item.delivery_window,
    totalAmount: Number(item.total_amount),
    deliveryDriverId: item.delivery_driver_id ?? null,
    deliveryDriverName: driverName ?? null,
  };
}

function mapUserRow(user: AppUser): AppUserView {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

function mapDriverProfileRow(item: DriverRow): DriverProfileView {
  return {
    id: item.id,
    userId: item.user_id,
    fullName: item.app_users?.full_name ?? "Driver",
    phone: item.app_users?.phone ?? "",
    city: item.city,
    serviceAreas: item.service_areas ?? [],
    vehicleType: item.vehicle_type,
    availabilityStatus: item.availability_status,
    acceptsPickup: item.accepts_pickup,
    acceptsDelivery: item.accepts_delivery,
  };
}

async function getSubmissionPhotos(submissionIds: string[]) {
  if (!submissionIds.length) {
    return new Map<string, SubmissionPhotoView[]>();
  }

  const supabase = requireAdminSupabase();
  const { data, error } = await supabase
    .from("seller_submission_photos")
    .select("id,submission_id,storage_path")
    .in("submission_id", submissionIds)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const grouped = new Map<string, SubmissionPhotoView[]>();

  for (const row of data ?? []) {
    const { data: signed } = await supabase.storage.from(SELLER_SUBMISSIONS_BUCKET).createSignedUrl(row.storage_path, 60 * 60);
    const current = grouped.get(row.submission_id) ?? [];
    current.push({
      id: row.id,
      publicUrl: signed?.signedUrl ?? "",
      fileName: row.storage_path.split("/").pop(),
    });
    grouped.set(row.submission_id, current);
  }

  return grouped;
}

async function getDriverNameMap(driverProfileIds: string[]) {
  const uniqueIds = Array.from(new Set(driverProfileIds.filter(Boolean)));
  const map = new Map<string, string>();

  if (!uniqueIds.length) {
    return map;
  }

  const supabase = requireAdminSupabase();
  const { data, error } = await supabase
    .from("driver_profiles")
    .select("id,app_users!inner(full_name)")
    .in("id", uniqueIds);

  if (error) {
    throw new Error(error.message);
  }

  for (const row of data ?? []) {
    const appUsers = (row as any).app_users;
    const driverName = Array.isArray(appUsers) ? appUsers[0]?.full_name ?? "Driver" : appUsers?.full_name ?? "Driver";
    map.set(row.id, driverName);
  }

  return map;
}

async function getDriverLookup(task: "pickup" | "delivery") {
  const supabase = requireAdminSupabase();
  let query = supabase
    .from("driver_profiles")
    .select("id,user_id,city,service_areas,vehicle_type,availability_status,accepts_pickup,accepts_delivery,app_users!inner(full_name,phone)")
    .eq("availability_status", "available")
    .order("created_at", { ascending: true });

  query = task === "pickup" ? query.eq("accepts_pickup", true) : query.eq("accepts_delivery", true);

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((item) => mapDriverProfileRow(item as unknown as DriverRow));
}

function buildOpsMetrics(schools: SchoolView[], kits: KitView[], submissions: SellerSubmissionView[]): OpsMetricView[] {
  const readyKits = kits.filter((kit) => kit.status === "verified").length;
  const fillRate = kits.length ? Math.round(kits.reduce((sum, kit) => sum + kit.completion, 0) / kits.length) : 0;
  const assigned = submissions.filter((submission) => submission.pickupStatus !== "pending_assignment").length;

  return [
    { label: "Verified schools", value: String(schools.length), delta: "Ready for parents to browse", trend: "steady" },
    { label: "Ready kits", value: String(readyKits), delta: `${kits.length} total bundles`, trend: "steady" },
    { label: "Average completeness", value: `${fillRate}%`, delta: "Across current kits", trend: "steady" },
    { label: "Assigned pickups", value: String(assigned), delta: `${submissions.length} seller submissions`, trend: "steady" },
  ];
}

const SUBMISSION_SELECT = "id,seller_name,school_name,requested_school_name,sell_mode,class_label,academic_year,book_title,subject_label,status,pickup_mode,pickup_status,pickup_driver_id,analysis_status,photo_count,estimated_payout_min,estimated_payout_max,final_offer,status_note,accepted_items,rejected_items,payout" as const;

const ORDER_SELECT = "id,kit_id,buyer_name,school_name,class_label,fulfillment_status,delivery_window,total_amount,delivery_driver_id" as const;

export async function getBuyerPageData() {
  const supabase = requireAdminSupabase();

  const [{ data: schoolRows, error: schoolError }, { data: kitRows, error: kitError }] = await Promise.all([
    supabase.from("schools").select("id,name,board,city,district,category,medium,cover_image_url").order("name"),
    supabase
      .from("kit_bundles")
      .select("id,school_name,class_label,academic_year,completion_pct,quality_band,savings_pct,used_item_count,new_item_count,total_books,price,retail_price,hero_badge,status")
      .order("school_name"),
  ]);

  if (schoolError) throw new Error(schoolError.message);
  if (kitError) throw new Error(kitError.message);

  const kits = (kitRows ?? []).map(mapKitRow);
  const schoolClassMap = new Map<string, Set<string>>();

  for (const kit of kits) {
    const current = schoolClassMap.get(kit.schoolName) ?? new Set<string>();
    current.add(kit.classLabel);
    schoolClassMap.set(kit.schoolName, current);
  }

  const schools = (schoolRows ?? []).map((school) => {
    const mapped = mapSchoolRow(school);
    mapped.classes = Array.from(schoolClassMap.get(school.name) ?? []).sort();
    return mapped;
  });

  return { schools, kits };
}

export async function getKit(kitId: string) {
  const supabase = requireAdminSupabase();
  const { data, error } = await supabase
    .from("kit_bundles")
    .select("id,school_name,class_label,academic_year,completion_pct,quality_band,savings_pct,used_item_count,new_item_count,total_books,price,retail_price,hero_badge,status")
    .eq("id", kitId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return data ? mapKitRow(data) : null;
}

export async function getOrderForUser(orderId: string, userId: string) {
  const supabase = requireAdminSupabase();
  const { data, error } = await supabase.from("orders").select(ORDER_SELECT).eq("id", orderId).eq("user_id", userId).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const driverNames = await getDriverNameMap([data.delivery_driver_id ?? ""]);
  return mapOrderRow(data as OrderRow, driverNames.get(data.delivery_driver_id ?? "") ?? null);
}

export async function getSubmissionForUser(submissionId: string, userId: string) {
  const supabase = requireAdminSupabase();
  const { data, error } = await supabase.from("seller_submissions").select(SUBMISSION_SELECT).eq("id", submissionId).eq("user_id", userId).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const [photos, driverNames] = await Promise.all([
    getSubmissionPhotos([data.id]),
    getDriverNameMap([data.pickup_driver_id ?? ""]),
  ]);
  return mapSubmissionRow(data as SubmissionRow, photos.get(data.id) ?? [], driverNames.get(data.pickup_driver_id ?? "") ?? null);
}

export async function getAccountDashboardData(user: AppUser): Promise<AccountDashboardView> {
  const supabase = requireAdminSupabase();

  const [{ data: orderRows, error: orderError }, { data: submissionRows, error: submissionError }] = await Promise.all([
    supabase.from("orders").select(ORDER_SELECT).eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("seller_submissions").select(SUBMISSION_SELECT).eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  if (orderError) throw new Error(orderError.message);
  if (submissionError) throw new Error(submissionError.message);

  const submissionIds = (submissionRows ?? []).map((item) => item.id);
  const driverIds = [
    ...(submissionRows ?? []).map((item) => item.pickup_driver_id ?? ""),
    ...(orderRows ?? []).map((item) => item.delivery_driver_id ?? ""),
  ];

  const [photos, driverNames] = await Promise.all([getSubmissionPhotos(submissionIds), getDriverNameMap(driverIds)]);

  return {
    user: mapUserRow(user),
    orders: (orderRows ?? []).map((item) => mapOrderRow(item as OrderRow, driverNames.get(item.delivery_driver_id ?? "") ?? null)),
    submissions: (submissionRows ?? []).map((item) => mapSubmissionRow(item as SubmissionRow, photos.get(item.id) ?? [], driverNames.get(item.pickup_driver_id ?? "") ?? null)),
  };
}

export async function getDriverDashboardData(user: AppUser): Promise<DriverDashboardView> {
  const supabase = requireAdminSupabase();
  const { data: profileRow, error: profileError } = await supabase
    .from("driver_profiles")
    .select("id,user_id,city,service_areas,vehicle_type,availability_status,accepts_pickup,accepts_delivery,app_users!inner(full_name,phone)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const [{ data: pickupRows, error: pickupError }, { data: orderRows, error: orderError }] = await Promise.all([
    supabase.from("seller_submissions").select(SUBMISSION_SELECT).eq("pickup_driver_id", profileRow?.id ?? "").order("created_at", { ascending: false }),
    supabase.from("orders").select(ORDER_SELECT).eq("delivery_driver_id", profileRow?.id ?? "").order("created_at", { ascending: false }),
  ]);

  if (pickupError) throw new Error(pickupError.message);
  if (orderError) throw new Error(orderError.message);

  const submissionIds = (pickupRows ?? []).map((item) => item.id);
  const photos = await getSubmissionPhotos(submissionIds);

  return {
    user: mapUserRow(user),
    profile: profileRow ? mapDriverProfileRow(profileRow as unknown as DriverRow) : null,
    pickupAssignments: (pickupRows ?? []).map((item) => mapSubmissionRow(item as SubmissionRow, photos.get(item.id) ?? [], user.full_name)),
    deliveryAssignments: (orderRows ?? []).map((item) => mapOrderRow(item as OrderRow, user.full_name)),
  };
}

export async function upsertDriverProfile(payload: unknown) {
  const parsed = driverProfileSchema.parse(payload);
  const supabase = requireAdminSupabase();

  const { data, error } = await supabase
    .from("driver_profiles")
    .upsert(
      {
        user_id: parsed.user_id,
        city: parsed.city,
        service_areas: parsed.service_areas,
        vehicle_type: parsed.vehicle_type,
        availability_status: parsed.availability_status,
        accepts_pickup: parsed.accepts_pickup,
        accepts_delivery: parsed.accepts_delivery,
      },
      { onConflict: "user_id" },
    )
    .select("id,user_id,city,service_areas,vehicle_type,availability_status,accepts_pickup,accepts_delivery,app_users!inner(full_name,phone)")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to save driver profile.");
  }

  return mapDriverProfileRow(data as unknown as DriverRow);
}

export async function getAvailableDrivers(task: "pickup" | "delivery") {
  return getDriverLookup(task);
}

export async function getAdminOverviewData() {
  const [buyerData, submissions, orders] = await Promise.all([
    getBuyerPageData(),
    getAdminSubmissionQueue(),
    getAdminOrdersData(),
  ]);

  return {
    kits: buyerData.kits,
    opsMetrics: buildOpsMetrics(buyerData.schools, buyerData.kits, submissions.items),
    sellerSubmissions: submissions.items,
    orders: orders.items,
    schools: buyerData.schools,
  };
}

export async function getAdminSchoolsData() {
  const { schools } = await getBuyerPageData();
  return schools;
}

export async function getAdminKitsData() {
  const { kits } = await getBuyerPageData();
  return kits;
}

export async function getAdminOrdersData() {
  const supabase = requireAdminSupabase();
  const [drivers, ordersResult] = await Promise.all([
    getDriverLookup("delivery"),
    supabase.from("orders").select(ORDER_SELECT).order("created_at", { ascending: false }).limit(20),
  ]);

  if (ordersResult.error) throw new Error(ordersResult.error.message);

  const driverNames = await getDriverNameMap((ordersResult.data ?? []).map((item) => item.delivery_driver_id ?? ""));

  return {
    items: (ordersResult.data ?? []).map((item) => mapOrderRow(item as OrderRow, driverNames.get(item.delivery_driver_id ?? "") ?? null)),
    drivers,
  };
}

export async function getAdminSubmissionQueue() {
  const supabase = requireAdminSupabase();
  const [drivers, submissionsResult] = await Promise.all([
    getDriverLookup("pickup"),
    supabase.from("seller_submissions").select(SUBMISSION_SELECT).order("created_at", { ascending: false }),
  ]);

  if (submissionsResult.error) throw new Error(submissionsResult.error.message);

  const ids = (submissionsResult.data ?? []).map((item) => item.id);
  const driverNamesPromise = getDriverNameMap((submissionsResult.data ?? []).map((item) => item.pickup_driver_id ?? ""));
  const [photos, driverNames] = await Promise.all([getSubmissionPhotos(ids), driverNamesPromise]);

  return {
    items: (submissionsResult.data ?? []).map((item) => mapSubmissionRow(item as SubmissionRow, photos.get(item.id) ?? [], driverNames.get(item.pickup_driver_id ?? "") ?? null)),
    drivers,
  };
}

export async function createSellerSubmission(payload: SubmissionPayload) {
  const parsed = submissionSchema.parse(payload);
  const supabase = requireAdminSupabase();

  const { data, error } = await supabase
    .from("seller_submissions")
    .insert({
      user_id: parsed.user_id,
      seller_name: parsed.seller_name,
      phone: parsed.phone,
      sell_mode: parsed.sell_mode,
      school_name: parsed.school_name,
      requested_school_name: parsed.requested_school_name || null,
      class_label: parsed.class_label,
      academic_year: parsed.academic_year,
      book_title: parsed.book_title || null,
      subject_label: parsed.subject_label || null,
      pickup_mode: parsed.pickup_mode,
      notes: parsed.notes ?? null,
      photo_count: parsed.photo_count,
      estimated_payout_min: parsed.estimated_payout_min,
      estimated_payout_max: parsed.estimated_payout_max,
      status: "pickup_scheduled",
      pickup_status: "pending_assignment",
      analysis_status: "creating_submission",
      status_note: "Your photos are in review. We will assign pickup after a human check.",
      accepted_items: 0,
      rejected_items: 0,
      payout: 0,
      final_offer: 0,
    })
    .select(SUBMISSION_SELECT)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to create seller submission");
  }

  return mapSubmissionRow(data as SubmissionRow);
}

export async function attachSubmissionPhotos(submissionId: string, photos: Array<{ storage_path: string; public_url: string }>) {
  if (!photos.length) {
    return;
  }

  const supabase = requireAdminSupabase();
  const { error } = await supabase.from("seller_submission_photos").insert(
    photos.map((photo) => ({
      submission_id: submissionId,
      storage_path: photo.storage_path,
      public_url: photo.public_url,
    })),
  );

  if (error) {
    throw new Error(error.message);
  }

  await supabase
    .from("seller_submissions")
    .update({ analysis_status: "processing", status_note: "Your photos are uploaded. Our team is reviewing the books and planning pickup." })
    .eq("id", submissionId);
}

export async function createOrder(payload: OrderPayload) {
  const parsed = orderSchema.parse(payload);
  const supabase = requireAdminSupabase();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: parsed.user_id,
      kit_id: parsed.kit_id,
      buyer_name: parsed.buyer_name,
      phone: parsed.phone,
      school_name: parsed.school_name,
      class_label: parsed.class_label,
      delivery_address: parsed.delivery_address,
      delivery_mode: parsed.delivery_mode,
      payment_mode: parsed.payment_mode,
      total_amount: parsed.total_amount,
      fulfillment_status: "confirmed",
      delivery_window: "Our team will confirm your delivery slot shortly",
    })
    .select(ORDER_SELECT)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to create order");
  }

  return mapOrderRow(data as OrderRow);
}

export async function createSchool(payload: unknown) {
  const parsed = schoolSchema.parse(payload);
  const supabase = requireAdminSupabase();

  const { data, error } = await supabase
    .from("schools")
    .upsert({
      id: parsed.id,
      name: parsed.name,
      slug: parsed.id,
      board: parsed.board,
      city: parsed.city,
      district: parsed.district,
      category: parsed.category,
      medium: parsed.medium,
      cover_image_url: parsed.cover_image_url ?? null,
    })
    .select("id,name,board,city,district,category,medium,cover_image_url")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to save school");
  }

  return mapSchoolRow(data);
}

export async function deleteSchool(id: string) {
  const supabase = requireAdminSupabase();
  const { error } = await supabase.from("schools").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}

export async function createKit(payload: unknown) {
  const parsed = kitSchema.parse(payload);
  const supabase = requireAdminSupabase();

  const { data, error } = await supabase
    .from("kit_bundles")
    .upsert(parsed)
    .select("id,school_name,class_label,academic_year,completion_pct,quality_band,savings_pct,used_item_count,new_item_count,total_books,price,retail_price,hero_badge,status")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to save kit");
  }

  return mapKitRow(data);
}

export async function deleteKit(id: string) {
  const supabase = requireAdminSupabase();
  const { error } = await supabase.from("kit_bundles").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}

export async function updateAdminSubmission(payload: unknown) {
  const parsed = adminSubmissionUpdateSchema.parse(payload);
  const supabase = requireAdminSupabase();

  const { data, error } = await supabase
    .from("seller_submissions")
    .update({
      pickup_driver_id: parsed.pickup_driver_id ?? null,
      pickup_status: parsed.pickup_status,
      analysis_status: parsed.analysis_status,
      final_offer: parsed.final_offer,
      status_note: parsed.status_note ?? null,
      accepted_items: parsed.accepted_items,
      rejected_items: parsed.rejected_items,
      status: parsed.status,
      payout: parsed.status === "settled" ? parsed.final_offer : 0,
    })
    .eq("id", parsed.id)
    .select(SUBMISSION_SELECT)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to update submission");
  }

  const [photos, driverNames] = await Promise.all([
    getSubmissionPhotos([parsed.id]),
    getDriverNameMap([parsed.pickup_driver_id ?? ""]),
  ]);
  return mapSubmissionRow(data as SubmissionRow, photos.get(parsed.id) ?? [], driverNames.get(parsed.pickup_driver_id ?? "") ?? null);
}

export async function updateAdminOrderDriver(payload: unknown) {
  const parsed = adminOrderDriverSchema.parse(payload);
  const supabase = requireAdminSupabase();

  const { data, error } = await supabase
    .from("orders")
    .update({
      delivery_driver_id: parsed.delivery_driver_id ?? null,
      fulfillment_status: parsed.fulfillment_status,
      delivery_window: parsed.delivery_window,
    })
    .eq("id", parsed.id)
    .select(ORDER_SELECT)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to update delivery assignment.");
  }

  const driverNames = await getDriverNameMap([parsed.delivery_driver_id ?? ""]);
  return mapOrderRow(data as OrderRow, driverNames.get(parsed.delivery_driver_id ?? "") ?? null);
}

export function getConfigurationError() {
  if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
    return "AgliClass is still being configured. Please check back shortly.";
  }

  return null;
}





type InventoryRow = {
  id: string;
  book_id: string | null;
  grade: "A+" | "A" | "B";
  qc_status: string;
  refurb_status: string;
  status: string;
  master_book_catalog: {
    title: string;
    subject: string;
    publisher: string;
    language: string;
    isbn13?: string | null;
    binding?: string | null;
  } | null;
};

const inventorySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2),
  subject: z.string().min(2),
  publisher: z.string().min(2),
  language: z.string().min(2),
  isbn13: z.string().optional(),
  binding: z.string().optional(),
  edition_label: z.string().optional(),
  publication_year: z.coerce.number().int().optional(),
  grade: z.enum(["A+", "A", "B"]),
  qc_status: z.string().min(2),
  refurb_status: z.string().min(2),
  status: z.string().min(2),
  notes: z.string().optional(),
});

function slugifyWorkKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function mapInventoryRow(item: InventoryRow) {
  return {
    id: item.id,
    bookId: item.book_id,
    title: item.master_book_catalog?.title ?? "Untitled book",
    subject: item.master_book_catalog?.subject ?? "General",
    publisher: item.master_book_catalog?.publisher ?? "Unknown publisher",
    language: item.master_book_catalog?.language ?? "Unknown",
    isbn13: item.master_book_catalog?.isbn13 ?? null,
    binding: item.master_book_catalog?.binding ?? null,
    grade: item.grade,
    qcStatus: item.qc_status,
    refurbStatus: item.refurb_status,
    status: item.status,
  };
}

export async function getAdminInventoryData() {
  const supabase = requireAdminSupabase();
  const { data, error } = await supabase
    .from("inventory")
    .select("id,book_id,grade,qc_status,refurb_status,status,master_book_catalog(title,subject,publisher,language,isbn13,binding)")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((item) => mapInventoryRow(item as unknown as InventoryRow));
}

export async function createInventoryEntry(payload: unknown) {
  const parsed = inventorySchema.parse(payload);
  const supabase = requireAdminSupabase();
  const workKey = slugifyWorkKey(`${parsed.title}-${parsed.publisher}-${parsed.language}`) || `book-${Date.now()}`;

  const { data: book, error: bookError } = await supabase
    .from("master_book_catalog")
    .insert({
      work_key: workKey,
      isbn13: parsed.isbn13 || null,
      title: parsed.title,
      subject: parsed.subject,
      publisher: parsed.publisher,
      language: parsed.language,
      binding: parsed.binding || null,
    })
    .select("id,title,subject,publisher,language,isbn13,binding")
    .single();

  if (bookError || !book) {
    throw new Error(bookError?.message ?? "Unable to create book catalog entry.");
  }

  let editionId: string | null = null;

  if (parsed.edition_label || parsed.publication_year) {
    const { data: edition, error: editionError } = await supabase
      .from("book_editions")
      .insert({
        book_id: book.id,
        edition_label: parsed.edition_label || null,
        publication_year: parsed.publication_year || null,
      })
      .select("id")
      .single();

    if (editionError || !edition) {
      throw new Error(editionError?.message ?? "Unable to create edition entry.");
    }

    editionId = edition.id;
  }

  const { data: inventory, error: inventoryError } = await supabase
    .from("inventory")
    .insert({
      book_id: book.id,
      edition_id: editionId,
      grade: parsed.grade,
      qc_status: parsed.qc_status,
      refurb_status: parsed.refurb_status,
      status: parsed.status,
    })
    .select("id,book_id,grade,qc_status,refurb_status,status,master_book_catalog(title,subject,publisher,language,isbn13,binding)")
    .single();

  if (inventoryError || !inventory) {
    throw new Error(inventoryError?.message ?? "Unable to create inventory entry.");
  }

  return mapInventoryRow(inventory as unknown as InventoryRow);
}

export async function updateInventoryEntry(payload: unknown) {
  const parsed = inventorySchema.parse(payload);

  if (!parsed.id) {
    throw new Error("Inventory id is required.");
  }

  const supabase = requireAdminSupabase();
  const { data: existing, error: existingError } = await supabase
    .from("inventory")
    .select("id,book_id")
    .eq("id", parsed.id)
    .single();

  if (existingError || !existing?.book_id) {
    throw new Error(existingError?.message ?? "Inventory item not found.");
  }

  const { error: bookError } = await supabase
    .from("master_book_catalog")
    .update({
      isbn13: parsed.isbn13 || null,
      title: parsed.title,
      subject: parsed.subject,
      publisher: parsed.publisher,
      language: parsed.language,
      binding: parsed.binding || null,
    })
    .eq("id", existing.book_id);

  if (bookError) {
    throw new Error(bookError.message);
  }

  const { data: inventory, error: inventoryError } = await supabase
    .from("inventory")
    .update({
      grade: parsed.grade,
      qc_status: parsed.qc_status,
      refurb_status: parsed.refurb_status,
      status: parsed.status,
    })
    .eq("id", parsed.id)
    .select("id,book_id,grade,qc_status,refurb_status,status,master_book_catalog(title,subject,publisher,language,isbn13,binding)")
    .single();

  if (inventoryError || !inventory) {
    throw new Error(inventoryError?.message ?? "Unable to update inventory entry.");
  }

  return mapInventoryRow(inventory as unknown as InventoryRow);
}

export async function deleteInventoryEntry(id: string) {
  const supabase = requireAdminSupabase();
  const { error } = await supabase.from("inventory").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}

