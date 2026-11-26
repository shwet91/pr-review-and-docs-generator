
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // No session cookie? Redirect to sign-in.
  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);

    // Remember the page the user wanted to visit.
    signInUrl.searchParams.set(
      "callbackURL",
      request.nextUrl.pathname
    );

    return NextResponse.redirect(signInUrl);
  }

  // Cookie exists: allow the request to continue.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
