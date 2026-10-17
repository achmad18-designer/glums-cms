
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/auth/login"];

const LOGIN_URL = "/auth/login";
const DASHBOARD_URL = "/cms/dashboard";

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const refreshToken = request.cookies.get("refreshToken")?.value;

    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`),
    );

    const isCmsRoute =
        pathname === "/cms" ||
        pathname.startsWith("/cms/");

    // Redirect root to the appropriate page.
    if (pathname === "/") {
        return NextResponse.redirect(
            new URL(
                refreshToken ? DASHBOARD_URL : LOGIN_URL,
                request.url,
            ),
        );
    }

    // Redirect /cms to the dashboard.
    if (pathname === "/cms") {
        return NextResponse.redirect(
            new URL(DASHBOARD_URL, request.url),
        );
    }

    // Redirect authenticated users away from the login page.
    if (isPublicRoute && refreshToken) {
        return NextResponse.redirect(
            new URL(DASHBOARD_URL, request.url),
        );
    }

    // Allow non-CMS routes to continue.
    if (!isCmsRoute) {
        return NextResponse.next();
    }

    // Redirect unauthenticated users to login.
    if (!refreshToken) {
        const loginUrl = new URL(LOGIN_URL, request.url);

        loginUrl.searchParams.set(
            "callbackUrl",
            `${pathname}${search}`,
        );

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/cms",
        "/cms/:path*",
        "/auth/login",
    ],
};
