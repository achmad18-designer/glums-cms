import { verifyAccessToken } from "@/features/auth/auth.middleware";
import { deleteSubService, getSubServiceDataById, updateSubService } from "@/features/sub-services/sub-services.controller";
import { errorResponse } from "@/utils/response";

type Params = {
    params: Promise<{
        id: string;
    }>;
};
export async function GET(request: Request, { params }: Params) {
    const id = (await params).id;
    return getSubServiceDataById(id);
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


    return updateSubService(id, request);
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

    return deleteSubService(id);
}