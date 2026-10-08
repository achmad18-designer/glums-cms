import { verifyAccessToken } from "@/features/auth/auth.middleware";
import { deleteMessage, getDetailMessage } from "@/features/contacts/contacts.controller";
import { errorResponse } from "@/utils/response";

type Params = {
    params: Promise<{
        id: string;
    }>;
};
export async function GET(
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
    return getDetailMessage(id);
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
    return deleteMessage(id);
}