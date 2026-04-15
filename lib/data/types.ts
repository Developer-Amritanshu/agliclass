export type SchoolView = {
  id: string;
  name: string;
  board: string;
  city: string;
  district: string;
  category: "private" | "government";
  medium: string;
  classes: string[];
  coverImage: string;
};

export type KitRequirementView = {
  slot: number;
  subject: string;
  title: string;
  publisher: string;
  isMandatory: boolean;
  matchedType: "used" | "new_fill" | "missing";
  grade?: "A+" | "A" | "B";
};

export type KitView = {
  id: string;
  schoolId: string;
  schoolName: string;
  classLabel: string;
  academicYear: string;
  completion: number;
  qualityBand: "A+" | "A" | "Mixed";
  savingsPct: number;
  usedCount: number;
  newFillCount: number;
  totalBooks: number;
  price: number;
  retailPrice: number;
  heroBadge: string;
  status: "verified" | "partial" | "waitlist";
  requirements: KitRequirementView[];
};

export type SubmissionPhotoView = {
  id: string;
  publicUrl: string;
  fileName?: string;
};

export type SellerSubmissionView = {
  id: string;
  sellerName: string;
  schoolName: string;
  requestedSchoolName?: string | null;
  sellMode: "single_book" | "kit";
  classLabel: string;
  academicYear: string;
  bookTitle?: string | null;
  subjectLabel?: string | null;
  status: "pickup_scheduled" | "received" | "graded" | "settled";
  pickupMode: "home_pickup" | "school_drive";
  pickupStatus: "pending_assignment" | "assigned" | "picked_up";
  assignedTo?: string | null;
  pickupDriverId?: string | null;
  analysisStatus: "queued" | "uploading" | "creating_submission" | "processing" | "reviewed";
  photoCount: number;
  estimatedPayoutMin: number;
  estimatedPayoutMax: number;
  finalOffer: number;
  statusNote?: string | null;
  acceptedItems: number;
  rejectedItems: number;
  payout: number;
  photos?: SubmissionPhotoView[];
};

export type OrderView = {
  id: string;
  buyerName: string;
  kitId: string;
  schoolName: string;
  classLabel: string;
  status: "confirmed" | "packed" | "out_for_delivery" | "delivered";
  deliveryWindow: string;
  totalAmount: number;
  deliveryDriverId?: string | null;
  deliveryDriverName?: string | null;
};

export type OpsMetricView = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "steady";
};

export type AppUserView = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "parent" | "driver";
};

export type DriverProfileView = {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  city: string;
  serviceAreas: string[];
  vehicleType: string;
  availabilityStatus: "available" | "busy" | "offline";
  acceptsPickup: boolean;
  acceptsDelivery: boolean;
};

export type DriverDashboardView = {
  user: AppUserView;
  profile: DriverProfileView | null;
  pickupAssignments: SellerSubmissionView[];
  deliveryAssignments: OrderView[];
};

export type AccountDashboardView = {
  user: AppUserView;
  orders: OrderView[];
  submissions: SellerSubmissionView[];
};
