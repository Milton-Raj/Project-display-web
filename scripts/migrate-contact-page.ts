
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

async function migrateContactPage() {
    console.log("Migrating Contact Page...");
    const sheets = await getGoogleSheets();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) throw new Error('Missing SPREADSHEET_ID');

    // 1. Ensure 'Contact' Sheet Exists
    const metadata = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetExists = metadata.data.sheets?.some(s => s.properties?.title === 'Contact');

    if (!sheetExists) {
        console.log("Creating 'Contact' tab...");
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [{ addSheet: { properties: { title: 'Contact' } } }]
            }
        });
    }

    // 2. Set Headers (Row 1)
    const headers = ['slug', 'headerTitle', 'headerSubtitle', 'email', 'phone', 'whatsapp', 'linkedin', 'instagram', 'responseTimeTitle', 'responseTimeDescription', 'updatedAt'];
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Contact!A1:K1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [headers] }
    });
    console.log("Headers set.");

    // 3. Set Default Data (Row 2)
    // Default data from admin page initial state
    const defaultData = {
        slug: 'contact',
        headerTitle: 'Get in Touch',
        headerSubtitle: "Have a project in mind or just want to say hi? I'd love to hear from you.",
        email: 'contact@example.com',
        phone: '+1234567890',
        whatsapp: '+1234567890',
        linkedin: 'https://linkedin.com/in/yourprofile',
        instagram: 'yourhandle',
        responseTimeTitle: 'Response Time',
        responseTimeDescription: "I typically reply within 24 hours on weekdays.",
        updatedAt: new Date().toISOString()
    };

    const rowData = [
        defaultData.slug,
        defaultData.headerTitle,
        defaultData.headerSubtitle,
        defaultData.email,
        defaultData.phone,
        defaultData.whatsapp,
        defaultData.linkedin,
        defaultData.instagram,
        defaultData.responseTimeTitle,
        defaultData.responseTimeDescription,
        defaultData.updatedAt
    ];

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Contact!A2:K2',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [rowData] }
    });
    console.log("Default data populated.");
}

migrateContactPage().catch(console.error);
