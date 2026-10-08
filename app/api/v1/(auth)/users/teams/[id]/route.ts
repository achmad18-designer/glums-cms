import { verifyAccessToken } from "@/features/auth/auth.middleware";
import { deleteTeamUser, updateTeamUser } from "@/features/users/users.controller";
import { errorResponse } from "@/utils/response";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(request: Request, { params }: Params) {
    // VerifyToken
    const payload = await verifyAccessToken(request);

    if (!payload) {
        return errorResponse(
            'Unauthorized. Please login first.',
            401
        )
    }

    const { id } = await params;
    return deleteTeamUser(id);
}

export async function PATCH(request: Request, { params }: Params) {
    // VerifyToken
    const payload = await verifyAccessToken(request);

    if (!payload) {
        return errorResponse(
            'Unauthorized. Please login first.',
            401
        )
    }

    const { id } = await params;
    return updateTeamUser(id, request);
}