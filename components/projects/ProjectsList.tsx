"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROJECT_CATEGORIES, ProjectCategory, Project } from "@/types/project";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectsListProps {
    initialProjects: Project[];
}

export function ProjectsList({ initialProjects }: ProjectsListProps) {
    const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter projects based on category and search
    const filteredProjects = initialProjects.filter((project) => {
        const matchesCategory = selectedCategory === "all" ||
            (Array.isArray(project.category)
                ? project.category.includes(selectedCategory as ProjectCategory)
                : project.category === selectedCategory);
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-14 text-base"
                    />
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("all")}
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
                        onClick={() => setSelectedCategory(category.value)}
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
            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
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
