export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    longDescription?: string;
    category: ProjectCategory | ProjectCategory[]; // Support both single and multiple categories
    techStack: string[];
    features: string[];
    thumbnail: string;
    screenshots: string[];
    demoUrl?: string;
    demoType: 'web' | 'video' | 'apk' | 'testflight' | 'none';
    status: 'live' | 'coming-soon' | 'archived';
    featured: boolean;
    documents?: {
        name: string;
        url: string;
        previewUrl?: string; // Optional preview image for the document
    }[];
    createdAt: Date | string;
    updatedAt: Date | string;
}

export type ProjectCategory =
    | 'web-app'
    | 'mobile-app'
    | 'ai-tool'
    | 'business-tool'
    | 'other';

export interface ProjectFormData {
    title: string;
    description: string;
    longDescription?: string;
    category: ProjectCategory | ProjectCategory[];
    techStack: string[];
    features: string[];
    demoUrl?: string;
    demoType: Project['demoType'];
    status: Project['status'];
    featured: boolean;
}

export const PROJECT_CATEGORIES: { value: ProjectCategory; label: string }[] = [
    { value: 'web-app', label: 'Web Apps' },
    { value: 'mobile-app', label: 'Mobile Apps' },
    { value: 'ai-tool', label: 'AI Tools' },
    { value: 'business-tool', label: 'Business Tools' },
    { value: 'other', label: 'Other' },
];

export const DEMO_TYPES: { value: Project['demoType']; label: string }[] = [
    { value: 'web', label: 'Live Web Demo' },
    { value: 'video', label: 'Video Demo' },
    { value: 'apk', label: 'Android APK' },
    { value: 'testflight', label: 'iOS TestFlight' },
    { value: 'none', label: 'No Demo' },
];
