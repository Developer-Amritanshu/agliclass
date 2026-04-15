import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getFriendlyErrorMessage } from "@/lib/api/error-message";
import { getAppSessionCookieName, getAppUserFromToken } from "@/lib/auth/user";
import { createOrder } from "@/lib/data/queries";

const schema = z.object({
  kit_id: z.string().min(2),
  school_name: z.string().min(2),
  class_label: z.string().min(2),
  delivery_address: z.string().min(6),
  delivery_mode: z.enum(["home", "school"]),
  payment_mode: z.enum(["booking", "full", "cod"]),
  total_amount: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getAppSessionCookieName())?.value;
    const user = await getAppUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: "Please sign in to place your order." }, { status: 401 });
    }

    if (user.role !== "parent") {
      return NextResponse.json({ error: "Driver accounts cannot place kit orders." }, { status: 403 });
    }

    const json = await request.json();
    const payload = schema.parse(json);
    const order = await createOrder({
      ...payload,
      user_id: user.id,
      buyer_name: user.full_name,
      phone: user.phone,
    });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: getFriendlyErrorMessage(error, "Unable to place your order.") }, { status: 400 });
  }
}
