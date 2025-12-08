import bcrypt from 'bcryptjs';

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function comparePassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate a password hash synchronously (for setup)
 */
export function hashPasswordSync(password: string): string {
    return bcrypt.hashSync(password, 10);
}
