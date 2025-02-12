import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

const unprotectedRoutes = ["/login"];

export default async function middleware(request: NextRequest) {
  const { auth } = NextAuth(authConfig);

  const session = await auth();

  const isProtected = !unprotectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (!session && isProtected) {
    const absoluteURL = new URL("/login", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
