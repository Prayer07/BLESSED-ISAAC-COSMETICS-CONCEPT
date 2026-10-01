import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

const PUBLIC_ROUTES = ["/", "/login"];
const PUBLIC_PREFIXES = ["/products", "/cart"];
const ADMIN_ROUTES = ["/admin"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;

  let role: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      role = (payload.role as string) ?? null;
    } catch {
      // invalid or expired token, treat as logged out
    }
  }

  const isPublic =
  PUBLIC_ROUTES.includes(pathname) ||
  PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  // Not logged in, trying to hit a protected page
  if (!role && !isPublic) {
    const url = new URL("/login", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Already logged in, no need to see the login page
  if (role && pathname === "/login") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Role check
  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};