import { updateSettings } from '@/features/settings/settings.controller';

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    context: RouteContext
) {
    const { id } = await context.params;

    return updateSettings(id, request);
}