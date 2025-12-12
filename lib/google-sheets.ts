import { google } from 'googleapis';
import type { Project } from '@/types/project';

// Initialize OAuth2 Client
export async function getGoogleSheets() {
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

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

// ==================== CONTACTS ====================

export async function createContact(contact: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    attachment?: string;
}) {
    const sheets = await getGoogleSheets(); // Use await getGoogleSheets()
    const id = `contact_${Date.now()}`;
    const createdAt = new Date().toISOString();

    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Contacts!A:I',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[
                id,
                contact.name,
                contact.email,
                contact.phone,
                contact.subject,
                contact.message,
                contact.attachment || '',
                'new',
                createdAt,
            ]],
        },
    });

    return {
        id,
        ...contact,
        status: 'new' as const,
        createdAt,
    };
}

export async function getAllContacts() {
    const sheets = await getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Contacts!A2:I',
    });

    const rows = response.data.values || [];

    return rows.map((row: any[]) => ({
        id: row[0] || '',
        name: row[1] || '',
        email: row[2] || '',
        phone: row[3] || '',
        subject: row[4] || '',
        message: row[5] || '',
        attachment: row[6] || '',
        status: (row[7] || 'new') as 'new' | 'read' | 'replied',
        createdAt: row[8] || '',
    }));
}

export async function updateContactStatus(id: string, status: string) {
    const sheets = await getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Contacts!A:A',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row: any[]) => row[0] === id);

    if (rowIndex === -1) return null;

    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Contacts!H${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[status]],
        },
    });

    return { id, status };
}

export async function deleteContact(id: string) {
    const sheets = await getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Contacts!A:A',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row: any[]) => row[0] === id);

    if (rowIndex === -1) return false;

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
            requests: [{
                deleteDimension: {
                    range: {
                        sheetId: 1222434613, // ID for Contacts sheet
                        dimension: 'ROWS',
                        startIndex: rowIndex,
                        endIndex: rowIndex + 1,
                    },
                },
            }],
        },
    });

    return true;
}

// ==================== PROJECTS ====================

export async function createProject(project: any) {
    const sheets = await getGoogleSheets();
    const id = `project_${Date.now()}`;
    const createdAt = new Date().toISOString();

    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Projects!A:V',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[
                id,
                project.title,
                project.slug,
                project.description,
                project.longDescription || '',
                Array.isArray(project.category) ? project.category.join(',') : project.category,
                Array.isArray(project.technologies) ? project.technologies.join(',') : project.technologies,
                project.thumbnail || project.image || '',  // Support both field names
                project.demoUrl || '',
                project.githubUrl || '',
                project.featured ? 'TRUE' : 'FALSE',
                createdAt,
                // New Fields
                Array.isArray(project.features) ? project.features.join('|') : '',
                Array.isArray(project.screenshots) ? project.screenshots.join(',') : '',
                JSON.stringify(project.documents || []),
                project.videoUrl || '',
                project.appStoreUrl || '',
                project.playStoreUrl || '',
                project.apkUrl || '',
                project.testFlightUrl || '',
                project.demoType || 'none',
                project.status || 'live',
            ]],
        },
    });

    return { id, ...project, createdAt };
}

export async function getAllProjects() {
    const sheets = await getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Projects!A2:V',
    });

    const rows = response.data.values || [];

    return rows.map((row: any[]) => {
        const technologies = row[6]?.split(',').map((t: string) => t.trim()) || [];
        return {
            id: row[0] || '',
            title: row[1] || '',
            slug: row[2] || '',
            description: row[3] || '',
            longDescription: row[4] || '',
            category: row[5]?.includes(',') ? row[5].split(',') : (row[5] || ''),
            technologies,
            techStack: technologies,
            image: row[7] || '',
            thumbnail: row[7] || '',
            demoUrl: row[8] || '',
            githubUrl: row[9] || '',
            featured: row[10] === 'TRUE',
            createdAt: row[11] || '',
            updatedAt: row[11] || '',

            // New Fields Parsing
            features: row[12] ? row[12].split('|') : [],
            screenshots: row[13] ? row[13].split(',') : [],
            documents: row[14] ? JSON.parse(row[14]) : [],
            videoUrl: row[15] || '',
            appStoreUrl: row[16] || '',
            playStoreUrl: row[17] || '',
            apkUrl: row[18] || '',
            testFlightUrl: row[19] || '',
            demoType: row[20] || 'none',
            status: row[21] || 'live',

            views: 0,
            challenges: [] as string[],
            solutions: [] as string[],
            results: [] as string[],
        };
    });
}

