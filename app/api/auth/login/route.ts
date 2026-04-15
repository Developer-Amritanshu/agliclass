import { NextResponse } from "next/server";
import { z } from "zod";

import { getFriendlyErrorMessage } from "@/lib/api/error-message";
import { getAppSessionCookieName, loginAppUser } from "@/lib/auth/user";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const { user, sessionToken } = await loginAppUser(payload);
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
    return NextResponse.json({ error: getFriendlyErrorMessage(error, "Unable to sign in.") }, { status: 400 });
  }
}
