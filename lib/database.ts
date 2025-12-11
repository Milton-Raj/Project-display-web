import { db } from './firebase';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit as limitQuery
} from 'firebase/firestore';
import { Project } from '@/types/project';
import { ContactSubmission } from '@/types/contact';

const PROJECTS_COLLECTION = 'projects';
const CONTACTS_COLLECTION = 'contacts';

// ============= PROJECTS =============

export async function getAllProjects(): Promise<Project[]> {
    try {
        const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as Project);
    } catch (error) {
        console.error('Error reading projects:', error);
        return [];
    }
}

export async function getProjectById(id: string): Promise<Project | null> {
    try {
        const docRef = doc(db, PROJECTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data() as Project) : null;
    } catch (error) {
        console.error('Error getting project by id:', error);
        return null;
    }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    try {
        const q = query(collection(db, PROJECTS_COLLECTION), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        return querySnapshot.docs[0].data() as Project;
    } catch (error) {
        console.error('Error getting project by slug:', error);
        return null;
    }
}

export async function getFeaturedProjects(limitVal: number = 3): Promise<Project[]> {
    try {
        // Query for featured and live projects
        // Note: Composite index might be required by Firestore. 
        // If it fails, we falls back to client-side filtering or simpler query.
        const q = query(
            collection(db, PROJECTS_COLLECTION),
            where('featured', '==', true),
            where('status', '==', 'live'),
            limitQuery(limitVal)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Project);
    } catch (error) {
        console.error('Error getting featured projects:', error);
        return [];
    }
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newProject: Project = {
        ...project,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    try {
        await setDoc(doc(db, PROJECTS_COLLECTION, id), newProject);
        return newProject;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
        const docRef = doc(db, PROJECTS_COLLECTION, id);
        const updatedData = {
            ...updates,
            updatedAt: new Date().toISOString()
        };
        await updateDoc(docRef, updatedData);

        // Fetch fresh data to return
        return getProjectById(id);
    } catch (error) {
        console.error('Error updating project:', error);
        return null;
    }
}

export async function deleteProject(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting project:', error);
        return false;
    }
}

// ============= CONTACTS =============

export async function getAllContacts(): Promise<ContactSubmission[]> {
    try {
        // Order by date desc usually better for contacts
        const q = query(collection(db, CONTACTS_COLLECTION)); // Add orderBy('createdAt', 'desc') if index exists
        const querySnapshot = await getDocs(q);
        // Manual sort if needed to avoid index errors for now
        const contacts = querySnapshot.docs.map(doc => doc.data() as ContactSubmission);
        return contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        console.error('Error reading contacts:', error);
        return [];
    }
}

export async function getContactById(id: string): Promise<ContactSubmission | null> {
    try {
        const docRef = doc(db, CONTACTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data() as ContactSubmission) : null;
    } catch (error) {
        console.error('Error getting contact by id:', error);
        return null;
    }
}

export async function createContact(contact: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): Promise<ContactSubmission> {
    const id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newContact: ContactSubmission = {
        ...contact,
        id,
        status: 'unread',
        createdAt: new Date().toISOString(),
    };

    try {
        await setDoc(doc(db, CONTACTS_COLLECTION, id), newContact);
        return newContact;
    } catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
}

export async function updateContactStatus(id: string, status: 'unread' | 'read'): Promise<ContactSubmission | null> {
    try {
        const docRef = doc(db, CONTACTS_COLLECTION, id);
        await updateDoc(docRef, { status });
        const updatedDoc = await getDoc(docRef);
        return updatedDoc.exists() ? (updatedDoc.data() as ContactSubmission) : null;
    } catch (error) {
        console.error('Error updating contact status:', error);
        return null;
    }
}

export async function deleteContact(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, CONTACTS_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting contact:', error);
        return false;
    }
}

// ============= STATS =============

export async function getStats() {
    // Note: For large collections, use aggregation queries (count()). 
    // Here we maintain existing behavior which reads all (acceptable for <1000 items).
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

// ============= PAGE CONTENT =============

export async function getPageContent(slug: string) {
    try {
        const docRef = doc(db, 'pages', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error("Error fetching page content:", error);
        return null;
    }
}

export async function updatePageContent(slug: string, content: any) {
    try {
        const docRef = doc(db, 'pages', slug);
        await setDoc(docRef, content, { merge: true });
        return true;
    } catch (error) {
        console.error("Error updating page content:", error);
        throw error;
    }
}
