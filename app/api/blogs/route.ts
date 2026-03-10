import { NextResponse } from 'next/server';
import { getAllBlogs, createBlog } from '@/lib/supabase-db';
import { verifyToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const blogs = await getAllBlogs();
        return NextResponse.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blogs' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        // Verify admin authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        const isValid = await verifyToken(token || '');

        if (!isValid) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const data = await request.json();

        // Basic validation
        if (!data.title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const blog = await createBlog(data);
        return NextResponse.json(blog, { status: 201 });
    } catch (error: any) {
        console.error('Error in blog creation API:', error);
        return NextResponse.json(
            { error: error?.message || 'Failed to process request' },
            { status: 500 }
        );
    }
}
