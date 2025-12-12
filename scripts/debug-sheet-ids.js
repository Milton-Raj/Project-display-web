
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const { google } = require('googleapis');

async function listSheetIds() {
    console.log('🚀 Listing Sheet IDs...');

    // Auth logic copied from lib/google-sheets.ts because we are in a raw script
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    try {
        const response = await sheets.spreadsheets.get({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        });

        console.log('\n--- Sheets Metadata ---');
        response.data.sheets.forEach((sheet: any) => {
            console.log(`Title: "${sheet.properties.title}", ID: ${sheet.properties.sheetId}`);
        });

    } catch (error) {
        console.error('Error fetching sheet metadata:', error);
    }
}

listSheetIds();
