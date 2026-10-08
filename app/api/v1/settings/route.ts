import { verifyAccessToken } from '@/features/auth/auth.middleware';
import {
    createSettings,
    getSettingsController,
} from '@/features/settings/settings.controller';
import { errorResponse } from '@/utils/response';

export async function POST(request: Request) {
    const payload = await verifyAccessToken(request);

    if (!payload) {
        return errorResponse(
            'Unauthorized. Please login first.',
            401
        )
    }

    return createSettings(request);
}

export async function GET() {
    return getSettingsController();
}