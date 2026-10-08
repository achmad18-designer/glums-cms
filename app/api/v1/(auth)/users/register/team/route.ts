import { verifyAccessToken } from "@/features/auth/auth.middleware";
import { registerTeam } from "@/features/users/users.controller";
import { errorResponse } from "@/utils/response";

export async function POST(request: Request) {
    // VerifyToken
    const payload = await verifyAccessToken(request);

    if (!payload) {
        return errorResponse(
            'Unauthorized. Please login first.',
            401
        )
    }

    return registerTeam(request);
}