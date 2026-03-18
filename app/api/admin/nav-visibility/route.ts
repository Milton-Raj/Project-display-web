import { NextResponse } from 'next/server';
import { getNavVisibility, updateNavVisibility, NavItemKey } from '@/lib/supabase-db';

export async function GET() {
    try {
        const visibility = await getNavVisibility();
        return NextResponse.json(visibility);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch nav visibility' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { item, enabled } = body as { item: NavItemKey; enabled: boolean };

        if (!item || typeof enabled !== 'boolean') {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        await updateNavVisibility(item, enabled);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update nav visibility' }, { status: 500 });
    }
}
