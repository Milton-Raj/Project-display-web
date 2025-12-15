import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { deleteProject, updateProject, getProjectById } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const project = await getProjectById(id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    return NextResponse.json({ project });
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const project = await updateProject(id, body);
        if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

        return NextResponse.json({ project });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log(`API [Dynamic]: Deleting project with ID: ${id}`);

        const success = await deleteProject(id);

        if (!success) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Wait a moment for Google Sheets to propagate the deletion
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Revalidate all paths where projects appear
        revalidatePath('/projects');
        revalidatePath('/admin/projects');
        revalidatePath('/admin/dashboard');
        revalidatePath('/'); // For featured projects on home

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
