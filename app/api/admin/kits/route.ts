import { NextResponse } from "next/server";
import { z } from "zod";

import { createKit, deleteKit } from "@/lib/data/queries";

const schema = z.object({
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

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const kit = await createKit(schema.parse(json));
    return NextResponse.json({ kit });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create kit" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      throw new Error("Kit id is required");
    }

    const result = await deleteKit(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete kit" }, { status: 400 });
  }
}
