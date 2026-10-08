import { logout } from "@/features/auth/auth.controller";
import { verifyAccessToken } from "@/features/auth/auth.middleware";
import { errorResponse } from "@/utils/response";

export async function DELETE(request: Request) {
    const payload = await verifyAccessToken(request);

    if (!payload) {
        return errorResponse(
            'Unauthorized. Please login first.',
            401
        )
    }

    return await logout();
}