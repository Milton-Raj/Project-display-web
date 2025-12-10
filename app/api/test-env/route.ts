import { NextResponse } from 'next/server';

export async function GET() {
    const email = process.env.ADMIN_EMAIL;
    const hash = process.env.ADMIN_PASSWORD_HASH;

    return NextResponse.json({
        email_configured: !!email,
        email_value: email,
        hash_configured: !!hash,
        hash_length: hash ? hash.length : 0,
        hash_start: hash ? hash.substring(0, 10) : 'N/A',
        hash_end: hash ? hash.substring(hash.length - 10) : 'N/A',
        node_env: process.env.NODE_ENV
    });
}
