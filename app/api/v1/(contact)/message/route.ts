import { verifyAccessToken } from "@/features/auth/auth.middleware";
import { getAllMessages } from "@/features/contacts/contacts.controller";
import { errorResponse } from "@/utils/response";

export async function GET(request: Request) {
    // VerifyToken
    const payload = await verifyAccessToken(request);

    if (!payload) {
        return errorResponse(
            'Unauthorized. Please login first.',
            401
        )
    }

    return getAllMessages();
}