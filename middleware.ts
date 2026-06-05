import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get("admin-auth")?.value;
  if (token !== ADMIN_PASSWORD) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
