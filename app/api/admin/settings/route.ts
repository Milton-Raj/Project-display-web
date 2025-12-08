import { NextResponse } from 'next/server';
import { updateSettings } from '@/lib/json-db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const success = await updateSettings(body);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
