import { NextResponse } from "next/server";
import { z } from "zod";

import { getFriendlyErrorMessage } from "@/lib/api/error-message";
import { updateAdminSubmission } from "@/lib/data/queries";

const schema = z.object({
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

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const submission = await updateAdminSubmission(schema.parse(json));
    return NextResponse.json({ submission });
  } catch (error) {
    return NextResponse.json({ error: getFriendlyErrorMessage(error, "Unable to update seller review.") }, { status: 400 });
  }
}
