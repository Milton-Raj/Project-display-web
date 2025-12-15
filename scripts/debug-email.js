const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
    console.log(`Loading environment variables from ${envLocalPath}`);
    const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} else {
    console.warn('.env.local not found!');
}

async function debugEmail() {
    console.log('--- Starting Email Debug ---');

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    console.log('GMAIL_USER present:', !!user);
    if (user) console.log('GMAIL_USER:', user);
    console.log('GMAIL_APP_PASSWORD present:', !!pass);
    if (!user || !pass) {
        console.error('Missing credentials. Cannot proceed.');
        return;
    }

    const cleanPass = pass.replace(/\s/g, '');
    console.log('Password length (cleaned):', cleanPass.length);

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: cleanPass,
            },
        });

        console.log('Verifying transporter connection...');
        await transporter.verify();
        console.log('Transporter connection successful.');

        console.log('Attempting to send test email...');
        const info = await transporter.sendMail({
            from: user,
            to: user, // Send to self
            subject: 'Debug Email Test',
            text: 'If you receive this, the email configuration is working.',
        });

        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);

    } catch (error) {
        console.error('Error during email debug:', error);
        if (error.code === 'EAUTH') {
            console.error('Authentication check failed. Please check your App Password.');
        }
    }
}

debugEmail();
