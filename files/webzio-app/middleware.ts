import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'MySECRETKEY9142517255'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Check if it's an admin route (but not the login page)
    if (path.startsWith('/admin') && path !== '/admin/login') {
        // Get token from cookies
        const token = request.cookies.get('token')?.value

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

            // Token is valid and user is admin/superadmin
            return NextResponse.next()
        } catch (error) {
            console.log('❌ Invalid token, redirecting to admin login')
            // Invalid token, redirect to login
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*']
}
