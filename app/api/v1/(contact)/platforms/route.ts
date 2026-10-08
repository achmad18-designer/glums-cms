import { verifyAccessToken } from "@/features/auth/auth.middleware";
import { createPlatform, getPlatforms } from "@/features/platforms/platforms.controller";
import { errorResponse } from "@/utils/response";

export async function GET() {
    return getPlatforms();
}

export async function POST(request: Request) {
    const body = await request.json();
    // VerifyToken
    const payload = await verifyAccessToken(request);

    if (!payload) {
        return errorResponse(
            'Unauthorized. Please login first.',
            401
        )
    }

    return createPlatform(body);
}