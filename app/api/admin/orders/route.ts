import { NextResponse } from "next/server";
import { z } from "zod";

import { getFriendlyErrorMessage } from "@/lib/api/error-message";
import { updateAdminOrderDriver } from "@/lib/data/queries";

const schema = z.object({
  id: z.string().min(2),
  delivery_driver_id: z.string().uuid().nullable().optional(),
  fulfillment_status: z.enum(["confirmed", "packed", "out_for_delivery", "delivered"]),
  delivery_window: z.string().min(2),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const order = await updateAdminOrderDriver(schema.parse(json));
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: getFriendlyErrorMessage(error, "Unable to update delivery assignment.") }, { status: 400 });
  }
}
