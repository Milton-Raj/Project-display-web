import { NextResponse } from 'next/server';
import { getAllContacts, createContact, updateContactStatus, deleteContact } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
    const contacts = await getAllContacts();
    return NextResponse.json({ contacts });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, subject, message, attachment } = body;

        if (!name || !email || !phone || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { createContact } = await import('@/lib/database');
        const contact = await createContact({
            name,
            email,
            phone: phone || '',
            subject,
            message,
            attachment: attachment || undefined,
        });

        // Send email notification (fire and forget)
        const { sendContactEmail } = await import('@/lib/mail');
        sendContactEmail({
            name,
            email,
            phone: phone || '',
            subject,
            message,
            attachment: attachment || undefined
        }).catch(console.error);

        return NextResponse.json({ contact }, { status: 201 });
    } catch (error) {
        console.error('Error creating contact:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create contact' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
        }

        const contact = await updateContactStatus(id, status);

        if (!contact) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }

        return NextResponse.json({ contact });
    } catch (error) {
        console.error('Error updating contact:', error);
        return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
        }

        console.log(`API: Deleting contact with ID: ${id}`);
        const success = await deleteContact(id);
        console.log(`API: Delete result for ${id}: ${success}`);

        if (!success) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}
