export type SubmissionPayload = {
  user_id: string;
  seller_name: string;
  phone: string;
  sell_mode: "single_book" | "kit";
  school_name: string;
  requested_school_name?: string;
  class_label: string;
  academic_year: string;
  book_title?: string;
  subject_label?: string;
  pickup_mode: "home_pickup" | "school_drive";
  notes?: string;
  photo_count: number;
  estimated_payout_min: number;
  estimated_payout_max: number;
};

export type OrderPayload = {
  user_id: string;
  kit_id: string;
  buyer_name: string;
  phone: string;
  school_name: string;
  class_label: string;
  delivery_address: string;
  delivery_mode: "home" | "school";
  payment_mode: "booking" | "full" | "cod";
  total_amount: number;
};
