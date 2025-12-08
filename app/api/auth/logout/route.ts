import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const response = NextResponse.json(
        { success: true, message: 'Logged out successfully' },
        { status: 200 }
    );

    // Delete the admin token cookie
    response.cookies.delete('admin_token');

    return response;
}
