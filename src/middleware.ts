import { NextRequest, NextResponse } from "next/server";
import { authSession } from "./lib/auth-session";

export async function middleware(request: NextRequest) {
  const session = await authSession();

  if (session?.user.role !== "admin" && request.nextUrl.pathname === "/admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|login|assets).*)",
    "/(api|trpc)(.*)",
  ],
};
