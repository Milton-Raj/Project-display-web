import { google } from 'googleapis';
import type { Project, ProjectCategory } from '@/types/project';

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
        status: (row[7] === 'read' ? 'read' : 'unread') as 'unread' | 'read' | 'replied',
        createdAt: row[8] || '',
    })).sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
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

    // Dynamically find the Sheet ID for 'Contacts'
    const metadata = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const contactsSheet = metadata.data.sheets?.find(s => s.properties?.title === 'Contacts');
    const sheetId = contactsSheet?.properties?.sheetId;

    if (sheetId === undefined || sheetId === null) {
        console.error("Contacts sheet not found during delete");
        return false;
    }

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
            requests: [{
                deleteDimension: {
                    range: {
                        sheetId: sheetId,
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

    // Map frontend field names to backend expectations
    const technologies = project.techStack || project.technologies || [];
    const thumbnail = project.thumbnail || project.image || '';

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
                Array.isArray(technologies) ? technologies.join(',') : technologies,
                thumbnail,
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

export async function getAllProjects(): Promise<Project[]> {
    try {
        const sheets = await getGoogleSheets();

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Projects!A2:V',
        });

        const rows = response.data.values || [];
        console.log(`getAllProjects: Found ${rows.length} rows in sheet`);

        const projects = rows.map((row: any[], index: number) => {
            try {
                // Defensive check if row is basic array
                if (!Array.isArray(row)) {
                    throw new Error('Row is not an array');
                }

                // Safely convert values to string if they are numbers/null
                const safeString = (val: any) => (val === null || val === undefined) ? '' : String(val);

                const technologies = safeString(row[6]).split(',').map((t: string) => t.trim()).filter(Boolean) || [];
                return {
                    id: safeString(row[0]),
                    title: safeString(row[1]),
                    slug: safeString(row[2]).trim(),
                    description: safeString(row[3]),
                    longDescription: safeString(row[4]),
                    category: (safeString(row[5]).includes(',') ? safeString(row[5]).split(',').map(c => c.trim()) : safeString(row[5])) as ProjectCategory | ProjectCategory[],
                    technologies,
                    techStack: technologies,
                    image: safeString(row[7]),
                    thumbnail: safeString(row[7]),
                    demoUrl: safeString(row[8]),
                    githubUrl: safeString(row[9]),
                    featured: safeString(row[10]).toUpperCase() === 'TRUE',
                    createdAt: safeString(row[11]),
                    updatedAt: safeString(row[11]),

                    // New Fields Parsing
                    features: safeString(row[12]) ? safeString(row[12]).split('|').map(f => f.trim()) : [],
                    screenshots: safeString(row[13]) ? safeString(row[13]).split(',').map(s => s.trim()) : [],
                    documents: (() => {
                        try {
                            const raw = safeString(row[14]);
                            if (!raw) return [];
                            // Handle simple URL case (if user pasted raw URL)
                            if (raw.startsWith('http') && !raw.startsWith('[')) {
                                return [{ name: 'Document', url: raw, previewUrl: '' }];
                            }
                            // Handle JSON format
                            return JSON.parse(raw);
                        } catch (e) {
                            console.warn('Failed to parse documents:', row[14]);
                            return [];
                        }
                    })(),
                    videoUrl: safeString(row[15]),
                    appStoreUrl: safeString(row[16]),
                    playStoreUrl: safeString(row[17]),
                    apkUrl: safeString(row[18]),
                    testFlightUrl: safeString(row[19]),
                    demoType: (safeString(row[20]) || 'none') as Project['demoType'],
                    status: (safeString(row[21]) || 'live') as Project['status'],

                    // Additional fields
                    views: 0,
                } as Project;
            } catch (parseError) {
                console.error(`Error parsing project at row ${index + 2}:`, parseError);
                // Return a minimal project object to avoid breaking the entire list
                return {
                    id: row && row[0] ? String(row[0]) : `error_${index}`,
                    title: row && row[1] ? String(row[1]) : 'Error loading project',
                    slug: row && row[2] ? String(row[2]).trim() : `error-${index}`,
                    description: 'Error parsing project data',
                    longDescription: '',
                    category: [],
                    technologies: [],
                    techStack: [],
                    image: '',
                    thumbnail: '',
                    demoUrl: '',
                    githubUrl: '',
                    featured: false,
                    createdAt: '',
                    updatedAt: '',
                    features: [],
                    screenshots: [],
                    documents: [],
                    videoUrl: '',
                    appStoreUrl: '',
                    playStoreUrl: '',
                    apkUrl: '',
                    testFlightUrl: '',
                    demoType: 'none',
                    status: 'live',
                    views: 0,
                } as Project;
            }
        });

        console.log(`getAllProjects: Successfully parsed ${projects.length} projects`);
        return projects.sort((a: any, b: any) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
        });
    } catch (error) {
        console.error('Error in getAllProjects:', error);
        throw error;
    }
}

export async function getProjectBySlug(slug: string) {
    const projects = await getAllProjects();
    const normalizedSlug = slug.trim().toLowerCase();
    return projects.find(p => p.slug.trim().toLowerCase() === normalizedSlug) || null;
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

    // 1. Find the row index first
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Projects!A:A',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row: any[]) => row[0] === id);

    if (rowIndex === -1) return null;

    // 2. Fetch the EXISTING full row data to ensure we don't overwrite with missing defaults
    const fullRowResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `Projects!A${rowIndex + 1}:V${rowIndex + 1}`,
    });

    const existingRow = fullRowResponse.data.values?.[0] || [];

    // 3. Helper to safe-parse existing JSON
    const parseJSON = (str: string, fallback: any) => {
        try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
    };

    // 4. Extract existing values for merging
    // Note: This mapping MUST match the read sequence in getAllProjects
    const existingData = {
        title: existingRow[1],
        slug: existingRow[2],
        description: existingRow[3],
        longDescription: existingRow[4],
        category: existingRow[5]?.split(','),
        techStack: existingRow[6]?.split(','),
        thumbnail: existingRow[7],
        demoUrl: existingRow[8],
        githubUrl: existingRow[9],
        featured: existingRow[10] === 'TRUE',
        createdAt: existingRow[11],
        features: existingRow[12]?.split('|'),
        screenshots: existingRow[13]?.split(','),
        documents: parseJSON(existingRow[14], []),
        videoUrl: existingRow[15],
        appStoreUrl: existingRow[16],
        playStoreUrl: existingRow[17],
        apkUrl: existingRow[18],
        testFlightUrl: existingRow[19],
        demoType: existingRow[20],
        status: existingRow[21],
    };

    // 5. Merge Updates: Prefer 'updates', fallback to 'existingData'
    // For arrays/objects, we trust the 'updates' if provided, otherwise keep existing.
    // We explicitly handle aliasing here.
    const merged = {
        ...existingData,
        ...updates,
        // Handle aliases: Frontend sends techStack/thumbnail, so use those if present
        techStack: updates.techStack || updates.technologies || existingData.techStack || [],
        thumbnail: updates.thumbnail || updates.image || existingData.thumbnail || '',
    };

    // 6. Constuct the Write Row
    const updatedRow = [
        id, // 0: ID (Immutable)
        merged.title, // 1
        merged.slug, // 2
        merged.description, // 3
        merged.longDescription || '', // 4
        Array.isArray(merged.category) ? merged.category.join(',') : merged.category, // 5
        Array.isArray(merged.techStack) ? merged.techStack.join(',') : merged.techStack, // 6
        merged.thumbnail, // 7
        merged.demoUrl || '', // 8
        merged.githubUrl || '', // 9
        merged.featured ? 'TRUE' : 'FALSE', // 10
        merged.createdAt, // 11 (Immutable)
        Array.isArray(merged.features) ? merged.features.join('|') : '', // 12
        Array.isArray(merged.screenshots) ? merged.screenshots.join(',') : '', // 13
        JSON.stringify(merged.documents || []), // 14
        merged.videoUrl || '', // 15
        merged.appStoreUrl || '', // 16
        merged.playStoreUrl || '', // 17
        merged.apkUrl || '', // 18
        merged.testFlightUrl || '', // 19
        merged.demoType || 'none', // 20
        merged.status || 'live', // 21
    ];

    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Projects!A${rowIndex + 1}:V${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [updatedRow],
        },
    });

    return { id, ...merged };
}

