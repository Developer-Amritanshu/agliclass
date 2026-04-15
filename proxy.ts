import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getAdminCookieName, verifyAdminSessionValue } from "@/lib/auth/admin";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";
  const isAdminLoginApi = pathname === "/api/admin/login";
  const isAdminLogoutApi = pathname === "/api/admin/logout";

  if (isAdminLoginApi || isAdminLogoutApi) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(getAdminCookieName())?.value;
  const isAuthenticated = await verifyAdminSessionValue(cookie);

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if ((isAdminPage && !isLoginPage) || isAdminApi) {
    if (!isAuthenticated) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Admin login required." }, { status: 401 });
      }

      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
