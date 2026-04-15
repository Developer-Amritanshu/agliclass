import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getFriendlyErrorMessage } from "@/lib/api/error-message";
import { getAppSessionCookieName, getAppUserFromToken } from "@/lib/auth/user";
import { upsertDriverProfile } from "@/lib/data/queries";

const schema = z.object({
  city: z.string().min(2),
  service_areas: z.array(z.string().min(2)).min(1),
  vehicle_type: z.string().min(2),
  availability_status: z.enum(["available", "busy", "offline"]),
  accepts_pickup: z.boolean(),
  accepts_delivery: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getAppSessionCookieName())?.value;
    const user = await getAppUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: "Please sign in to manage your driver profile." }, { status: 401 });
    }

    if (user.role !== "driver") {
      return NextResponse.json({ error: "Only driver accounts can access this area." }, { status: 403 });
    }

    const json = await request.json();
    const payload = schema.parse(json);
    const profile = await upsertDriverProfile({
      user_id: user.id,
      full_name: user.full_name,
      phone: user.phone,
      ...payload,
    });

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: getFriendlyErrorMessage(error, "Unable to save driver profile.") }, { status: 400 });
  }
}
