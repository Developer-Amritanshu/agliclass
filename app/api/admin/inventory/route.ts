import { NextResponse } from "next/server";
import { z } from "zod";

import { createInventoryEntry, deleteInventoryEntry, updateInventoryEntry } from "@/lib/data/queries";

const schema = z.object({
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

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const item = await createInventoryEntry(schema.parse(json));
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create inventory entry" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const json = await request.json();
    const item = await updateInventoryEntry(schema.parse(json));
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update inventory entry" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      throw new Error("Inventory id is required");
    }

    const result = await deleteInventoryEntry(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete inventory entry" }, { status: 400 });
  }
}