export async function deleteProject(id: string) {
    try {
        const sheets = await getGoogleSheets();

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Projects!A:A',
        });

        const rows = response.data.values || [];
        const rowIndex = rows.findIndex((row: any[]) => row[0] === id);

        if (rowIndex === -1) {
            console.error(`Project with ID ${id} not found in sheet`);
            throw new Error('Project not found');
        }

        // Dynamically find the Sheet ID for 'Projects'
        const metadata = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
        const projectsSheet = metadata.data.sheets?.find(s => s.properties?.title === 'Projects');

        if (!projectsSheet?.properties?.sheetId && projectsSheet?.properties?.sheetId !== 0) {
            throw new Error("Projects sheet not found");
        }

        const sheetId = projectsSheet.properties.sheetId;

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId: sheetId,
                            dimension: 'ROWS',
                            startIndex: rowIndex,
                            endIndex: rowIndex + 1,
                        },
                    },
                }],
            },
        });

        console.log(`Successfully deleted project ${id} from row ${rowIndex}`);
        return true;
    } catch (error) {
        console.error('Error in deleteProject:', error);
        throw error;
    }
}

// ==================== PAGES ====================

export async function getPageContent(slug: string) {
    if (slug.toLowerCase() === 'about') {
        return getAboutPage();
    }
    if (slug.toLowerCase() === 'what-i-offer') {
        return getWhatIOfferPage();
    }
    if (slug.toLowerCase() === 'home') {
        return getHomePage();
    }
    if (slug.toLowerCase() === 'contact') {
        return getContactPage();
    }

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

async function getAboutPage() {
    const sheets = await getGoogleSheets();
    try {
        // Try to get data from the "About" sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'About!A2:L2', // Read specific columns
        });

        const row = response.data.values?.[0];

        if (!row) {
            return getDefaultPageContent('about');
        }

        // Map columns to content object
        const content = {
            slug: 'about',
            heroBadge: row[1] || '',
            heroTitle: row[2] || '',
            heroSubtitle1: row[3] || '',
            profileImage: row[4] || '',
            experienceYears: row[5] || '',
            skillsTitle: row[6] || '',
            skillsSubtitle: row[7] || '',
            skills: row[8] ? JSON.parse(row[8]) : [],
            certificationsTitle: row[9] || '',
            certifications: row[10] ? row[10].split(',').map((s: string) => s.trim()) : [],
            updatedAt: row[11] || new Date().toISOString(),
        };

        return {
            slug: 'about',
            content: content,
            updatedAt: content.updatedAt,
        };
    } catch (error) {
        console.warn('Error getting About page from dedicated sheet (might not exist yet):', error);
        // Fallback to legacy Pages sheet if About sheet fails
        return getDefaultPageContent('about');
    }
}

