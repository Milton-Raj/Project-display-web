export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    longDescription?: string;
    category: ProjectCategory | ProjectCategory[]; // Support both single and multiple categories
    technologies: string[]; // Alias for techStack
    techStack: string[];
    features: string[];
    image: string; // Main project image
    thumbnail: string;
    screenshots: string[];
    demoUrl?: string; // Live Web Demo
    videoUrl?: string; // Video Demo
    githubUrl?: string; // GitHub repository
    appStoreUrl?: string; // iOS App Store
    playStoreUrl?: string; // Google Play Store
    apkUrl?: string; // Android APK Download
    testFlightUrl?: string; // iOS TestFlight
    demoType: 'web' | 'mobile-ios' | 'mobile-android' | 'mobile-apk' | 'mobile-testflight' | 'video' | 'none';
    status: 'live' | 'coming-soon' | 'archived' | 'completed';
    featured: boolean;
    views?: number; // Total view count for the project
    challenges?: string[]; // Project challenges
    solutions?: string[]; // Solutions implemented
    results?: string[]; // Project results/outcomes
    documents?: {
        name: string;
        url: string;
        previewUrl?: string; // Optional preview image for the document
    }[];
    createdAt: Date | string;
    updatedAt?: Date | string;
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
    demoUrl?: string; // Live Web Demo
    videoUrl?: string; // Video Demo
    appStoreUrl?: string; // iOS App Store
    playStoreUrl?: string; // Google Play Store
    apkUrl?: string; // Android APK Download
    testFlightUrl?: string; // iOS TestFlight
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
    { value: 'mobile-ios', label: 'App Store (iOS)' },
    { value: 'mobile-android', label: 'Play Store (Android)' },
    { value: 'mobile-apk', label: 'Android APK Download' },
    { value: 'mobile-testflight', label: 'iOS TestFlight' },
    { value: 'video', label: 'Video Demo Only' },
    { value: 'none', label: 'No Demo' },
];
