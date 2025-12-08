"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, Search, Edit, Trash2, Eye, Star } from "lucide-react";
// Removed Firebase import - using API routes instead
import { Project } from "@/types/project";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // State for delete confirmation
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    async function loadProjects() {
        try {
            console.log("Loading projects...");
            const response = await fetch(`/api/projects?t=${Date.now()}`);
            const { projects: data } = await response.json();
            console.log("Projects loaded:", data.length);
            setProjects(data);
        } catch (error) {
            console.error("Failed to load projects:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function confirmDelete() {
        if (!projectToDelete) return;

        setIsDeleting(true);
        const id = projectToDelete;
        console.log("Proceeding with delete for ID:", id);

        try {
            console.log("Sending DELETE request...");
            const response = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
            console.log("Response received:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to delete project:", errorData);
                toast({
                    title: "Error",
                    description: "Failed to delete project. Please try again.",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Success",
                description: "Project deleted successfully.",
            });

            // Reload from server to ensure sync
            loadProjects();
        } catch (error) {
            console.error("Failed to delete project:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setProjectToDelete(null); // Close modal
        }
    }

    async function toggleFeatured(project: Project) {
        try {
            await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: project.id, featured: !project.featured })
            });
            setProjects(projects.map(p =>
                p.id === project.id ? { ...p, featured: !p.featured } : p
            ));
        } catch (error) {
            console.error("Failed to update project:", error);
        }
    }

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Projects</h1>
                        <p className="text-muted-foreground">
                            Manage your portfolio projects
                        </p>
                    </div>
                    <Link href="/admin/projects/new">
                        <Button variant="gradient" size="lg">
                            <Plus className="w-5 h-5 mr-2" />
                            Add Project
                        </Button>
                    </Link>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12"
                    />
                </div>

                {/* Projects Grid */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading projects...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <Card className="p-12 text-center glass">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <Plus className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Projects Yet</h3>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery ? "No projects match your search" : "Get started by adding your first project"}
                        </p>
                        {!searchQuery && (
                            <Link href="/admin/projects/new">
                                <Button variant="gradient">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Your First Project
                                </Button>
                            </Link>
                        )}
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredProjects.map((project) => (
                            <Card key={project.id} className="overflow-hidden glass hover-glow-primary transition-smooth">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Thumbnail */}
                                    <div className="relative w-full sm:w-48 h-48 bg-muted flex-shrink-0">
                                        {project.thumbnail ? (
                                            <Image
                                                src={project.thumbnail}
                                                alt={project.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                                                <span className="text-4xl font-bold gradient-text">
                                                    {project.title.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        {project.featured && (
                                            <div className="absolute top-2 right-2">
                                                <Badge variant="accent" className="gap-1">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    Featured
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(project.category) ? (
                                                project.category.map((cat, idx) => (
                                                    <Badge key={idx} variant="outline">
                                                        {cat.replace('-', ' ').toUpperCase()}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <Badge variant="outline">
                                                    {project.category.replace('-', ' ').toUpperCase()}
                                                </Badge>
                                            )}
                                            <Badge variant={project.status === 'live' ? 'success' : 'warning'}>
                                                {project.status}
                                            </Badge>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2">
                                            <Link href={`/projects/${project.slug}`} target="_blank">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/projects/${project.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleFeatured(project)}
                                            >
                                                <Star className={`w-4 h-4 mr-2 ${project.featured ? 'fill-current' : ''}`} />
                                                {project.featured ? 'Unfeature' : 'Feature'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={isDeleting && projectToDelete === project.id}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setProjectToDelete(project.id);
                                                }}
                                                className="text-destructive hover:bg-destructive/10"
                                            >
                                                {isDeleting && projectToDelete === project.id ? (
                                                    <span className="flex items-center">
                                                        <span className="animate-spin mr-2">⏳</span> Deleting...
                                                    </span>
                                                ) : (
                                                    <>
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Add Modal at the end */}
                <ConfirmDialog
                    isOpen={!!projectToDelete}
                    onClose={() => setProjectToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Delete Project"
                    description="Are you sure you want to delete this project? This action cannot be undone."
                    confirmText="Delete"
                    variant="destructive"
                    isLoading={isDeleting}
                />
            </div>
        </AdminLayout>
    );
}
