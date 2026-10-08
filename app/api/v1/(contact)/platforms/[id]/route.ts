import { verifyAccessToken } from '@/features/auth/auth.middleware';
import { deletePlatform, updatePlatform } from '@/features/platforms/platforms.controller';
import { errorResponse } from '@/utils/response';

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function PUT(
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
    const body = await request.json();

    return updatePlatform(id, body);
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
    return deletePlatform(id);
}