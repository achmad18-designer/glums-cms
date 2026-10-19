import {
    errorResponse,
    successResponse,
} from '@/utils/response';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import {
    clearRefreshToken,
    generateAccessToken,
    generateRefreshToken,
    getUserByEmail,
    getUserByRefreshToken,
    updateRefreshToken,
    verifyRefreshToken
} from './auth.helper';
import { loginSchema } from './auth.schema';
import { Prisma } from '@/src/generated/prisma/client';

export async function login(request: Request) {
    try {
        const body = await request.json();
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        const { email, password } = validation.data;

        const user = await getUserByEmail(email);

        if (!user) {
            return errorResponse('Invalid credentials', 401);
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return errorResponse('Invalid credentials', 401);
        }

        if (user.role !== 'master') {
            return errorResponse(
                'You are not authorized to login',
                403
            );
        }

        const accessToken = await generateAccessToken(
            user.username
        );

        const refreshToken = await generateRefreshToken(
            user.username
        );

        await updateRefreshToken(
            user.id,
            refreshToken
        );

        const response = successResponse(
            {
                accessToken,
            },
            'Login successful'
        );

        response.cookies.set({
            name: 'refreshToken',
            value: refreshToken,
            httpOnly: true,
            maxAge: 24 * 60 * 60,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return response;
    } catch (error) {
        console.error("Login controller error:", error);

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P1001"
        ) {
            return errorResponse(
                "Database is currently unavailable",
                503
            );
        }

        return errorResponse(
            "Internal server error",
            500
        );
    }
}

export async function refreshToken() {
    try {
        /**
         * 1. Get refresh token from cookie
         */
        const cookieStore = await cookies();

        const refreshToken = cookieStore.get(
            'refreshToken'
        )?.value;

        if (!refreshToken) {
            return errorResponse(
                'Unauthorized. Please login first.',
                401
            );
        }

        /**
         * 2. Match refresh token with database
         */
        const user = await getUserByRefreshToken(
            refreshToken
        );

        if (!user) {
            return errorResponse(
                'Invalid refresh token',
                403
            );
        }

        /**
         * 3. Verify JWT refresh token
         */
        try {
            await verifyRefreshToken(refreshToken);
        } catch {
            return errorResponse(
                'Invalid refresh token',
                403
            );
        }

        /**
         * 4. Make sure only master can refresh token
         */
        if (user.role !== 'master') {
            return errorResponse(
                'You are not authorized',
                403
            );
        }

        /**
         * 5. Generate new access token
         */
        const accessToken = await generateAccessToken(
            user.username
        );

        return successResponse({
            accessToken,
        });
    } catch (error) {
        console.error(error);

        return errorResponse(
            'Internal server error',
            500
        );
    }
}

export async function logout() {
    try {

        const cookieStore = await cookies();

        const refreshToken = cookieStore.get(
            'refreshToken'
        )?.value;

        if (!refreshToken) {
            return errorResponse(
                'Unauthorized. Please login first.',
                401
            )
        }

        const user = await getUserByRefreshToken(
            refreshToken
        );

        if (!user) {
            return errorResponse(
                'Invalid refresh token',
                403
            )
        }

        await clearRefreshToken(user.id);

        cookieStore.delete('refreshToken');

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error(error);

        return errorResponse(
            'Internal server error',
            500
        )
    }
}