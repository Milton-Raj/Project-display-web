// Quick test script to verify environment variables
console.log('Environment Variables Test:');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH?.substring(0, 20) + '...');
console.log('JWT_SECRET:', process.env.JWT_SECRET?.substring(0, 20) + '...');
