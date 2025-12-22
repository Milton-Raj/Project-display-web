import type { Project, ProjectCategory } from '@/types/project';
import { supabase, supabaseAdmin } from './supabase';
import * as fs from 'fs';
import * as path from 'path';

// Google Sheets related constants and functions removed after Supabase migration

// HELPER FOR LOCAL FALLBACKS
const DATA_DIR = path.join(process.cwd(), 'data');

async function getLocalProjects(): Promise<Project[]> {
    try {
        const filePath = path.join(DATA_DIR, 'projects.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.warn('Failed to read local projects:', e);
    }
    return [];
}

async function getLocalPageContent(slug: string) {
    try {
        const filePath = path.join(DATA_DIR, 'content.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const allContent = JSON.parse(data);
            if (allContent[slug]) {
                return {
                    slug,
                    content: allContent[slug],
                    updatedAt: new Date().toISOString()
                };
            }
        }
    } catch (e) {
        console.warn(`Failed to read local page content for ${slug}:`, e);
    }
    return null;
}

// ==================== CONTACTS ====================

export async function createContact(contact: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    attachment?: string;
}) {
    const id = `contact_${Date.now()}`;
    const createdAt = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from('contacts')
        .insert({
            id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            subject: contact.subject,
            message: contact.message,
            attachment: contact.attachment || '',
            status: 'unread',
            created_at: createdAt,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating contact in Supabase:', error);
        throw error;
    }

    return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        attachment: data.attachment,
        status: data.status,
        createdAt: data.created_at,
    };
}

export async function getAllContacts() {
    const { data, error } = await supabaseAdmin
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error getting contacts from Supabase:', error);
        return [];
    }

    return (data || []).map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        subject: row.subject,
        message: row.message,
        attachment: row.attachment,
        status: row.status as 'unread' | 'read' | 'replied',
        createdAt: row.created_at,
    }));
}

export async function updateContactStatus(id: string, status: string) {
    const { data, error } = await supabaseAdmin
        .from('contacts')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating contact status in Supabase:', error);
        throw error;
    }

    return {
        id: data.id,
        status: data.status,
    };
}

export async function deleteContact(id: string) {
    const { error } = await supabaseAdmin
        .from('contacts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting contact in Supabase:', error);
        return false;
    }

    return true;
}

// ==================== PROJECTS ====================

export async function createProject(project: any) {
    const id = project.id || `project_${Date.now()}`;
    const createdAt = new Date().toISOString();

    const technologies = project.techStack || project.technologies || [];
    const thumbnail = project.thumbnail || project.image || '';

    const { data, error } = await supabaseAdmin
        .from('projects')
        .insert({
            id,
            title: project.title,
            slug: project.slug,
            description: project.description,
            long_description: project.longDescription || '',
            category: Array.isArray(project.category) ? project.category : (project.category ? String(project.category).split(',') : []),
            tech_stack: technologies,
            image: thumbnail,
            thumbnail: thumbnail,
            demo_url: project.demoUrl || '',
            github_url: project.githubUrl || '',
            featured: project.featured === true || project.featured === 'TRUE',
            created_at: createdAt,
            updated_at: createdAt,
            features: Array.isArray(project.features) ? project.features : (project.features ? project.features.split('|') : []),
            screenshots: Array.isArray(project.screenshots) ? project.screenshots : (project.screenshots ? project.screenshots.split(',') : []),
            documents: Array.isArray(project.documents) ? project.documents : [],
            video_url: project.videoUrl || '',
            app_store_url: project.appStoreUrl || '',
            play_store_url: project.playStoreUrl || '',
            apk_url: project.apkUrl || '',
            test_flight_url: project.testFlightUrl || '',
            demo_type: project.demoType || 'none',
            status: project.status || 'live',
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating project in Supabase:', error);
        throw error;
    }

    return mapProjectRow(data);
}

function mapProjectRow(p: any): Project {
    return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        longDescription: p.long_description,
        category: p.category,
        technologies: p.tech_stack || [],
        techStack: p.tech_stack || [],
        image: p.image,
        thumbnail: p.thumbnail,
        demoUrl: p.demo_url,
        githubUrl: p.github_url,
        featured: p.featured,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        features: p.features || [],
        screenshots: p.screenshots || [],
        documents: p.documents || [],
        videoUrl: p.video_url,
        appStoreUrl: p.app_store_url,
        playStoreUrl: p.play_store_url,
        apkUrl: p.apk_url,
        testFlightUrl: p.test_flight_url,
        demoType: p.demo_type,
        status: p.status,
        views: p.views || 0,
    };
}