async function getWhatIOfferPage() {
    const sheets = await getGoogleSheets();
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'WhatIOffer!A2:K2',
        });

        const row = response.data.values?.[0];

        if (!row) {
            return getDefaultPageContent('what-i-offer');
        }

        const content = {
            slug: 'what-i-offer',
            heroTitle: row[1] || '',
            heroSubtitle: row[2] || '',
            services: row[3] ? JSON.parse(row[3]) : [],
            whyChooseMe: row[4] ? JSON.parse(row[4]) : [],
            showcaseTitle: row[5] || '',
            showcaseSubtitle: row[6] || '',
            showcaseItems: row[7] ? JSON.parse(row[7]) : [],
            ctaTitle: row[8] || '',
            ctaDescription: row[9] || '',
            updatedAt: row[10] || new Date().toISOString(),
        };

        return {
            slug: 'what-i-offer',
            content: content,
            updatedAt: content.updatedAt,
        };
    } catch (error) {
        console.warn('Error getting WhatIOffer page (might not exist yet):', error);
        return getDefaultPageContent('what-i-offer');
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
            ctaDescription: "Let's collaborate and turn your vision to reality. Get in touch to discuss your next project."
        },
        about: {
            heroBadge: "Full-Stack Developer",
            heroTitle: "Hi, I'm Milton Raj",
            heroSubtitle1: "Building scalable apps for web & mobile",
            profileImage: "",
            experienceYears: "11+",
            skillsTitle: "My Expertise",
            skillsSubtitle: "Specialized skills and technologies I use to build exceptional digital products",
            skills: [],
            certificationsTitle: "Certifications & Achievements",
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

export async function processPageUpdate(slug: string, content: any) {
    const normalizedSlug = slug.toString().trim().toLowerCase();

    if (normalizedSlug === 'home') {
        console.log("Routing to Home Page logic for slug:", normalizedSlug);
        console.log("Content received:", JSON.stringify(content));
        return updateHomePage(content);
    }
    if (normalizedSlug === 'contact') {
        console.log("Routing to Contact Page logic");
        return updateContactPage(content);
    }
    if (normalizedSlug === 'about') {
        console.log("Routing to About Page logic (Primary Check)");
        return updateAboutPage(content);
    }
    if (normalizedSlug === 'what-i-offer') {
        console.log("Routing to What I Offer Page logic");
        return updateWhatIOfferPage(content);
    }

    const sheets = await getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Pages!A:A',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row: any[]) => row[0] === slug);
    const updatedAt = new Date().toISOString();

    // SAFETY FALLBACK: If we somehow found the 'about' row in the old sheet, redirect!
    // This catches cases where slug might be "about" but the top check failed for some reason
    if (normalizedSlug === 'home') {
        throw new Error("DEBUG TRAP: OLD LOGIC REACHED for Home. The server IS running the new code.");
    }
    if (normalizedSlug === 'about') {
        throw new Error("DEBUG TRAP: OLD LOGIC REACHED. The server IS running the new code, but the logic fell through.");
    }
    if (normalizedSlug === 'what-i-offer') {
        throw new Error("DEBUG TRAP: OLD LOGIC REACHED for WhatIOffer. The server IS running the new code.");
    }

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

async function updateAboutPage(content: any) {
    const sheets = await getGoogleSheets();
    const updatedAt = new Date().toISOString();

    // Ensure "About" sheet exists
    await ensureAboutSheetExists(sheets);

    // Update headers (idempotent-ish)
    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'About!A1:L1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[
                'slug',
                'heroBadge',
                'heroTitle',
                'heroSubtitle1',
                'profileImage',
                'experienceYears',
                'skillsTitle',
                'skillsSubtitle',
                'skills',
                'certificationsTitle',
                'certifications',
                'updatedAt'
            ]]
        }
    });

    // Prepare row data strictly mapping to headers
    const rowData = [
        'about', // A: slug
        content.heroBadge || '', // B
        content.heroTitle || '', // C
        content.heroSubtitle1 || '', // D
        content.profileImage || '', // E
        content.experienceYears || '', // F
        content.skillsTitle || '', // G
        content.skillsSubtitle || '', // H
        JSON.stringify(content.skills || []), // I: stored as JSON array
        content.certificationsTitle || '', // J
        Array.isArray(content.certifications) ? content.certifications.join(',') : (content.certifications || ''), // K: CSV
        updatedAt // L
    ];

    // Always update Row 2 (single row for 'About' page)
    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'About!A2:L2',
        valueInputOption: 'USER_ENTERED', // Allow formula parsing if needed, but mainly for type coercion
        requestBody: {
            values: [rowData],
        },
    });

    return { slug: 'about', content, updatedAt };
}

