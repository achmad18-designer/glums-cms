import {
    createSettings,
    getSettingsController,
} from '@/features/settings/settings.controller';

export async function POST(request: Request) {
    return createSettings(request);
}

export async function GET() {
    return getSettingsController();
}