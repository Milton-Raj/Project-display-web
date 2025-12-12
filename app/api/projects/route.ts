import { NextResponse } from 'next/server';
import { getAllProjects, createProject, updateProject, deleteProject, getProjectById } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const project = await getProjectById(id);
        return NextResponse.json({ project });
    }

    const projects = await getAllProjects();
    return NextResponse.json({ projects });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const project = await createProject(body);
        return NextResponse.json({ project }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        const errorMessage = error instanceof Error && error.message ? error.message : 'Unknown server error during project creation';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const project = await updateProject(id, updates);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        console.log(`API: Deleting project with ID: ${id}`);
        const success = await deleteProject(id);
        console.log(`API: Delete result for ${id}: ${success}`);

        if (!success) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
