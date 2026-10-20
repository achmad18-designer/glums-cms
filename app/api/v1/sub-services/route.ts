import { verifyAccessToken } from "@/features/auth/auth.middleware";
import { createSubService, getSubServicesData } from "@/features/sub-services/sub-services.controller";
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

    return createSubService(request);
}

export async function GET() {
    return getSubServicesData();
}