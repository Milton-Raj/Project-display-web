"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROJECT_CATEGORIES, ProjectCategory, Project } from "@/types/project";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectsListProps {
    initialProjects: Project[];
}

const PROJECTS_PER_PAGE = 15;

export function ProjectsList({ initialProjects }: ProjectsListProps) {
    const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Sort projects by createdAt (newest first)
    const sortedProjects = [...initialProjects].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Newest first
    });

    // Filter projects based on category and search
    const filteredProjects = sortedProjects.filter((project) => {
        const matchesCategory = selectedCategory === "all" ||
            (Array.isArray(project.category)
                ? project.category.includes(selectedCategory as ProjectCategory)
                : project.category === selectedCategory);
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    const handleCategoryChange = (category: ProjectCategory | "all") => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-12">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-12 h-14 text-base"
                    />
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    onClick={() => handleCategoryChange("all")}
                    className={cn(
                        "transition-all",
                        selectedCategory === "all" && "glow-primary"
                    )}
                >
                    All Projects
                </Button>
                {PROJECT_CATEGORIES.map((category) => (
                    <Button
                        key={category.value}
                        variant={selectedCategory === category.value ? "secondary" : "outline"}
                        onClick={() => handleCategoryChange(category.value)}
                        className={cn(
                            "transition-all",
                            selectedCategory === category.value && "glow-secondary"
                        )}
                    >
                        {category.label}
                    </Button>
                ))}
            </div>

            {/* Projects Grid */}
            {paginatedProjects.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedProjects.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 pt-8">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        onClick={() => setCurrentPage(page)}
                                        className={cn(
                                            "w-10 h-10 p-0",
                                            currentPage === page && "glow-primary"
                                        )}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="gap-2"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {/* Results Info */}
                    <div className="text-center text-sm text-muted-foreground">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} projects
                    </div>
                </>
            ) : (
                <div className="text-center py-20 space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full glass flex items-center justify-center">
                        <Search className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold">No Projects Found</h3>
                    <p className="text-muted-foreground">
                        {searchQuery
                            ? "Try adjusting your search query or filters"
                            : "Projects will appear here once you add them via the admin panel"}
                    </p>
                </div>
            )}
        </div>
    );
}
