import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Performs a cheap early redirect when the session cookie is absent. The cookie
 * is not proof of a valid session: protected server layouts and data functions
 * always verify the session with Better Auth.
 */
export function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/tasks/:path*", "/messages/:path*"],
};
