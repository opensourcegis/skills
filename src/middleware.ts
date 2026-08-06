import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth, isGoogleAuthConfigured } from "@/auth";

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const needsAuth =
    path.startsWith("/contribute") || Boolean(path.match(/\/skillsets\/.+\/edit$/));

  if (!needsAuth || !isGoogleAuthConfigured()) {
    return NextResponse.next();
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
  matcher: ["/contribute/:path*", "/skillsets/:path*/edit"],
};
