import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminSessionValue, getAdminCookieName } from "@/lib/auth/admin";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const { username, password } = schema.parse(await request.json());
    const expectedUsername = process.env.ADMIN_USERNAME?.trim();
    const expectedPassword = process.env.ADMIN_PASSWORD?.trim();

    if (!expectedUsername || !expectedPassword || username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json({ error: "The admin credentials are incorrect." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(getAdminCookieName(), await createAdminSessionValue(username), {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to sign in." }, { status: 400 });
  }
}
