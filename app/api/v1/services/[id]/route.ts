import { verifyAccessToken } from "@/features/auth/auth.middleware";
import { deleteService, getServiceDataById, updateService } from "@/features/services/services.controller";
import { errorResponse } from "@/utils/response";

type Params = {
    params: Promise<{
        id: string;
    }>;
};
export async function GET(request: Request, { params }: Params) {
    const id = (await params).id;
    return getServiceDataById(id);
}

export async function PATCH(
    request: Request,
    { params }: Params
) {
    // VerifyToken
    const payload = await verifyAccessToken(request);

    if (!payload) {
        return errorResponse(
            'Unauthorized. Please login first.',
            401
        )
    }

    const { id } = await params;


    return updateService(id, request);
}

export async function DELETE(
    request: Request,
    { params }: Params
) {
    // VerifyToken
    const payload = await verifyAccessToken(request);

    if (!payload) {
        return errorResponse(
            'Unauthorized. Please login first.',
            401
        )
    }

    const { id } = await params;

    return deleteService(id);
}