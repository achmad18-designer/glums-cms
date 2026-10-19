
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/auth/login"];

const LOGIN_URL = "/auth/login";
const DASHBOARD_URL = "/cms/dashboard";

const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://DOMAIN-LANDING-PAGE-KAMU",
];

const CORS_HEADERS = {
    "Access-Control-Allow-Methods":
        "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
        "Content-Type, Authorization",
};

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // Handle CORS for API routes only.
    if (pathname.startsWith("/api/")) {
        const origin = request.headers.get("origin");
        const isAllowedOrigin =
            origin !== null && ALLOWED_ORIGINS.includes(origin);

        // Handle browser preflight before authentication logic.
        if (request.method === "OPTIONS") {
            const headers = new Headers(CORS_HEADERS);
            headers.set("Vary", "Origin");

            if (isAllowedOrigin && origin) {
                headers.set("Access-Control-Allow-Origin", origin);
            }

            return new NextResponse(null, {
                status: 204,
                headers,
            });
        }

        const response = NextResponse.next();

        if (isAllowedOrigin && origin) {
            response.headers.set(
                "Access-Control-Allow-Origin",
                origin,
            );
        }

        response.headers.set("Vary", "Origin");

        Object.entries(CORS_HEADERS).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;
    }

    // Existing CMS authentication logic.
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

    // Redirect authenticated users away from login.
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
        "/api/:path*",
    ],
};