async function ensureAboutSheetExists(sheets: any) {
    try {
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });

        const sheetExists = spreadsheet.data.sheets?.some(
            (s: any) => s.properties?.title === 'About'
        );

        if (!sheetExists) {
            console.log("Creating 'About' sheet...");
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    requests: [{
                        addSheet: {
                            properties: {
                                title: 'About',
                                gridProperties: {
                                    frozenRowCount: 1,
                                }
                            }
                        }
                    }]
                }
            });
        }
    } catch (error) {
        console.error('Error ensuring About sheet exists:', error);
        // Don't throw, try to proceed in case it's a permission issue or race condition
    }
}

async function updateWhatIOfferPage(content: any) {
    const sheets = await getGoogleSheets();
    const updatedAt = new Date().toISOString();

    await ensureWhatIOfferSheetExists(sheets);

    // Update headers
    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'WhatIOffer!A1:K1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[
                'slug', 'heroTitle', 'heroSubtitle', 'services', 'whyChooseMe',
                'showcaseTitle', 'showcaseSubtitle', 'showcaseItems', 'ctaTitle', 'ctaDescription', 'updatedAt'
            ]]
        }
    });

    const rowData = [
        'what-i-offer',
        content.heroTitle || '',
        content.heroSubtitle || '',
        JSON.stringify(content.services || []),
        JSON.stringify(content.whyChooseMe || []),
        content.showcaseTitle || '',
        content.showcaseSubtitle || '',
        JSON.stringify(content.showcaseItems || []),
        content.ctaTitle || '',
        content.ctaDescription || '',
        updatedAt
    ];

    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'WhatIOffer!A2:K2',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [rowData],
        },
    });

    return { slug: 'what-i-offer', content, updatedAt };
}



