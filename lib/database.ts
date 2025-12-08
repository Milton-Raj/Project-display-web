import fs from 'fs/promises';
import path from 'path';
import { Project } from '@/types/project';
import { ContactSubmission } from '@/types/contact';

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');
const CONTACTS_FILE = path.join(process.cwd(), 'data', 'contacts.json');

// ============= PROJECTS =============

export async function getAllProjects(): Promise<Project[]> {
    try {
        const data = await fs.readFile(PROJECTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading projects:', error);
        return [];
    }
}

export async function getProjectById(id: string): Promise<Project | null> {
    const projects = await getAllProjects();
    return projects.find(p => p.id === id) || null;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const projects = await getAllProjects();
    return projects.find(p => p.slug === slug) || null;
}

export async function getFeaturedProjects(limit: number = 3): Promise<Project[]> {
    const projects = await getAllProjects();
    return projects
        .filter(p => p.featured === true && p.status === 'live')
        .slice(0, limit);
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const projects = await getAllProjects();

    const newProject: Project = {
        ...project,
        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    projects.push(newProject);
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');

    return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const projects = await getAllProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) return null;

    projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
    return projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
    const projects = await getAllProjects();
    const filtered = projects.filter(p => p.id !== id);

    if (filtered.length === projects.length) return false;

    await fs.writeFile(PROJECTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
}

// ============= CONTACTS =============

export async function getAllContacts(): Promise<ContactSubmission[]> {
    try {
        const data = await fs.readFile(CONTACTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading contacts:', error);
        return [];
    }
}

export async function getContactById(id: string): Promise<ContactSubmission | null> {
    const contacts = await getAllContacts();
    return contacts.find(c => c.id === id) || null;
}

export async function createContact(contact: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): Promise<ContactSubmission> {
    const contacts = await getAllContacts();

    const newContact: ContactSubmission = {
        ...contact,
        id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'unread',
        createdAt: new Date().toISOString(),
    };

    contacts.unshift(newContact); // Add to beginning
    await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');

    return newContact;
}

export async function updateContactStatus(id: string, status: 'unread' | 'read'): Promise<ContactSubmission | null> {
    const contacts = await getAllContacts();
    const index = contacts.findIndex(c => c.id === id);

    if (index === -1) return null;

    contacts[index].status = status;
    await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');

    return contacts[index];
}

export async function deleteContact(id: string): Promise<boolean> {
    const contacts = await getAllContacts();
    const filtered = contacts.filter(c => c.id !== id);

    if (filtered.length === contacts.length) return false;

    await fs.writeFile(CONTACTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
}

// ============= STATS =============

export async function getStats() {
    const projects = await getAllProjects();
    const contacts = await getAllContacts();

    return {
        totalProjects: projects.length,
        featuredProjects: projects.filter(p => p.featured).length,
        liveProjects: projects.filter(p => p.status === 'live').length,
        totalContacts: contacts.length,
        unreadMessages: contacts.filter(c => c.status === 'unread').length,
    };
}
