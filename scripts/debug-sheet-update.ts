
require('dotenv').config({ path: '.env.local' });
const { updatePageContent } = require('../lib/google-sheets');

async function testUpdate() {
    console.log("Starting test update for 'About' page...");

    // Mock content that mimics the admin form submission
    const mockContent = {
        heroBadge: "Test Badge " + new Date().toISOString(),
        heroTitle: "Test Title",
        heroSubtitle1: "Test Subtitle",
        profileImage: "https://example.com/image.png",
        experienceYears: "99",
        skillsTitle: "Test Skills",
        skillsSubtitle: "Test Skills Subtitle",
        skills: [{ name: "Test Skill", description: "Test Desc" }],
        certificationsTitle: "Test Certs",
        certifications: ["Cert 1", "Cert 2"]
    };

    try {
        console.log("Calling updatePageContent('about', ...)");
        const result = await updatePageContent('about', mockContent);
        console.log("Update successful:", result);
    } catch (error) {
        console.error("Update failed:", error);
    }
}

// Since lib/google-sheets.ts is a TS file, running it directly via node might fail if not transpiled.
// However, in this environment, we should use ts-node or similar if available, or rely on the fact that we can import from the dist if built. 
// Given the environment constraints, I'll write this as a TS file and try to run it with ts-node if the user has it, or just rely on 'next' context if possible (difficult). 
// Actually, simplest is to create a route handler to test this, OR try to run it via ts-node.
// Let's try creating it as a TS file first.

testUpdate();
