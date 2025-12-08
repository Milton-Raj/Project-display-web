import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json(
                { authenticated: false, error: 'No token provided' },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { authenticated: false, error: 'Invalid token' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                authenticated: true,
                user: {
                    email: payload.email,
                    role: payload.role,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { authenticated: false, error: 'Verification failed' },
            { status: 500 }
        );
    }
}
