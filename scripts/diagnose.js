
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Load environment variables manually
const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

if (fs.existsSync(envLocalPath)) {
    console.log('Loading .env.local file from:', envLocalPath);
    const envConfig = require('dotenv').parse(fs.readFileSync(envLocalPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} else if (fs.existsSync(envPath)) {
    console.log('Loading .env file from:', envPath);
    const envConfig = require('dotenv').parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

async function diagnose() {
    console.log('Starting Diagnostics...');
    const report = {
        env_vars: {},
        auth: {},
        sheets: {},
        drive: {},
        verdict: "PENDING"
    };

    try {
        // 1. Check Env Vars
        const vars = [
            'GOOGLE_CLIENT_ID',
            'GOOGLE_CLIENT_SECRET',
            'GOOGLE_REFRESH_TOKEN',
            'GOOGLE_SPREADSHEET_ID',
            'GOOGLE_DRIVE_FOLDER_ID'
        ];

        let missingVars = [];
        for (const v of vars) {
            report.env_vars[v] = process.env[v] ? 'Set' : 'MISSING';
            if (!process.env[v]) missingVars.push(v);
        }

        if (missingVars.length > 0) {
            console.error('Missing Environment Variables:', missingVars);
            return;
        }

        // 2. Auth Test
        console.log('Testing Authentication...');
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const token = await oauth2Client.getAccessToken();
        console.log('Auth Token secured:', !!token.token);

        // 3. Sheets Read Test
        console.log('Testing Sheets Read...');
        const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
        const readResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
            range: 'Projects!A1:B1', // Assuming Projects sheet exists based on previous file reads
        });
        console.log('Sheets Read Success:', readResponse.status === 200);

        // 4. Sheets Write Test
        console.log('Testing Sheets Write...');
        const testId = `debug_${Date.now()}`;
        const writeResponse = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
            range: 'Projects!A:L', // Append to Projects
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    testId,
                    'Debug Project',
                    'debug-slug',
                    'Debug Description',
                    '',
                    'Debug',
                    'Node.js',
                    '',
                    '',
                    '',
                    'FALSE',
                    new Date().toISOString()
                ]],
            },
        });
        console.log('Sheets Write Success:', writeResponse.status === 200);

        // Cleanup
        // We're not deleting the row here to keep it simple, but in a real scenario we might want to.

    } catch (error) {
        console.error('Diagnostic Failed:', error);
    }
}

diagnose();
