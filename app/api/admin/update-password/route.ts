import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const ADMIN_FILE_PATH = path.join(process.cwd(), 'data', 'admin.json');

export async function POST(request: Request) {
    try {
        const { newPassword } = await request.json();

        if (!newPassword || newPassword.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Read current admin data
        const adminData = JSON.parse(
            await fs.readFile(ADMIN_FILE_PATH, 'utf-8')
        );

        // Update password hash
        adminData.passwordHash = hashedPassword;

        // Write back to file
        await fs.writeFile(
            ADMIN_FILE_PATH,
            JSON.stringify(adminData, null, 2),
            'utf-8'
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating password:', error);
        return NextResponse.json(
            { error: 'Failed to update password' },
            { status: 500 }
        );
    }
}
