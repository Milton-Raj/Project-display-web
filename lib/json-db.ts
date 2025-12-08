import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'content.json');

export async function readContent() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading content DB:", error);
        return {};
    }
}

export async function writeContent(data: any) {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error("Error writing content DB:", error);
        return false;
    }
}

export async function getPageContent(slug: string) {
    const data = await readContent();
    return data[slug] || null;
}

export async function updatePageContent(slug: string, content: any) {
    const data = await readContent();
    data[slug] = { ...data[slug], ...content };
    return await writeContent(data);
}

// Helper to read other JSON files
async function readJsonFile(filename: string) {
    try {
        const filePath = path.join(process.cwd(), 'data', filename);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

export async function getProjects() {
    return await readJsonFile('projects.json');
}

export async function getContacts() {
    return await readJsonFile('contacts.json');
}

export async function getSettings() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'settings.json');
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading settings:", error);
        return { landingPage: 'home' }; // Default
    }
}

export async function updateSettings(settings: any) {
    try {
        const filePath = path.join(process.cwd(), 'data', 'settings.json');
        await fs.writeFile(filePath, JSON.stringify(settings, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error("Error writing settings:", error);
        return false;
    }
}
