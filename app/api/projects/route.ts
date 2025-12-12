import { NextResponse } from 'next/server';
import { createProject, getAllProjects, getProjectBySlug, updateProject, deleteProject } from '@/lib/database';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            // Fetch single project by ID for edit page
            const projects = await getAllProjects();
            const project = projects.find(p => p.id === id);

            if (!project) {
                return NextResponse.json(
                    { error: 'Project not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({ project });
        }

        // Fetch all projects
        const projects = await getAllProjects();
        return NextResponse.json({ projects });
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const project = await createProject(data);

        // Revalidate the public projects page to show the new project immediately
        revalidatePath('/projects');
        revalidatePath('/');

        return NextResponse.json(project);
    } catch (error: any) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create project' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { id, ...updates } = data;

        if (!id) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const project = await updateProject(id, updates);

        // Revalidate pages to show the updated project immediately
        revalidatePath('/projects');
        revalidatePath(`/projects/${project.slug}`);
        revalidatePath('/');

        return NextResponse.json(project);
    } catch (error: any) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update project' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        await deleteProject(id);

        // Revalidate pages to remove the deleted project immediately
        revalidatePath('/projects');
        revalidatePath('/');

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete project' },
            { status: 500 }
        );
    }
}
