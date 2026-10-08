import { jwtVerify } from 'jose';

function getSecretKey() {
    const secret = process.env.SECRET_TOKEN_KEY;

    if (!secret) {
        throw new Error(
            'SECRET_TOKEN_KEY environment variable is not configured'
        );
    }

    return new TextEncoder().encode(secret);
}

export async function verifyAccessToken(
    request: Request
) {
    const authHeader = request.headers.get(
        'authorization'
    );

    if (!authHeader) {
        return null;
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(
            token,
            getSecretKey()
        );

        return payload;
    } catch {
        return null;
    }
}