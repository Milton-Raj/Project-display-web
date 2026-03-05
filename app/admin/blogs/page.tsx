"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, Edit, Trash2, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { format } from "date-fns";
import type { Blog } from "@/types/blog";
import Image from "next/image";

export default function BlogsPage() {
    const { toast } = useToast();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Delete dialog state
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/blogs');
            if (response.ok) {
                const data = await response.json();
                setBlogs(data);
            }
        } catch (error) {
            console.error('Error loading blogs:', error);
            toast({
                title: "Error",
                description: "Failed to load blogs.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            setIsDeleting(true);
            const response = await fetch(`/api/blogs/${deleteId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            setBlogs(blogs.filter(b => b.id !== deleteId));
            toast({
                title: "Success",
                description: "Blog deleted successfully.",
            });
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast({
                title: "Error",
                description: "Failed to delete blog.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const filteredBlogs = blogs.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-bold">Blogs</h1>
                    <Link href="/admin/blogs/new">
                        <Button className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Blog
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-0 focus-visible:ring-0 px-2"
                    />
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center py-12 glass rounded-2xl">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No blogs found</h3>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery ? "Try adjusting your search query." : "Get started by creating your first blog."}
                        </p>
                        {!searchQuery && (
                            <Link href="/admin/blogs/new">
                                <Button variant="outline">Create Blog</Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredBlogs.map((blog) => (
                            <div key={blog.id} className="glass p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                {blog.header_image ? (
                                    <div className="w-full sm:w-48 h-32 relative rounded-xl overflow-hidden bg-white/5 shrink-0">
                                        <Image
                                            src={blog.header_image}
                                            alt={blog.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full sm:w-48 h-32 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                        <FileText className="w-8 h-8 text-muted-foreground/50" />
                                    </div>
                                )}

                                <div className="flex-grow space-y-2 w-full">
                                    <h3 className="text-xl font-semibold line-clamp-1">{blog.title}</h3>

                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                        <span>Status: <span className="text-white capitalize">{blog.status}</span></span>
                                        <span>•</span>
                                        <span>Created: {format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0">
                                    <Link href={`/admin/blogs/${blog.id}`}>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-red-400"
                                        onClick={() => setDeleteId(blog.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Blog"
                description="Are you sure you want to delete this blog? This action cannot be undone."
                isLoading={isDeleting}
            />
        </AdminLayout>
    );
}

