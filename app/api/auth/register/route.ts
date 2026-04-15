import { NextResponse } from "next/server";
import { z } from "zod";

import { getFriendlyErrorMessage } from "@/lib/api/error-message";
import { getAppSessionCookieName, registerAppUser } from "@/lib/auth/user";

const schema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  role: z.enum(["parent", "driver"]).default("parent"),
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const { user, sessionToken } = await registerAppUser(payload);
    const response = NextResponse.json({ user });
    response.cookies.set(getAppSessionCookieName(), sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: getFriendlyErrorMessage(error, "Unable to create account.") }, { status: 400 });
  }
}
