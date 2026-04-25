import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // List of reserved paths that should not be treated as store domains
    const reservedPaths = [
        '/api',
        '/dashboard',
        '/admin',
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/verify-otp',
        '/_next',
        '/favicon.ico',
        '/robots.txt',
        '/sitemap.xml',
        '/store' // Keep the old store route for backward compatibility
    ]

    // Check if the path starts with any reserved path
    const isReservedPath = reservedPaths.some(path => pathname.startsWith(path))

    // If it's a reserved path, continue normally
    if (isReservedPath) {
        return NextResponse.next()
    }

    // If it's a root path (/), continue normally
    if (pathname === '/') {
        return NextResponse.next()
    }

    // For all other paths, treat them as potential store domains
    // The [domain]/page.tsx will handle the actual store lookup
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}