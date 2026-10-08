import { verifyAccessToken } from "@/features/auth/auth.middleware";
import { createService, getServicesData } from "@/features/services/services.controller";
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

    return createService(request);
}

export async function GET() {
    return getServicesData();
}