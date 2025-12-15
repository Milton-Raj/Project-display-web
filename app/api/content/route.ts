import { NextResponse } from 'next/server';
import { processPageUpdate, getPageContent } from '@/lib/database';
import { revalidatePath } from 'next/cache';

// Enable static rendering and caching for faster responses
export const dynamic = 'force-dynamic';
export const revalidate = 10; // Revalidate every 10 seconds

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const content = await getPageContent(slug);
    return NextResponse.json({ content }, {
        headers: {
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20',
        },
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { slug, content } = body;
        console.log('Received update request:', { slug, contentKeys: Object.keys(content || {}) });

        if (!slug || !content) {
            return NextResponse.json({ error: 'Slug and content are required' }, { status: 400 });
        }

        await processPageUpdate(slug, content);
        if (slug === 'about') {
            revalidatePath('/about');
            revalidatePath('/'); // In case about content is used on home
        } else {
            revalidatePath(`/${slug}`);
        }
        revalidatePath('/(public)', 'layout'); // Invalidate public layout just in case

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
