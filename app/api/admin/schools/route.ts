import { NextResponse } from "next/server";
import { z } from "zod";

import { createSchool, deleteSchool } from "@/lib/data/queries";

const schema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  board: z.string().min(2),
  city: z.string().min(2),
  district: z.string().min(2),
  category: z.enum(["private", "government"]),
  medium: z.string().min(2),
  cover_image_url: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const school = await createSchool(schema.parse(json));
    return NextResponse.json({ school });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create school" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      throw new Error("School id is required");
    }

    const result = await deleteSchool(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete school" }, { status: 400 });
  }
}
