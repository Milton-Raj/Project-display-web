import { NextResponse } from 'next/server';
import { getBlogBySlug, updateBlog, deleteBlog, getAllBlogs } from '@/lib/supabase-db';
import { verifyToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;

        // We pass the id from the page, but let's just find it locally through allBlogs or write a new custom `getBlogById`
        const blogs = await getAllBlogs();
        const blog = blogs.find(b => b.id === id);

        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blog details' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const id = (await params).id;
        const data = await request.json();

        if (!data.title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const blog = await updateBlog(id, data);
        return NextResponse.json(blog);

    } catch (error: any) {
        console.error('Error in blog update API:', error);
        return NextResponse.json(
            { error: error?.message || 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const id = (await params).id;
        const success = await deleteBlog(id);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to delete blog' },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json(
            { error: 'Failed to delete blog' },
            { status: 500 }
        );
    }
}
