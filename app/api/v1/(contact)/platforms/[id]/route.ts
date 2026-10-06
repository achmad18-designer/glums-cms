import { deletePlatform, updatePlatform } from '@/features/platforms/platforms.controller';

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function PUT(
    request: Request,
    { params }: Params
) {
    const { id } = await params;
    const body = await request.json();

    // VerifyToken
    // updatePlatform(id, body)
    return updatePlatform(id, body);
}

export async function DELETE(
    request: Request,
    { params }: Params
) {
    const { id } = await params;

    // VerifyToken
    // deletePlatform(id)

    return deletePlatform(id);
}