async function ensureHomeSheetExists(sheets: any) {
    try {
        await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Home!A1',
        });
    } catch (error) {
        console.log("Creating 'Home' sheet...");
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                requests: [{
                    addSheet: {
                        properties: { title: 'Home' }
                    }
                }]
            }
        });

        // Initialize Header Row
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Home!A1:J1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [['slug', 'heroBadge', 'heroTitle', 'heroSubtitle', 'heroStats', 'featuredTitle', 'featuredDescription', 'ctaTitle', 'ctaDescription', 'updatedAt']]
            }
        });
    }
}

async function updateHomePage(content: any) {
    console.log("Entering updateHomePage...");
    const sheets = await getGoogleSheets();
    await ensureHomeSheetExists(sheets);
    await ensureContactSheetExists(sheets);
    console.log("Home sheet ensured.");

    const rowsReference = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Home!A:A',
    });

    const rows = rowsReference.data.values || [];
    // We only have one row for home, so we can just update row 2
    let rowIndex = 1;

    // A: slug, B: heroBadge, C: heroTitle, D: heroSubtitle, E: heroStats (JSON)
    // F: featuredTitle, G: featuredDescription, H: ctaTitle, I: ctaDescription, J: updatedAt
    const rowData = [
        'home',
        content.heroBadge || '',
        content.heroTitle || '',
        content.heroSubtitle || '',
        JSON.stringify(content.heroStats || []),
        content.featuredTitle || '',
        content.featuredDescription || '',
        content.ctaTitle || '',
        content.ctaDescription || '',
        new Date().toISOString()
    ];

    console.log("Updating Home sheet with data:", rowData);

    const res = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Home!A2:J2`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [rowData] }
    });
    console.log("Home sheet update response status:", res.status);

    return { slug: 'home', content, updatedAt: rowData[7] };
}

async function getHomePage() {
    const sheets = await getGoogleSheets();
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Home!A2:J2',
        });

        const row = response.data.values?.[0];

        if (!row) return getDefaultPageContent('home');

        // Parse Columns back to Object
        return {
            slug: 'home',
            content: {
                heroBadge: row[1] || '',
                heroTitle: row[2] || '',
                heroSubtitle: row[3] || '',
                heroStats: (() => {
                    try { return row[4] ? JSON.parse(row[4]) : [] } catch { return [] }
                })(),
                featuredTitle: row[5] || '',
                featuredDescription: row[6] || '',
                ctaTitle: row[7] || '',
                ctaDescription: row[8] || ''
            },
            updatedAt: row[9] || ''
        };
    } catch (e) {
        console.warn("Home sheet likely missing, returning defaults");
        return getDefaultPageContent('home');
    }
}

async function ensureContactSheetExists(sheets: any) {
    const spreadsheetId = SPREADSHEET_ID;
    const metadata = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetExists = metadata.data.sheets?.some((s: any) => s.properties?.title === 'Contact');

    if (!sheetExists) {
        console.log("Creating Contact sheet...");
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [{ addSheet: { properties: { title: 'Contact' } } }]
            }
        });

        // Initialize Header Row
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: 'Contact!A1:K1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                // A: slug, B: headerTitle, C: headerSubtitle, D: email, E: phone, F: whatsapp, G: linkedin, H: instagram, I: responseTimeTitle, J: responseTimeDescription, K: updatedAt
                values: [['slug', 'headerTitle', 'headerSubtitle', 'email', 'phone', 'whatsapp', 'linkedin', 'instagram', 'responseTimeTitle', 'responseTimeDescription', 'updatedAt']]
            }
        });
    }
}

export async function updateContactPage(content: any) {
    const sheets = await getGoogleSheets();
    await ensureContactSheetExists(sheets);

    // Format Data for Columns
    // A: slug, B: headerTitle, C: headerSubtitle, D: email, E: phone, F: whatsapp, G: linkedin, H: instagram, I: responseTimeTitle, J: responseTimeDescription, K: updatedAt
    const rowData = [
        'contact',
        content.headerTitle || '',
        content.headerSubtitle || '',
        content.email || '',
        content.phone || '',
        content.whatsapp || '',
        content.linkedin || '',
        content.instagram || '',
        content.responseTimeTitle || '',
        content.responseTimeDescription || '',
        new Date().toISOString()
    ];

    console.log("Updating Contact sheet with data:", rowData);

    const res = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Contact!A2:K2`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [rowData] }
    });

    console.log("Contact Page Updated. Response:", res.status);

    return { success: true, timestamp: new Date().toISOString() };
}

