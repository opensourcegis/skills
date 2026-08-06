import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth, isGoogleAuthConfigured } from "@/auth";

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const needsAuth =
    path.startsWith("/contribute") ||
    path.startsWith("/courses/new") ||
    Boolean(path.match(/\/skillsets\/.+\/edit$/)) ||
    Boolean(path.match(/\/courses\/.+\/edit$/));

  if (!needsAuth) {
    return NextResponse.next();
  }

  if (!isGoogleAuthConfigured()) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", path);
    signInUrl.searchParams.set("error", "Config");
    return NextResponse.redirect(signInUrl);
  }

  const session = await auth();
  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/contribute/:path*",
    "/courses/new",
    "/skillsets/:path*/edit",
    "/courses/:path*/edit",
  ],
};
