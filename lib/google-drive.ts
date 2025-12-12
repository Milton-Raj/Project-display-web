import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Initialize Google Drive client
export function getDriveClient() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground' // Redirect URI
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    return google.drive({ version: 'v3', auth: oauth2Client });
}

// Upload file to Google Drive
export async function uploadToDrive(
    file: Buffer,
    fileName: string,
    mimeType: string
): Promise<{ id: string; url: string }> {
    const drive = getDriveClient();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
        throw new Error('GOOGLE_DRIVE_FOLDER_ID is not configured');
    }

    const response = await drive.files.create({
        requestBody: {
            name: fileName,
            parents: [folderId],
        },
        media: {
            mimeType,
            body: Readable.from(file),
        },
        fields: 'id, webViewLink, webContentLink',
    });

    const fileId = response.data.id!;

    // Make file publicly accessible
    await drive.permissions.create({
        fileId,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        },
    });

    // Get direct download link
    const directLink = `https://drive.google.com/uc?export=view&id=${fileId}`;

    return {
        id: fileId,
        url: directLink,
    };
}

// Delete file from Google Drive
export async function deleteFromDrive(fileId: string): Promise<boolean> {
    try {
        const drive = getDriveClient();
        await drive.files.delete({ fileId });
        return true;
    } catch (error) {
        console.error('Error deleting file from Drive:', error);
        return false;
    }
}

// List files in folder
export async function listDriveFiles() {
    const drive = getDriveClient();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
        throw new Error('GOOGLE_DRIVE_FOLDER_ID is not configured');
    }

    const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, createdTime, size, webViewLink)',
        orderBy: 'createdTime desc',
    });

    return response.data.files || [];
}
