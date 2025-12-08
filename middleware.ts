import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        // Always allow access to login page without any checks
        if (pathname === '/admin/login' || pathname === '/admin/login/') {
            return NextResponse.next();
        }

        // For all other admin routes, check authentication
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            // Redirect to login if no token
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Verify token
        const payload = await verifyToken(token);
        if (!payload) {
            // Redirect to login if token is invalid
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('admin_token');
            return response;
        }

        // Token is valid, allow access
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
