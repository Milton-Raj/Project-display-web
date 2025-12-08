import { NextRequest, NextResponse } from 'next/server';
import { comparePassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Read admin credentials from JSON file
        const adminFilePath = path.join(process.cwd(), 'data', 'admin.json');
        let adminData;

        try {
            const fileContent = await fs.readFile(adminFilePath, 'utf-8');
            adminData = JSON.parse(fileContent);
        } catch (fileError) {
            console.error('Failed to read admin.json:', fileError);
            // Fall back to env variables if JSON file doesn't exist
            adminData = {
                email: process.env.ADMIN_EMAIL || 'admin@admin.com',
                passwordHash: process.env.ADMIN_PASSWORD_HASH || '$2b$10$NzP7CQeDHWshNXrg5kpCtOSb4iXRlWRoKA1uyhypOCVHuSFuaIaey',
            };
        }

        const { email: adminEmail, passwordHash: adminPasswordHash } = adminData;

        if (!adminEmail || !adminPasswordHash) {
            return NextResponse.json(
                { error: 'Admin credentials not configured' },
                { status: 500 }
            );
        }

        // Verify email
        if (email !== adminEmail) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await comparePassword(password, adminPasswordHash);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = await generateToken({
            email: adminEmail,
            role: 'admin',
        });

        // Create response with token in cookie
        const response = NextResponse.json(
            {
                success: true,
                message: 'Login successful',
                user: {
                    email: adminEmail,
                    role: 'admin',
                },
            },
            { status: 200 }
        );

        // Set HTTP-only cookie
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