export async function getContactPage() {
    const sheets = await getGoogleSheets();
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Contact!A2:K2',
        });

        const row = response.data.values?.[0];

        if (!row) return getDefaultPageContent('contact');

        // Parse Columns back to Object
        return {
            slug: 'contact',
            content: {
                headerTitle: row[1] || '',
                headerSubtitle: row[2] || '',
                email: row[3] || '',
                phone: row[4] || '',
                whatsapp: row[5] || '',
                linkedin: row[6] || '',
                instagram: row[7] || '',
                responseTimeTitle: row[8] || '',
                responseTimeDescription: row[9] || ''
            },
            updatedAt: row[10] || ''
        };
    } catch (e) {
        console.warn("Contact sheet likely missing, returning defaults");
        return getDefaultPageContent('contact');
    }
}

async function ensureWhatIOfferSheetExists(sheets: any) {
    try {
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });

        const sheetExists = spreadsheet.data.sheets?.some(
            (s: any) => s.properties?.title === 'WhatIOffer'
        );

        if (!sheetExists) {
            console.log("Creating 'WhatIOffer' sheet...");
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    requests: [{
                        addSheet: {
                            properties: {
                                title: 'WhatIOffer',
                                gridProperties: { frozenRowCount: 1 }
                            }
                        }
                    }]
                }
            });
        }
    } catch (error) {
        console.error('Error ensuring WhatIOffer sheet exists:', error);
    }
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

    const newContacts = contacts.filter(c => c.status === 'unread').length;
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
