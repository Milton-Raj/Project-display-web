import { NextResponse } from 'next/server';
import { deleteContact, updateContactStatus } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const contact = await updateContactStatus(id, status);
        if (!contact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });

        return NextResponse.json({ contact });
    } catch (error) {
        console.error('Error updating contact:', error);
        return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log(`API [Dynamic]: Deleting contact with ID: ${id}`);

        const success = await deleteContact(id);

        if (!success) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}
