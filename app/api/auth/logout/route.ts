import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { clearAppSession, getAppSessionCookieName } from "@/lib/auth/user";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAppSessionCookieName())?.value;
  await clearAppSession(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAppSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}
