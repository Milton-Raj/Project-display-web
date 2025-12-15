// Re-export all functions from google-sheets.ts
export {
    // Contacts
    createContact,
    getAllContacts,
    updateContactStatus,
    deleteContact,

    // Projects
    createProject,
    getAllProjects,
    getProjectById,
    getProjectBySlug,
    getFeaturedProjects,
    updateProject,
    deleteProject,

    // Pages
    getPageContent,
    processPageUpdate as updatePageContent,
    processPageUpdate,

    // Settings
    getSetting,
    getAllSettings,
    updateSetting,
    getAdminPasswordHash,
    updateAdminPassword,
    getAdminEmail,

    // Stats
    getStats,
} from './google-sheets';
