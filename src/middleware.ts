import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
export async function middleware(req: NextRequest) {
  // const url = req.nextUrl;
  // const hostname = req.headers.get("host") || "";
  // const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";
  // if (hostname.endsWith(`.${rootDomain}`)) {
  //   const tenantSlug = hostname.replace(`.${rootDomain}`, "");
  //   return NextResponse.rewrite(
  //     new URL(`/tenants/${tenantSlug}${url.pathname}`, req.url)
  //   );
  // }
  return NextResponse.next();
}
