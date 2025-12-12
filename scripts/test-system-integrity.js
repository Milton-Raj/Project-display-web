
const dotenv = require('dotenv');
const path = require('path');
// Load .env.local BEFORE importing libraries
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const fs = require('fs');

async function testSystemIntegrity() {
    console.log('🚀 Starting System Integrity Test (Automated)...');
    console.log('Sheet ID:', process.env.GOOGLE_SPREADSHEET_ID ? 'OK ' + process.env.GOOGLE_SPREADSHEET_ID.substring(0, 5) + '...' : 'MISSING');

    // Dynamic imports to ensure env vars are loaded first
    // ts-node handles the ESM-to-CJS interop for .ts files
    const {
        createContact, getAllContacts, deleteContact,
        createProject, getAllProjects, updateProject, deleteProject,
        getAllSettings
    } = require('../lib/google-sheets');
    const { uploadToDrive, deleteFromDrive } = require('../lib/google-drive');

    let uploadedFileId: string | null = null;
    let createdContactId: string | null = null;
    let createdProjectId: string | null = null;

    try {
        // ==========================================
        // 1. Google Drive Storage Test
        // ==========================================
        console.log('\n--- 1. Testing Google Drive Storage ---');

        // Create a dummy image file
        const dummyFileName = 'test-image.txt';
        const dummyFilePath = path.join(__dirname, dummyFileName);
        fs.writeFileSync(dummyFilePath, 'This is a test asset for integrity check.');
        const fileBuffer = fs.readFileSync(dummyFilePath);

        console.log('📤 Uploading test asset...');
        const uploadResult = await uploadToDrive(fileBuffer, `INTEGRITY_TEST_${Date.now()}.txt`, 'text/plain');
        uploadedFileId = uploadResult.id;
        console.log('✅ Asset uploaded. ID:', uploadedFileId);
        console.log('   URL:', uploadResult.url);

        // Remove local dummy file
        fs.unlinkSync(dummyFilePath);


        // ==========================================
        // 2. Google Sheets (Contacts) Test
        // ==========================================
        console.log('\n--- 2. Testing Google Sheets (Contacts) ---');

        console.log('📝 Creating test contact...');
        const testContact = {
            name: 'Integrity Tester',
            email: 'integrity@example.com',
            phone: '555-0199',
            subject: 'System Check',
            message: 'Checking if the contact form database connection works.',
        };
        const createdContact = await createContact(testContact);
        createdContactId = createdContact.id;
        console.log('✅ Contact created:', createdContactId);

        console.log('🔍 Fetching contacts to verify...');
        const contacts = await getAllContacts();
        const foundContact = contacts.find((c: any) => c.id === createdContactId);

        if (foundContact) {
            console.log('✅ Contact found in database.');
        } else {
            throw new Error('❌ Contact NOT found after creation.');
        }


        // ==========================================
        // 3. Google Sheets (Projects) Test
        // ==========================================
        console.log('\n--- 3. Testing Google Sheets (Projects) ---');

        console.log('🏗️ Creating test project...');
        const testProject = {
            title: 'Integrity Test Project',
            slug: `integrity-test-${Date.now()}`,
            description: 'A temporary project to test CRUD operations.',
            longDescription: 'This project should be deleted automatically.',
            category: 'web',
            technologies: ['Node.js', 'Google Sheets'],
            image: uploadResult.url, // Linking the uploaded file!
            demoUrl: 'https://example.com',
            featured: false,
        };

        const createdProject = await createProject(testProject);
        createdProjectId = createdProject.id;
        console.log('✅ Project created:', createdProjectId);

        console.log('🔍 Fetching projects to verify...');
        const projects = await getAllProjects();
        const foundProject = projects.find((p: any) => p.id === createdProjectId);

        if (foundProject) {
            console.log('✅ Project found in database.');
            if (foundProject.image === uploadResult.url) {
                console.log('✅ Project image URL matches uploaded file.');
            } else {
                console.warn('⚠️ Project image URL mismatch:', foundProject.image);
            }
        } else {
            throw new Error('❌ Project NOT found after creation.');
        }

        console.log('✏️ Updating test project...');
        const updateData = { ...testProject, title: 'Integrity Test Project (Updated)', id: createdProjectId };

        if (!createdProjectId) throw new Error("Failed to create project id");
        await updateProject(createdProjectId, updateData);

        const updatedProjects = await getAllProjects();
        const foundUpdatedProject = updatedProjects.find((p: any) => p.id === createdProjectId);

        if (foundUpdatedProject && foundUpdatedProject.title === 'Integrity Test Project (Updated)') {
            console.log('✅ Project updated successfully.');
        } else {
            throw new Error('❌ Project update failed.');
        }


        // ==========================================
        // 4. Google Sheets (Settings) Test
        // ==========================================
        console.log('\n--- 4. Testing Settings ---');
        console.log('🔍 Reading settings...');
        const settings = await getAllSettings();
        if (Object.keys(settings).length > 0) {
            console.log(`✅ Settings accessible. Found ${Object.keys(settings).length} settings.`);
        } else {
            console.warn('⚠️ No settings found (this might be normal if table is empty).');
        }

        console.log('\n🎉 INTEGRITY CHECK PASSED! Now cleaning up...');

    } catch (error) {
        console.error('\n❌ INTEGRITY CHECK FAILED:', error);
        process.exitCode = 1;
        // Attempt cleanup even on failure
    } finally {
        console.log('\n--- Cleanup ---');

        try {
            if (createdProjectId) {
                console.log('🗑️ Deleting test project...');
                await deleteProject(createdProjectId);
                console.log('✅ Project deleted.');
            }

            if (createdContactId) {
                console.log('🗑️ Deleting test contact...');
                await deleteContact(createdContactId);
                console.log('✅ Contact deleted.');
            }

            if (uploadedFileId) {
                console.log('🗑️ Deleting test file from Drive...');
                await deleteFromDrive(uploadedFileId);
                console.log('✅ File deleted.');
            }
        } catch (cleanupError) {
            console.error('Error during cleanup:', cleanupError);
        }
    }
}

testSystemIntegrity();