export async function getProjectBySlug(slug: string) {
    const projects = await getAllProjects();
    return projects.find(p => p.slug === slug) || null;
}

export async function getProjectById(id: string) {
    const projects = await getAllProjects();
    return projects.find(p => p.id === id) || null;
}

export async function getFeaturedProjects() {
    const projects = await getAllProjects();
    return projects.filter(p => p.featured);
}

export async function updateProject(id: string, updates: any) {
    const sheets = await getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Projects!A:A',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row: any[]) => row[0] === id);

    if (rowIndex === -1) return null;

    const updatedRow = [
        id,
        updates.title,
        updates.slug,
        updates.description,
        updates.longDescription || '',
        Array.isArray(updates.category) ? updates.category.join(',') : updates.category,
        Array.isArray(updates.technologies) ? updates.technologies.join(',') : updates.technologies,
        updates.image,
        updates.demoUrl || '',
        updates.githubUrl || '',
        updates.featured ? 'TRUE' : 'FALSE',
        updates.createdAt || new Date().toISOString(),
        // New Fields
        Array.isArray(updates.features) ? updates.features.join('|') : '',
        Array.isArray(updates.screenshots) ? updates.screenshots.join(',') : '',
        JSON.stringify(updates.documents || []),
        updates.videoUrl || '',
        updates.appStoreUrl || '',
        updates.playStoreUrl || '',
        updates.apkUrl || '',
        updates.testFlightUrl || '',
        updates.demoType || 'none',
        updates.status || 'live',
    ];

    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Projects!A${rowIndex + 1}:V${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [updatedRow],
        },
    });

    return { id, ...updates };
}

export async function deleteProject(id: string) {
    const sheets = await getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Projects!A:A',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row: any[]) => row[0] === id);

    if (rowIndex === -1) return false;

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
            requests: [{
                deleteDimension: {
                    range: {
                        sheetId: 0, // ID for Projects sheet
                        dimension: 'ROWS',
                        startIndex: rowIndex,
                        endIndex: rowIndex + 1,
                    },
                },
            }],
        },
    });

    return true;
}

// ==================== PAGES ====================

export async function getPageContent(slug: string) {
    const sheets = await getGoogleSheets();

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Pages!A2:C',
        });

        const rows = response.data.values || [];
        const row = rows.find((r: any[]) => r[0] === slug);

        if (!row) {
            return getDefaultPageContent(slug);
        }

        return {
            slug: row[0],
            content: JSON.parse(row[1] || '{}'),
            updatedAt: row[2],
        };
    } catch (error) {
        console.error('Error getting page content:', error);
        return getDefaultPageContent(slug);
    }
}

