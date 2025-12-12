import { NextResponse } from 'next/server';

export async function GET() {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasGoogleRefreshToken: !!process.env.GOOGLE_REFRESH_TOKEN,
        hasSpreadsheetId: !!process.env.GOOGLE_SPREADSHEET_ID,
        hasDriveFolderId: !!process.env.GOOGLE_DRIVE_FOLDER_ID,
        spreadsheetIdLength: process.env.GOOGLE_SPREADSHEET_ID?.length || 0,
        clientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) || 'missing',
    };

    return NextResponse.json(diagnostics);
}
