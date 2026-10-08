import { verifyAccessToken } from '@/features/auth/auth.middleware';
import { updateSettings } from '@/features/settings/settings.controller';
import { errorResponse } from '@/utils/response';

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    context: RouteContext
) {
    const payload = await verifyAccessToken(request);

    if (!payload) {
        return errorResponse(
            'Unauthorized. Please login first.',
            401
        )
    }

    const { id } = await context.params;

    return updateSettings(id, request);
}