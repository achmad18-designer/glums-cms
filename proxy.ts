import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const dashboardUrl = new URL('/cms/dashboard', request.url)

    if (pathname === '/' || pathname === '/cms') {
        return NextResponse.redirect(dashboardUrl);
    }

    // const isPublicRoute = PUBLIC_ROUTES.some(
    //     (route) =>
    //         pathname === route ||
    //         pathname.startsWith(`${route}/`),
    // );

    // const isCmsRoute =
    //     pathname === '/cms' ||
    //     pathname.startsWith('/cms/');

    // if (!isCmsRoute) {
    //     return NextResponse.next();
    // }

    // const refreshToken = request.cookies.get('refreshToken')?.value;

    // if (!refreshToken && !isPublicRoute) {
    //     const loginUrl = new URL('/auth/login', request.url);

    //     loginUrl.searchParams.set(
    //         'callbackUrl',
    //         pathname,
    //     );

    //     return NextResponse.redirect(loginUrl);
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/cms',
        // '/cms/:path*',
    ],
};