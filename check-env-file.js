const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

try {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('File exists and is readable.');
    console.log('Content length:', content.length);

    const lines = content.split('\n');
    lines.forEach(line => {
        if (line.startsWith('ADMIN_EMAIL=')) {
            console.log('Found ADMIN_EMAIL:', line.split('=')[1]);
        }
        if (line.startsWith('ADMIN_PASSWORD_HASH=')) {
            console.log('Found ADMIN_PASSWORD_HASH (prefix):', line.split('=')[1].substring(0, 10) + '...');
        }
    });
} catch (err) {
    console.error('Error reading file:', err);
}
