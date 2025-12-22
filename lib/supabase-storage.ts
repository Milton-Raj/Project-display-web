import { supabaseAdmin } from './supabase';

/**
 * Uploads a file buffer to a Supabase storage bucket.
 * 
 * @param bucket The name of the bucket (e.g., 'attachments', 'projects')
 * @param path The path within the bucket (e.g., 'subfolder/filename.jpg')
 * @param file The file buffer or Blob
 * @param contentType Optional content type string
 * @returns The public URL of the uploaded file
 */
export async function uploadToSupabase(
    bucket: string,
    path: string,
    file: Buffer | Blob,
    contentType?: string
): Promise<{ path: string; url: string }> {
    const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(path, file, {
            contentType,
            upsert: true,
        });

    if (error) {
        console.error(`Error uploading to Supabase Storage (${bucket}):`, error);
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return {
        path: data.path,
        url: publicUrl,
    };
}

/**
 * Deletes a file from a Supabase storage bucket.
 * 
 * @param bucket The name of the bucket
 * @param path The path of the file to delete
 * @returns boolean indicating success
 */
export async function deleteFromSupabase(bucket: string, path: string): Promise<boolean> {
    const { error } = await supabaseAdmin.storage
        .from(bucket)
        .remove([path]);

    if (error) {
        console.error(`Error deleting from Supabase Storage (${bucket}):`, error);
        return false;
    }

    return true;
}

/**
 * Extracts bucket and path from a Supabase public URL.
 * Useful for deletion when only the URL is stored.
 * 
 * Example URL: https://xyz.supabase.co/storage/v1/object/public/attachments/123-file.pdf
 */
export function parseSupabaseUrl(url: string): { bucket: string; path: string } | null {
    try {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/');

        // Find 'public' in path and extract next parts
        const publicIndex = parts.indexOf('public');
        if (publicIndex !== -1 && parts.length > publicIndex + 2) {
            const bucket = parts[publicIndex + 1];
            const path = parts.slice(publicIndex + 2).join('/');
            return { bucket, path };
        }
    } catch (e) {
        console.error('Error parsing Supabase URL:', e);
    }
    return null;
}