export async function getAllProjects(): Promise<Project[]> {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(mapProjectRow);
    } catch (error) {
        console.error('Error getting projects from Supabase:', error);
        const local = await getLocalProjects();
        if (local.length > 0) return local;
        return [];
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
    const updatedAt = new Date().toISOString();

    // Explicitly mapping supported fields to snake_case
    const payload: any = {
        updated_at: updatedAt
    };

    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.slug !== undefined) payload.slug = updates.slug;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.longDescription !== undefined) payload.long_description = updates.longDescription;
    if (updates.category !== undefined) {
        payload.category = Array.isArray(updates.category) ? updates.category : (updates.category ? String(updates.category).split(',') : []);
    }
    const tech = updates.techStack || updates.technologies;
    if (tech !== undefined) payload.tech_stack = tech;

    const image = updates.thumbnail || updates.image;
    if (image !== undefined) {
        payload.image = image;
        payload.thumbnail = image;
    }

    if (updates.demoUrl !== undefined) payload.demo_url = updates.demoUrl;
    if (updates.githubUrl !== undefined) payload.github_url = updates.githubUrl;
    if (updates.featured !== undefined) payload.featured = updates.featured === true || updates.featured === 'TRUE';
    if (updates.features !== undefined) {
        payload.features = Array.isArray(updates.features) ? updates.features : (updates.features ? String(updates.features).split('|') : []);
    }
    if (updates.screenshots !== undefined) {
        payload.screenshots = Array.isArray(updates.screenshots) ? updates.screenshots : (updates.screenshots ? String(updates.screenshots).split(',') : []);
    }
    if (updates.documents !== undefined) payload.documents = updates.documents;
    if (updates.videoUrl !== undefined) payload.video_url = updates.videoUrl;
    if (updates.appStoreUrl !== undefined) payload.app_store_url = updates.appStoreUrl;
    if (updates.playStoreUrl !== undefined) payload.play_store_url = updates.playStoreUrl;
    if (updates.apkUrl !== undefined) payload.apk_url = updates.apkUrl;
    if (updates.testFlightUrl !== undefined) payload.test_flight_url = updates.testFlightUrl;
    if (updates.demoType !== undefined) payload.demo_type = updates.demoType;
    if (updates.status !== undefined) payload.status = updates.status;

    const { data, error } = await supabaseAdmin
        .from('projects')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating project in Supabase:', error);
        throw error;
    }

    return mapProjectRow(data);
}

export async function deleteProject(id: string) {
    try {
        const { error } = await supabaseAdmin
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) throw error;

        console.log(`Successfully deleted project ${id} from Supabase`);
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

    try {
        const { data, error } = await supabase
            .from('pages')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            return getDefaultPageContent(slug);
        }

        return {
            slug: data.slug,
            content: data.content,
            updatedAt: data.updated_at,
        };
    } catch (error) {
        console.error('Error getting page content:', error);
        return getDefaultPageContent(slug);
    }
}

async function getAboutPage() {
    try {
        const { data, error } = await supabase
            .from('about_page')
            .select('*')
            .eq('slug', 'about')
            .maybeSingle();

        if (error || !data) {
            return getDefaultPageContent('about');
        }

        return {
            slug: 'about',
            content: {
                heroBadge: data.hero_badge || '',
                heroTitle: data.hero_title || '',
                heroSubtitle1: data.hero_subtitle1 || '',
                profileImage: data.profile_image || '',
                experienceYears: data.experience_years || '',
                skillsTitle: data.skills_title || '',
                skillsSubtitle: data.skills_subtitle || '',
                skills: data.skills || [],
                certificationsTitle: data.certifications_title || '',
                certifications: data.certifications || [],
            },
            updatedAt: data.updated_at,
        };
    } catch (error) {
        console.warn('Error getting About page from Supabase (trying local fallback):', error);
        const local = await getLocalPageContent('about');
        if (local) return local;
        return getDefaultPageContent('about');
    }
}

