export interface Blog {
    id: string;
    title: string;
    slug: string;
    header_image: string;
    content: string;
    status: 'published' | 'draft' | 'archived';
    createdAt: Date | string;
    updatedAt?: Date | string;
}

export interface BlogFormData {
    title: string;
    slug: string;
    header_image: string;
    content: string;
    status: Blog['status'];
}
