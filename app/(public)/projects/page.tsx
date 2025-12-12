import { getAllProjects } from "@/lib/database";
import { ProjectsList } from "@/components/projects/ProjectsList";

export const revalidate = 3600; // Cache for 1 hour

export default async function ProjectsPage() {
    const projects = await getAllProjects();

    return (
        <div className="container-custom py-20 space-y-12">
            {/* Page Header */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold">
                    My <span className="gradient-text">Projects</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Explore my portfolio of web applications, mobile apps, and innovative digital solutions.
                </p>
            </div>

            <ProjectsList initialProjects={projects} />
        </div>
    );
}
