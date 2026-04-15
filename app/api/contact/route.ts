import { NextResponse } from "next/server";
import { z } from "zod";

import { getContactErrorMessage, sendContactEmail } from "@/lib/contact";

const requestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(10).max(4000),
  website: z.string().optional().default(""),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = requestSchema.parse(json);

    if (payload.website) {
      return NextResponse.json({ delivered: true, fallbackMailto: null });
    }

    const result = await sendContactEmail({
      name: payload.name,
      email: payload.email,
      message: payload.message,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: getContactErrorMessage(error) }, { status: 400 });
  }
}
