import * as dotenv from 'dotenv';
import * as path from 'path';
// Load .env.local BEFORE importing libraries
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import * as fs from 'fs';

async function verifyIntegration() {
    console.log('🚀 Starting Google Workspace Integration Verification...');
    console.log('Sheet ID:', process.env.GOOGLE_SPREADSHEET_ID ? 'OK ' + process.env.GOOGLE_SPREADSHEET_ID.substring(0, 5) + '...' : 'MISSING');

    // Dynamic imports to ensure env vars are loaded first
    const { createContact, getAllContacts, deleteContact } = await import('../lib/google-sheets');
    const { uploadToDrive, deleteFromDrive } = await import('../lib/google-drive');


    try {
        // 1. Test Google Sheets (Contacts)
        console.log('\n--- Testing Google Sheets (Contacts) ---');

        // Create
        console.log('Creating test contact...');
        const testContact = {
            name: 'Verification User',
            email: 'verify@example.com',
            phone: '1234567890',
            subject: 'Integration Test',
            message: 'This is a test message from the verification script.',
        };
        const createdContact = await createContact(testContact);
        console.log('✅ Contact created:', createdContact.id);

        // Read
        console.log('Fetching contacts...');
        const contacts = await getAllContacts();
        const verificationContact = contacts.find(c => c.id === createdContact.id);

        if (verificationContact) {
            console.log('✅ Verification contact found in sheet.');
        } else {
            throw new Error('❌ Verification contact NOT found in sheet.');
        }

        // 2. Test Google Drive (File Upload)
        console.log('\n--- Testing Google Drive (File Upload) ---');

        // Create a dummy file
        const dummyFileName = 'test-upload.txt';
        const dummyFilePath = path.join(__dirname, dummyFileName);
        fs.writeFileSync(dummyFilePath, 'This is a test file for Google Drive integration.');
        const fileBuffer = fs.readFileSync(dummyFilePath);

        // Upload
        console.log('Uploading test file...');
        const uploadResult = await uploadToDrive(fileBuffer, `VERIFY_${Date.now()}.txt`, 'text/plain');
        console.log('✅ File uploaded. ID:', uploadResult.id);
        console.log('   URL:', uploadResult.url);

        // 3. Cleanup
        console.log('\n--- Cleaning Up ---');

        // Delete Contact
        console.log('Deleting test contact...');
        await deleteContact(createdContact.id);
        console.log('✅ Test contact deleted.');

        // Delete File
        console.log('Deleting test file from Drive...');
        await deleteFromDrive(uploadResult.id);
        console.log('✅ Test file deleted from Drive.');

        // Remove local dummy file
        fs.unlinkSync(dummyFilePath);

        console.log('\n🎉 ALL TESTS PASSED! Google Workspace integration is working correctly.');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error);
        process.exit(1);
    }
}

verifyIntegration();
