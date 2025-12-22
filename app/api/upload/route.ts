import { NextResponse } from 'next/server';
import { uploadToSupabase, deleteFromSupabase, parseSupabaseUrl } from '@/lib/supabase-storage';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Determine bucket based on file type
        const isImage = file.type.startsWith('image/');
        const bucket = isImage ? 'projects' : 'attachments';
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

        // Upload to Supabase Storage
        const { path, url } = await uploadToSupabase(
            bucket,
            fileName,
            buffer,
            file.type
        );

        return NextResponse.json({
            success: true,
            fileId: fileName, // Using fileName as ID for Supabase
            bucket: bucket,
            path: url,
            url: url,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file to Supabase' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('fileId');
        const url = searchParams.get('url');

        if (!fileId && !url) {
            return NextResponse.json({ error: 'File ID or URL required' }, { status: 400 });
        }

        let bucket = searchParams.get('bucket') || 'attachments';
        let path = fileId;

        // If URL is provided, try to parse bucket and path from it
        if (url) {
            const parsed = parseSupabaseUrl(url);
            if (parsed) {
                bucket = parsed.bucket;
                path = parsed.path;
            }
        }

        if (!path) {
            return NextResponse.json({ error: 'Could not determine file path' }, { status: 400 });
        }

        const success = await deleteFromSupabase(bucket, path);

        if (!success) {
            return NextResponse.json({ error: 'Failed to delete file from Supabase' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete file' },
            { status: 500 }
        );
    }
}

