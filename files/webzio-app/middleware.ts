import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'MySECRETKEY9142517255'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // TEMPORARY: Disable middleware completely for testing
    console.log('🔓 Middleware bypassed for testing - path:', path)
    return NextResponse.next()

    /* Original middleware code - commented out for testing
    // Check if it's an admin route (but not the login page)
    if (path.startsWith('/admin') && path !== '/admin/login') {
        // Get token from cookies
        const token = request.cookies.get('token')?.value

        console.log('🔐 Middleware check for:', path)
        console.log('🍪 Token present:', !!token)

        // TEMPORARY: Allow dummy token for testing
        if (token === 'dummy-admin-token-12345') {
            console.log('✅ Dummy admin token - access granted')
            return NextResponse.next()
        }

        // If no token, redirect to admin login
        if (!token) {
            console.log('🔒 No token found, redirecting to admin login')
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // Verify JWT token and check role
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any
            console.log('✅ Token verified, user:', decoded.email, 'role:', decoded.role)

            // Check if user has admin or superadmin role
            if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
                console.log('❌ Insufficient permissions, role:', decoded.role)
                return NextResponse.redirect(new URL('/admin/login', request.url))
            }

            // Token is valid and user is admin/superadmin - allow access
            console.log('✅ Access granted to admin panel')
            return NextResponse.next()
        } catch (error: any) {
            console.log('❌ Invalid token:', error.message)
            // Invalid token, redirect to login
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
    */
}

export const config = {
    matcher: ['/admin/:path*']
}
