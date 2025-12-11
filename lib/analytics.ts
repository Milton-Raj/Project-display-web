import { Project } from "@/types/project";

export interface Contact {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'replied';
    createdAt: string;
}

// Mock daily visits data since we don't have a real tracker yet
export const getVisitorData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Return empty/flat data until we implement a real visit tracker database
    return days.map(day => ({
        name: day,
        visits: 0,
        views: 0,
    }));
};

export const getProjectStats = (projects: any[]) => {
    // 1. Top Performing Projects (Real views if available, else 0)
    const topProjects = projects.map(p => ({
        ...p,
        views: p.views || 0
    }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 3);

    // 2. Category Distribution
    const categoryCount: Record<string, number> = {};
    projects.forEach(p => {
        const categories = Array.isArray(p.category) ? p.category : [p.category];
        categories.forEach((c: string) => {
            // Clean up category name (remove hyphens, capitalize)
            if (!c) return;
            const name = c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            categoryCount[name] = (categoryCount[name] || 0) + 1;
        });
    });
    const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

    // 3. Tech Stack Overview
    const techCount: Record<string, number> = {};
    projects.forEach(p => {
        if (Array.isArray(p.techStack)) {
            p.techStack.forEach((t: string) => {
                if (!t) return;
                // Simplify tech names (e.g., "React.js" -> "React")
                let name = t.trim().split('(')[0].trim(); // Remove details in parens
                if (name.includes('/')) name = name.split('/')[0].trim(); // Take first if slash
                if (name) techCount[name] = (techCount[name] || 0) + 1;
            });
        }
    });
    const techData = Object.entries(techCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5) // Top 5 techs
        .map(([name, value]) => ({ name, value }));

    return { topProjects, categoryData, techData };
};

export const getRecentInquiries = (contacts: any[]) => {
    return contacts
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
};
