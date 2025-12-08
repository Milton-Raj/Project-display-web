export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    attachment?: string; // Path to uploaded document
    status: 'read' | 'unread';
    createdAt: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    attachment?: File; // Uploaded file object
}
