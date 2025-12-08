import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
    email: string;
    role: 'admin';
    iat?: number;
    exp?: number;
}

/**
 * Generate JWT token
 */
export async function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
    return new SignJWT(payload as any)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(secret);
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as JWTPayload;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

/**
 * Decode JWT token without verification (for debugging)
 * Note: jose doesn't have a direct decode method like jsonwebtoken, 
 * but we can use jwtVerify for verification which is safer.
 */
export function decodeToken(token: string): JWTPayload | null {
    // jose doesn't support unsafe decode easily, and we shouldn't need it.
    // If needed, we can parse the base64 part manually.
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        return JSON.parse(atob(parts[1]));
    } catch (e) {
        return null;
    }
}
