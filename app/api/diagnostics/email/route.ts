import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function GET() {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        return NextResponse.json({
            error: 'Credentials missing',
            hasUser: !!user,
            hasPass: !!pass,
        }, { status: 500 });
    }

    const cleanPass = pass.replace(/\s/g, '');

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user,
                pass: cleanPass,
            },
        });

        console.log('Diagnostic: Verifying transporter connection...');
        await transporter.verify();
        console.log('Diagnostic: Connection successful.');

        console.log('Diagnostic: Attempting to send test email...');
        const info = await transporter.sendMail({
            from: user,
            to: user,
            subject: 'Production Email Diagnostic Test',
            text: 'If you receive this, your production email service is working correctly.',
            html: '<h1>Diagnostic Successful</h1><p>Your production email service is working correctly.</p>',
        });

        return NextResponse.json({
            success: true,
            status: 'Connection and send verified',
            messageId: info.messageId,
            response: info.response,
        });

    } catch (error: any) {
        console.error('Diagnostic: Email failure:', error);

        return NextResponse.json({
            success: false,
            error: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