async function getWhatIOfferPage() {
    try {
        const { data, error } = await supabase
            .from('what_i_offer_page')
            .select('*')
            .eq('slug', 'what-i-offer')
            .maybeSingle();

        if (error || !data) {
            return getDefaultPageContent('what-i-offer');
        }

        return {
            slug: 'what-i-offer',
            content: {
                heroTitle: data.hero_title || '',
                heroSubtitle: data.hero_subtitle || '',
                services: data.services || [],
                whyChooseMe: data.why_choose_me || [],
                showcaseTitle: data.showcase_title || '',
                showcaseSubtitle: data.showcase_subtitle || '',
                showcaseItems: data.showcase_items || [],
                ctaTitle: data.cta_title || '',
                ctaDescription: data.cta_description || '',
            },
            updatedAt: data.updated_at,
        };
    } catch (error) {
        console.warn('Error getting WhatIOffer page from Supabase (trying local fallback):', error);
        const local = await getLocalPageContent('what-i-offer');
        if (local) return local;
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
        return updateHomePage(content);
    }
    if (normalizedSlug === 'contact') {
        return updateContactPage(content);
    }
    if (normalizedSlug === 'about') {
        return updateAboutPage(content);
    }
    if (normalizedSlug === 'what-i-offer') {
        return updateWhatIOfferPage(content);
    }

    const updatedAt = new Date().toISOString();
    const { data, error } = await supabaseAdmin
        .from('pages')
        .upsert({
            slug,
            content,
            updated_at: updatedAt,
        })
        .select()
        .single();

    if (error) {
        console.error('Error updating page in Supabase:', error);
        throw error;
    }

    return data;
}

async function updateAboutPage(content: any) {
    const updatedAt = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from('about_page')
        .upsert({
            slug: 'about',
            hero_badge: content.heroBadge || '',
            hero_title: content.heroTitle || '',
            hero_subtitle1: content.heroSubtitle1 || '',
            profile_image: content.profileImage || '',
            experience_years: content.experienceYears || '',
            skills_title: content.skillsTitle || '',
            skills_subtitle: content.skillsSubtitle || '',
            skills: content.skills || [],
            certifications_title: content.certificationsTitle || '',
            certifications: Array.isArray(content.certifications) ? content.certifications : (content.certifications ? content.certifications.split(',') : []),
            updated_at: updatedAt,
        })
        .select()
        .single();

    if (error) {
        console.error('Error updating About page in Supabase:', error);
        throw error;
    }

    return { slug: 'about', content, updatedAt };
}



async function updateWhatIOfferPage(content: any) {
    const updatedAt = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from('what_i_offer_page')
        .upsert({
            slug: 'what-i-offer',
            hero_title: content.heroTitle || '',
            hero_subtitle: content.heroSubtitle || '',
            services: content.services || [],
            why_choose_me: content.whyChooseMe || [],
            showcase_title: content.showcaseTitle || '',
            showcase_subtitle: content.showcaseSubtitle || '',
            showcase_items: content.showcaseItems || [],
            cta_title: content.ctaTitle || '',
            cta_description: content.ctaDescription || '',
            updated_at: updatedAt
        })
        .select()
        .single();

    if (error) {
        console.error('Error updating WhatIOffer page in Supabase:', error);
        throw error;
    }

    return { slug: 'what-i-offer', content, updatedAt };
}

async function updateHomePage(content: any) {
    const updatedAt = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from('home_page')
        .upsert({
            slug: 'home',
            hero_badge: content.heroBadge || '',
            hero_title: content.heroTitle || '',
            hero_subtitle: content.heroSubtitle || '',
            hero_stats: content.heroStats || [],
            featured_title: content.featuredTitle || '',
            featured_description: content.featuredDescription || '',
            cta_title: content.ctaTitle || '',
            cta_description: content.ctaDescription || '',
            updated_at: updatedAt
        })
        .select()
        .single();

    if (error) {
        console.error('Error updating Home page in Supabase:', error);
        throw error;
    }

    return { slug: 'home', content, updatedAt };
}

