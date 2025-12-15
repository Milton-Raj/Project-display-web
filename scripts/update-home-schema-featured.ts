
import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function getGoogleSheets() {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
        throw new Error('Missing Google Credentials');
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    return google.sheets({ version: 'v4', auth: oauth2Client });
}

async function updateSchema() {
    console.log("Updating Home Sheet Schema (Adding Featured Projects)...");
    const sheets = await getGoogleSheets();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) throw new Error('Missing SPREADSHEET_ID');

    // 1. Read existing data
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Home!A2:H2', // Old Range
    });

    const oldRow = response.data.values?.[0] || [];

    // Map old data (Indices based on old schema: A:slug, B:badge, C:title, D:sub, E:stats, F:ctaTi, G:ctaDes, H:updated)
    const slug = oldRow[0] || 'home';
    const heroBadge = oldRow[1] || '';
    const heroTitle = oldRow[2] || '';
    const heroSubtitle = oldRow[3] || '';
    const heroStats = oldRow[4] || '[]';
    // Col F and G were CTA in old schema
    const ctaTitle = oldRow[5] || '';
    const ctaDescription = oldRow[6] || '';
    const updatedAt = new Date().toISOString();

    // New Data Structure
    const featuredTitle = "Featured Projects"; // Default
    const featuredDescription = "Explore some of my best work showcasing innovation, design, and technical excellence."; // Default

    const newRowData = [
        slug,
        heroBadge,
        heroTitle,
        heroSubtitle,
        heroStats,
        featuredTitle,       // New
        featuredDescription, // New
        ctaTitle,            // Shifted
        ctaDescription,      // Shifted
        updatedAt            // Shifted
    ];

    // 2. Update Headers (Row 1)
    const newHeaders = ['slug', 'heroBadge', 'heroTitle', 'heroSubtitle', 'heroStats', 'featuredTitle', 'featuredDescription', 'ctaTitle', 'ctaDescription', 'updatedAt'];

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Home!A1:J1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [newHeaders] }
    });
    console.log("Headers updated.");

    // 3. Update Data (Row 2)
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Home!A2:J2',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [newRowData] }
    });
    console.log("Data row updated and shifted.");

}

updateSchema().catch(console.error);