function getDefaultPageContent(slug: string) {
    const defaults: Record<string, any> = {
        home: {
            badge: "👋 CEO & End-to-End Project Deliver Head",
            title: "Hi, I'm Milton Raj",
            subtitle: "Building scalable apps for web & mobile",
            profileImage: "",
            experienceYears: "11+",
            heroTitle: "Hi, I'm Milton Raj",
            heroSubtitle: "Building scalable apps for web & mobile. Transforming ideas into powerful digital solutions.",
            heroStats: [
                { label: "Years Experience", value: "11+" },
                { label: "Projects Completed", value: "50+" },
                { label: "Happy Clients", value: "30+" }
            ],
            ctaTitle: "Ready to Build Something Amazing?",
            ctaDescription: "Let's collaborate and turn your vision into reality. Get in touch to discuss your next project."
        },
        about: {
            heroTitle: "About Me",
            heroSubtitle: "Passionate developer",
            profileImage: "",
            experienceYears: "11+",
            skills: [],
            certifications: []
        },
        "what-i-offer": {
            heroTitle: "What I Offer",
            heroSubtitle: "Comprehensive services",
            services: [],
            whyChooseMe: []
        },
        contact: {
            headerTitle: "Get in Touch",
            headerSubtitle: "Let's discuss your project",
            phone: "+919151214181",
            email: "chrixlinitsolutions@gmail.com"
        }
    };

    return {
        slug,
        content: defaults[slug] || {},
        updatedAt: new Date().toISOString()
    };
}

export async function updatePageContent(slug: string, content: any) {
    const sheets = await getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Pages!A:A',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row: any[]) => row[0] === slug);
    const updatedAt = new Date().toISOString();

    if (rowIndex === -1) {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Pages!A:C',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[slug, JSON.stringify(content), updatedAt]],
            },
        });
    } else {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `Pages!B${rowIndex + 1}:C${rowIndex + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[JSON.stringify(content), updatedAt]],
            },
        });
    }

    return { slug, content, updatedAt };
}

// ==================== SETTINGS ====================

export async function getSetting(key: string) {
    const sheets = await getGoogleSheets();

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Settings!A2:D',
        });

        const rows = response.data.values || [];
        const row = rows.find((r: any[]) => r[0] === key);

        if (!row) return null;

        return {
            key: row[0],
            value: row[1],
            status: row[2] || 'active',
            updatedAt: row[3],
        };
    } catch (error) {
        console.error('Error getting setting:', error);
        return null;
    }
}

export async function getAllSettings() {
    const sheets = await getGoogleSheets();

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Settings!A2:D',
        });

        const rows = response.data.values || [];

        const settings: Record<string, any> = {};
        rows.forEach((row: any[]) => {
            if (row[0]) {
                settings[row[0]] = row[1];
            }
        });

        return settings;
    } catch (error) {
        console.error('Error getting all settings:', error);
        return {};
    }
}

export async function updateSetting(key: string, value: string, status: string = 'active') {
    const sheets = await getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Settings!A:A',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row: any[]) => row[0] === key);
    const updatedAt = new Date().toISOString();

    if (rowIndex === -1) {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Settings!A:D',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[key, value, status, updatedAt]],
            },
        });
    } else {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `Settings!B${rowIndex + 1}:D${rowIndex + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[value, status, updatedAt]],
            },
        });
    }

    return { key, value, status, updatedAt };
}

// Admin Password Management
export async function getAdminPasswordHash() {
    const setting = await getSetting('admin_password_hash');
    return setting?.value || null;
}

export async function updateAdminPassword(passwordHash: string) {
    const now = new Date().toISOString();

    await updateSetting('admin_password_hash', passwordHash, 'active');
    await updateSetting('last_password_change', now, 'active');

    return true;
}

export async function getAdminEmail() {
    const setting = await getSetting('admin_email');
    return setting?.value || null;
}

// ==================== STATS ====================

export async function getStats() {
    const [contacts, projects] = await Promise.all([
        getAllContacts(),
        getAllProjects(),
    ]);

    const newContacts = contacts.filter(c => c.status === 'new').length;
    const totalProjects = projects.length;
    const featuredProjects = projects.filter(p => p.featured).length;

    return {
        totalContacts: contacts.length,
        newContacts,
        totalProjects,
        featuredProjects,
        engagementRate: contacts.length > 0 ? Math.round((newContacts / contacts.length) * 100) : 0,
    };
}
