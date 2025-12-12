import nodemailer from 'nodemailer';
import { join } from 'path';

export async function sendContactEmail(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    attachment?: string;
}) {
    const { name, email, phone, subject, message, attachment } = data;

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        console.warn('Gmail credentials not found. Skipping email notification.');
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user,
                pass: pass.replace(/\s/g, ''), // Remove spaces if present
            },
        });

        const mailOptions: any = {
            from: user,
            to: user, // Send to self
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                ${attachment ? `<p><strong>Attachment:</strong> <a href="${attachment}">View Document</a></p>` : ''}
            `,
        };

        // Only attach if it's a local file (not starting with http)
        if (attachment && !attachment.startsWith('http')) {
            const filepath = join(process.cwd(), 'public', attachment);
            const filename = attachment.split('/').pop() || 'document';

            mailOptions.attachments = [{
                filename: filename,
                path: filepath
            }];
        }

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}
