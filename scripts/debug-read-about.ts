
const { getPageContent } = require('../lib/google-sheets');

async function debugRead() {
    console.log("--- DEBUGGING READ ---");
    try {
        const result = await getPageContent('about');
        console.log("Result Type:", typeof result);
        console.log("Top Keys:", Object.keys(result || {}));

        if (result && result.content) {
            console.log("Content Keys:", Object.keys(result.content));
            console.log("Sample Value (heroBadge):", result.content.heroBadge);
        } else {
            console.log("Result.content is missing!");
            console.log("Direct heroBadge check:", result.heroBadge);
        }

        console.log("FULL DUMP:", JSON.stringify(result, null, 2));

    } catch (e) {
        console.error("Read failed:", e);
    }
}
debugRead();
