import prisma from '@/src/lib/prisma';
import { jwtVerify, SignJWT } from 'jose';

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}

export async function updateRefreshToken(
    id: number,
    refreshToken: string
) {
    return prisma.user.update({
        where: {
            id,
        },
        data: {
            refreshToken,
        },
    });
}

export async function getUserByRefreshToken(
    refreshToken: string
) {
    return prisma.user.findFirst({
        where: {
            refreshToken,
        },
    });
}

const secretTokenKey = new TextEncoder().encode(
    process.env.SECRET_TOKEN_KEY
);

const refreshTokenKey = new TextEncoder().encode(
    process.env.REFRESH_TOKEN_KEY
);

export function getSecretKey(
    value: string | undefined,
    name: string
) {
    if (!value) {
        throw new Error(
            `${name} environment variable is not configured`
        );
    }

    return new TextEncoder().encode(value);
}

export async function verifyRefreshToken(
    refreshToken: string
) {
    const secretKey = getSecretKey(
        process.env.REFRESH_TOKEN_KEY,
        'REFRESH_TOKEN_KEY'
    );

    return jwtVerify(
        refreshToken,
        secretKey
    );
}

export async function generateAccessToken(username: string) {
    return new SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('20s')
        .sign(secretTokenKey);
}

export async function generateRefreshToken(username: string) {
    return new SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1d')
        .sign(refreshTokenKey);
}

export async function clearRefreshToken(
    id: number
) {
    return prisma.user.update({
        where: {
            id,
        },
        data: {
            refreshToken: null,
        },
    });
}