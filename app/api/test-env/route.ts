import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

// MARK: - Helper to get sheets
async function getSheets(oauth2Client: any) {
    return google.sheets({ version: 'v4', auth: oauth2Client });
}

// MARK: - Helper to get drive
async function getDrive(oauth2Client: any) {
    return google.drive({ version: 'v3', auth: oauth2Client });
}

export const dynamic = 'force-dynamic';

export async function GET() {
    const report: any = {
        _version: "1.0.0 (New Diagnostic Tool)",
        timestamp: new Date().toISOString(),
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
            report.verdict = "FAIL: Missing Environment Variables";
            return NextResponse.json(report);
        }

        // 2. Auth Test
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        try {
            const token = await oauth2Client.getAccessToken();
            report.auth.status = "SUCCESS";
            report.auth.token_present = !!token.token;
        } catch (authError: any) {
            report.auth.status = "FAIL";
            report.auth.error = authError.message;
            report.verdict = "FAIL: Auth Token Generation Failed. Refresh Token might be invalid.";
            return NextResponse.json(report);
        }

        // 3. Sheets Read Test
        try {
            const sheets = await getSheets(oauth2Client);
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
                range: 'Contacts!A1:B1',
            });
            report.sheets.read_status = "SUCCESS";
            report.sheets.data_preview = response.data.values;
        } catch (readError: any) {
            report.sheets.read_status = "FAIL";
            report.sheets.read_error = readError.message;
        }

        // 4. Sheets Write Test
        try {
            const sheets = await getSheets(oauth2Client);
            const testId = `debug_${Date.now()}`;
            await sheets.spreadsheets.values.append({
                spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
                range: 'Contacts!A:I',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [[
                        testId,
                        'Debug Agent',
                        'debug@test.com',
                        '000',
                        'Debug Test',
                        'Checking permissions',
                        '',
                        'debug',
                        new Date().toISOString()
                    ]],
                },
            });
            report.sheets.write_status = "SUCCESS";

            // Clean up? Maybe leave it for evidence.
        } catch (writeError: any) {
            report.sheets.write_status = "FAIL";
            report.sheets.write_error = writeError.message;
        }

        // 5. Drive Write Test
        try {
            const drive = await getDrive(oauth2Client);
            const fileMetadata = {
                name: 'debug_test_file.txt',
                parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!]
            };
            const media = {
                mimeType: 'text/plain',
                body: Readable.from(['Hello World from Vercel Debugger'])
            };
            const file = await drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id'
            });
            report.drive.upload_status = "SUCCESS";
            report.drive.file_id = file.data.id;

            // Clean up drive file
            if (file.data.id) {
                await drive.files.delete({ fileId: file.data.id });
                report.drive.cleanup_status = "SUCCESS";
            }
        } catch (driveError: any) {
            report.drive.upload_status = "FAIL";
            report.drive.error = driveError.message;
        }

        // Final Verdict
        if (report.sheets.write_status === "SUCCESS" && report.drive.upload_status === "SUCCESS") {
            report.verdict = "PASS: All Systems Operational";
        } else {
            report.verdict = "FAIL: Partial System Failure (Check details)";
        }

    } catch (err: any) {
        report.verdict = "CRITICAL ERROR";
        report.global_error = err.message;
    }

    return NextResponse.json(report, { status: 200 });
}
