"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, X, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        header_image: "",
        content: "",
        status: "published" as any,
    });

    const [loadingMessage, setLoadingMessage] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    useEffect(() => {
        loadBlog();
    }, [params.id]);

    const loadBlog = async () => {
        try {
            const response = await fetch(`/api/blogs/${params.id}`);
            if (!response.ok) throw new Error('Failed to load blog');
            const data = await response.json();
            setFormData({
                title: data.title || "",
                slug: data.slug || "",
                header_image: data.header_image || "",
                content: data.content || "",
                status: data.status || "published",
            });
        } catch (error) {
            console.error('Error loading blog:', error);
            alert("Failed to load blog details");
            router.push('/admin/blogs');
        } finally {
            setIsLoading(false);
        }
    };

    const uploadFile = async (file: File) => {
        const payload = new FormData();
        payload.append('file', file);
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: payload,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        const data = await response.json();
        return data.url;
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnailFile(file);
            setFormData({ ...formData, header_image: '' }); // Clear manual URL
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title) {
            alert("Title is required.");
            return;
        }

        setIsSaving(true);
        setLoadingMessage("Preparing data...");

        try {
            // Upload thumbnail if new file selected
            let headerUrl = formData.header_image;
            if (thumbnailFile) {
                setLoadingMessage("Uploading header image...");
                headerUrl = await uploadFile(thumbnailFile);
            }

            // optionally update slug
            const slug = formData.slug || slugify(formData.title);

            setLoadingMessage("Saving blog...");
            const response = await fetch(`/api/blogs/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    slug,
                    header_image: headerUrl,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update blog');
            }

            router.push("/admin/blogs");
            router.refresh();
        } catch (error: any) {
            console.error("Failed to update blog:", error);
            alert(error.message || "Failed to update blog");
        } finally {
            setIsSaving(false);
            setLoadingMessage("");
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <Link href="/admin/blogs">
                            <Button variant="ghost" size="sm" className="mb-2">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Blogs
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">Edit Blog</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Blog Title *</label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="The Future of AI..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">URL Slug (auto-generated from title if blank)</label>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status *</label>
                                <select
                                    required
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full h-11 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Header Image</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {(formData.header_image || thumbnailFile) && (
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-white/10 shadow-lg group">
                                        <img
                                            src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : formData.header_image}
                                            alt="Header preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, header_image: "" });
                                                setThumbnailFile(null);
                                                const fileInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
                                                if (fileInput) fileInput.value = "";
                                            }}
                                            className="absolute top-2 right-2 p-2 rounded-full bg-destructive/90 hover:bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove image"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                                <div className="text-center text-sm text-muted-foreground my-2">- OR -</div>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.header_image}
                                        onChange={(e) => {
                                            setFormData({ ...formData, header_image: e.target.value });
                                            setThumbnailFile(null);
                                            const fileInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
                                            if (fileInput) fileInput.value = "";
                                        }}
                                        placeholder="Enter image URL directly"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            const seed = Math.random().toString(36).substring(7);
                                            setFormData({ ...formData, header_image: `https://picsum.photos/seed/${seed}/800/600` });
                                            setThumbnailFile(null);
                                        }}
                                        title="Generate random mock image"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Blog Content</label>
                                <RichTextEditor
                                    value={formData.content || ''}
                                    onChange={(html: string) => setFormData({ ...formData, content: html })}
                                    placeholder="Start writing your blog post here..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Link href="/admin/blogs">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" variant="gradient" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {loadingMessage || "Saving..."}
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