export async function updateContactPage(content: any) {
    const updatedAt = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from('contact_page')
        .upsert({
            slug: 'contact',
            header_title: content.headerTitle || '',
            header_subtitle: content.headerSubtitle || '',
            email: content.email || '',
            phone: content.phone || '',
            whatsapp: content.whatsapp || '',
            linkedin: content.linkedin || '',
            instagram: content.instagram || '',
            response_time_title: content.responseTimeTitle || '',
            response_time_description: content.responseTimeDescription || '',
            updated_at: updatedAt
        })
        .select()
        .single();

    if (error) {
        console.error('Error updating Contact page in Supabase:', error);
        throw error;
    }

    return { success: true, timestamp: updatedAt };
}

async function getHomePage() {
    try {
        const { data, error } = await supabase
            .from('home_page')
            .select('*')
            .eq('slug', 'home')
            .maybeSingle();

        if (error || !data) return getDefaultPageContent('home');

        return {
            slug: 'home',
            content: {
                heroBadge: data.hero_badge || '',
                heroTitle: data.hero_title || '',
                heroSubtitle: data.hero_subtitle || '',
                heroStats: data.hero_stats || [],
                featuredTitle: data.featured_title || '',
                featuredDescription: data.featured_description || '',
                ctaTitle: data.cta_title || '',
                ctaDescription: data.cta_description || '',
            },
            updatedAt: data.updated_at,
        };
    } catch (e) {
        console.warn("Home page Supabase fetch failed (trying local fallback)");
        const local = await getLocalPageContent('home');
        if (local) return local;
        return getDefaultPageContent('home');
    }
}

// Helper functions removed as they are no longer needed for Supabase migration
// (ensureAboutSheetExists, ensureWhatIOfferSheetExists, ensureHomeSheetExists, ensureContactSheetExists)

export async function getContactPage() {
    try {
        const { data, error } = await supabase
            .from('contact_page')
            .select('*')
            .eq('slug', 'contact')
            .maybeSingle();

        if (error || !data) return getDefaultPageContent('contact');

        return {
            slug: 'contact',
            content: {
                headerTitle: data.header_title || '',
                headerSubtitle: data.header_subtitle || '',
                email: data.email || '',
                phone: data.phone || '',
                whatsapp: data.whatsapp || '',
                linkedin: data.linkedin || '',
                instagram: data.instagram || '',
                responseTimeTitle: data.response_time_title || '',
                responseTimeDescription: data.response_time_description || '',
            },
            updatedAt: data.updated_at,
        };
    } catch (e) {
        console.warn("Contact page Supabase fetch failed (trying local fallback)");
        const local = await getLocalPageContent('contact');
        if (local) return local;
        return getDefaultPageContent('contact');
    }
}

// Removed ensureWhatIOfferSheetExists

// ==================== SETTINGS ====================

export async function getSetting(key: string) {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('key', key)
            .maybeSingle();

        if (error) return null;
        if (!data) return null; // maybeSingle returns null for data if no record found, without an error

        return {
            ...data,
            updatedAt: data.updated_at
        };
    } catch (error) {
        console.error('Error getting setting:', error);
        return null;
    }
}

export async function getAllSettings() {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*');

        if (error) throw error;

        const settings: Record<string, any> = {};
        (data || []).forEach(row => {
            if (row.key) {
                settings[row.key] = {
                    ...row,
                    updatedAt: row.updated_at
                };
            }
        });

        return settings;
    } catch (error) {
        console.error('Error getting all settings:', error);
        return {};
    }
}

export async function updateSetting(key: string, value: string, status: string = 'active') {
    const updatedAt = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from('settings')
        .upsert({
            key,
            value,
            updated_at: updatedAt,
        })
        .select()
        .single();

    if (error) {
        console.error('Error updating setting in Supabase:', error);
        throw error;
    }

    return data;
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
